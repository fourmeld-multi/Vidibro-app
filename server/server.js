const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 4000;
const ALLOWED_ORIGIN = process.env.FRONTEND_ORIGIN || '*';

const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN }));

/** @type {Record<'video'|'audio'|'text', string[]>} */
const queues = {
  video: [],
  audio: [],
  text: [],
};

/** @type {Map<string, { roomId: string, partnerId: string, mode: string }>} */
const activePairs = new Map();

/** @type {Map<string, 'IDLE' | 'WAITING' | 'MATCHING' | 'CONNECTED'>} */
const userStates = new Map();

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    waiting: {
      video: queues.video.length,
      audio: queues.audio.length,
      text: queues.text.length,
    },
    activePairs: activePairs.size / 2,
    timestamp: new Date().toISOString(),
  });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: ALLOWED_ORIGIN, methods: ['GET', 'POST'] },
  transports: ['websocket'],
  // Tightened WebSocket Heartbeats (3s interval / 3s timeout) to instantly purge ghost sessions
  pingInterval: 3000,
  pingTimeout: 3000,
});

function removeFromQueues(socketId) {
  for (const mode of ['video', 'audio', 'text']) {
    const idx = queues[mode].indexOf(socketId);
    if (idx !== -1) {
      queues[mode].splice(idx, 1);
    }
  }
}

function processQueue(mode) {
  const queue = queues[mode];
  if (!queue) return;

  while (queue.length >= 2) {
    const p1Id = queue.shift();
    const p2Id = queue.shift();

    const p1Socket = io.sockets.sockets.get(p1Id);
    const p2Socket = io.sockets.sockets.get(p2Id);

    // Evict stale/disconnected sockets without burning queue turn
    if (!p1Socket || !p1Socket.connected) {
      if (p2Socket && p2Socket.connected) queue.unshift(p2Id);
      continue;
    }
    if (!p2Socket || !p2Socket.connected) {
      if (p1Socket && p1Socket.connected) queue.unshift(p1Id);
      continue;
    }

    const roomId = `room-${mode}-${p1Id}-${p2Id}`;
    p1Socket.join(roomId);
    p2Socket.join(roomId);

    activePairs.set(p1Id, { roomId, partnerId: p2Id, mode });
    activePairs.set(p2Id, { roomId, partnerId: p1Id, mode });

    userStates.set(p1Id, 'CONNECTED');
    userStates.set(p2Id, 'CONNECTED');

    p1Socket.emit('match:found', { roomId, role: 'initiator', mode });
    p2Socket.emit('match:found', { roomId, role: 'receiver', mode });
  }
}

io.on('connection', (socket) => {
  if (socket.request) socket.request = null;
  userStates.set(socket.id, 'IDLE');

  socket.on('queue:join', (data) => {
    const mode = (data && data.mode) || 'video';
    
    // Cleanup any prior stale state/room
    cleanup(socket.id);

    userStates.set(socket.id, 'WAITING');
    if (!queues[mode].includes(socket.id)) {
      queues[mode].push(socket.id);
    }

    processQueue(mode);
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

  function cleanup(socketId) {
    removeFromQueues(socketId);
    userStates.delete(socketId);

    const pair = activePairs.get(socketId);
    if (pair) {
      activePairs.delete(socketId);
      activePairs.delete(pair.partnerId);
      userStates.set(pair.partnerId, 'IDLE');
      socket.to(pair.roomId).emit('peer:left');

      // Both peers must actually leave the socket.io room. Without this the
      // socket stays subscribed to every room it has ever been matched into,
      // so after a few "Next" presses signalling gets fanned out to stale
      // rooms and offers/answers cross-talk between unrelated calls.
      socket.leave(pair.roomId);
      const partnerSocket = io.sockets.sockets.get(pair.partnerId);
      if (partnerSocket) partnerSocket.leave(pair.roomId);
    }
  }

  socket.on('queue:leave', () => {
    cleanup(socket.id);
    userStates.set(socket.id, 'IDLE');
  });

  socket.on('disconnect', () => {
    cleanup(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Vidibro matchmaking & signaling server running on port :${PORT}`);
});
