const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN }));

app.get('/health', (req, res) => {
  res.json({ ok: true, waiting: waitingQueue.length, active: activePairs.size / 2 });
});

const server = http.createServer(app);

// Signaling-only server: no chat/game/reaction/media data ever reaches this
// process, and no per-connection state is kept beyond {roomId, partnerId} —
// see the architecture note in the project plan.
const io = new Server(server, {
  cors: { origin: ALLOWED_ORIGIN, methods: ['GET', 'POST'] },
  // Pure WebSocket transport only — no long-polling fallback, which removes
  // the per-request HTTP header overhead polling would otherwise add.
  transports: ['websocket'],
});

/** @type {string[]} FIFO queue of waiting socket ids. */
const waitingQueue = [];
/** @type {Map<string, {roomId: string, partnerId: string}>} */
const activePairs = new Map();

function removeFromQueue(socketId) {
  const idx = waitingQueue.indexOf(socketId);
  if (idx !== -1) waitingQueue.splice(idx, 1);
}

io.on('connection', (socket) => {
  // Strip the stored request reference once the handshake is done — nothing
  // downstream needs headers/cookies for a fully anonymous signaling relay,
  // and holding onto it just wastes memory per open connection.
  if (socket.request) socket.request = null;

  socket.on('queue:join', () => {
    // Already matched or already waiting — ignore duplicate joins.
    if (activePairs.has(socket.id) || waitingQueue.includes(socket.id)) return;

    while (waitingQueue.length > 0) {
      const partnerId = waitingQueue.shift();
      const partnerSocket = io.sockets.sockets.get(partnerId);
      if (!partnerSocket) continue; // stale entry (disconnected while queued) — try the next one

      const roomId = `room-${socket.id}-${partnerId}`;
      socket.join(roomId);
      partnerSocket.join(roomId);
      activePairs.set(socket.id, { roomId, partnerId });
      activePairs.set(partnerId, { roomId, partnerId: socket.id });

      // Whoever was already waiting initiates the offer — arbitrary but
      // deterministic, and also becomes the mini-game "host" authority.
      partnerSocket.emit('match:found', { roomId, role: 'initiator' });
      socket.emit('match:found', { roomId, role: 'receiver' });
      return;
    }

    waitingQueue.push(socket.id);
  });

  socket.on('signal:offer', ({ roomId, sdp }) => {
    socket.to(roomId).emit('signal:offer', { sdp });
  });

  socket.on('signal:answer', ({ roomId, sdp }) => {
    socket.to(roomId).emit('signal:answer', { sdp });
  });

  socket.on('signal:ice-candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('signal:ice-candidate', { candidate });
  });

  function cleanup() {
    removeFromQueue(socket.id);
    const pair = activePairs.get(socket.id);
    if (pair) {
      activePairs.delete(socket.id);
      activePairs.delete(pair.partnerId);
      socket.to(pair.roomId).emit('peer:left');
    }
  }

  socket.on('queue:leave', cleanup); // "Next" button
  socket.on('disconnect', cleanup); // tab close / network drop
});

server.listen(PORT, () => {
  console.log(`Vidibro signaling server listening on :${PORT}`);
});
