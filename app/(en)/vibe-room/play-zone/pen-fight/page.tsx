"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";

/* ── physics constants (realistic, short-slide) ─── */
const W = 360, H = 560;
const PL = 44, PR = 4.2;
const FRIC  = 0.93;   // high friction — pens stop quickly like real desk
const AFRIC = 0.88;
const MAX_V = 8;      // low max speed
const WIN   = 3;

type Phase = "idle"|"aiming"|"moving"|"cpu_wait"|"cpu_move"|"round_end"|"game_over";
interface Pen { x:number;y:number;a:number;vx:number;vy:number;va:number;out:boolean }
interface GS {
  p1:Pen; p2:Pen; phase:Phase; lastPhase:"moving"|"cpu_move"|null;
  drag:{x:number;y:number}|null; s1:number; s2:number; msg:string;
  tmr:ReturnType<typeof setTimeout>|null;
  clackAt:number; // cooldown for clack sound
}

const mkP=(x:number,y:number,a:number):Pen=>({x,y,a,vx:0,vy:0,va:0,out:false});

function penEnds(p:Pen):[number,number,number,number]{
  const c=Math.cos(p.a),s=Math.sin(p.a);
  return[p.x-c*PL,p.y-s*PL,p.x+c*PL,p.y+s*PL];
}
function closestOnSeg(px:number,py:number,ax:number,ay:number,bx:number,by:number):[number,number]{
  const dx=bx-ax,dy=by-ay,l2=dx*dx+dy*dy;
  if(l2<1e-4)return[ax,ay];
  const t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/l2));
  return[ax+t*dx,ay+t*dy];
}
function capsuleCollide(a:Pen,b:Pen):boolean{
  if(a.out||b.out)return false;
  const[a1x,a1y,a2x,a2y]=penEnds(a);
  const[b1x,b1y,b2x,b2y]=penEnds(b);
  let md=1e9,cpax=0,cpay=0,cpbx=0,cpby=0;
  for(let t=0;t<=1;t+=0.05){
    const px=a1x+(a2x-a1x)*t,py=a1y+(a2y-a1y)*t;
    const[qx,qy]=closestOnSeg(px,py,b1x,b1y,b2x,b2y);
    const d=Math.hypot(px-qx,py-qy);
    if(d<md){md=d;cpax=px;cpay=py;cpbx=qx;cpby=qy;}
  }
  const MIN=PR*2.5;
  if(md>=MIN||md<0.01)return false;
  const nx=(cpax-cpbx)/md,ny=(cpay-cpby)/md;
  const rv=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;
  if(rv>=0)return false;
  const j=-(1.1)*rv/2;  // low restitution = less bounce
  a.vx+=j*nx;a.vy+=j*ny;b.vx-=j*nx;b.vy-=j*ny;
  a.va+=((cpax-a.x)*ny-(cpay-a.y)*nx)*0.04;
  b.va-=((cpbx-b.x)*ny-(cpby-b.y)*nx)*0.04;
  const ov=MIN-md;
  a.x+=nx*ov*.55;a.y+=ny*ov*.55;b.x-=nx*ov*.45;b.y-=ny*ov*.45;
  return true;
}

/* ── rrect helper ──────────────────────────────── */
function rr(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arc(x+w-r,y+r,r,-Math.PI/2,0);
  ctx.lineTo(x+w,y+h-r);ctx.arc(x+w-r,y+h-r,r,0,Math.PI/2);
  ctx.lineTo(x+r,y+h);ctx.arc(x+r,y+h-r,r,Math.PI/2,Math.PI);
  ctx.lineTo(x,y+r);ctx.arc(x+r,y+r,r,Math.PI,-Math.PI/2);
  ctx.closePath();
}

/* ── pen drawing ─────────────────────────────── */
function drawPen(ctx:CanvasRenderingContext2D,pen:Pen,isP:boolean,idle:boolean){
  if(pen.out)return;
  ctx.save();ctx.translate(pen.x,pen.y);ctx.rotate(pen.a);
  const L=PL,R=PR,W2=R*2;

  // shadow
  ctx.save();ctx.shadowColor="rgba(0,0,0,.5)";ctx.shadowBlur=7;ctx.shadowOffsetX=2;ctx.shadowOffsetY=4;
  ctx.fillStyle="rgba(0,0,0,.01)";rr(ctx,-L,-R,L*2,W2,R);ctx.fill();ctx.restore();

  if(isP){
    // body
    const bg=ctx.createLinearGradient(0,-R,0,R);
    bg.addColorStop(0,"#082e80");bg.addColorStop(.2,"#1565c0");bg.addColorStop(.45,"#3a90e8");
    bg.addColorStop(.58,"#2878d4");bg.addColorStop(.82,"#114db0");bg.addColorStop(1,"#061a50");
    ctx.fillStyle=bg;rr(ctx,-L,-R,L*2,W2,R);ctx.fill();
    // cap
    const cg=ctx.createLinearGradient(0,-R,0,R);
    cg.addColorStop(0,"#061a50");cg.addColorStop(.4,"#0c3070");cg.addColorStop(1,"#030c28");
    ctx.fillStyle=cg;rr(ctx,-L,-R,18,W2,R);ctx.fill();
    // ink window
    ctx.fillStyle="rgba(225,238,255,.84)";rr(ctx,-L+24,-R+1.2,22,W2-2.4,1.2);ctx.fill();
    ctx.fillStyle="rgba(28,95,215,.42)";rr(ctx,-L+25.5,-R+2,19,W2-4,.8);ctx.fill();
    // grip ribs
    const gg=ctx.createLinearGradient(0,-R,0,R);
    gg.addColorStop(0,"#0c3070");gg.addColorStop(.4,"#1a5cb0");gg.addColorStop(1,"#071e50");
    ctx.fillStyle=gg;rr(ctx,L-24,-R-.5,20,W2+1,R);ctx.fill();
    ctx.strokeStyle="rgba(4,16,64,.5)";ctx.lineWidth=.7;
    for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(L-22+i*4,-R-.2);ctx.lineTo(L-22+i*4,R+.2);ctx.stroke();}
    // nib
    const ng=ctx.createLinearGradient(0,-R,0,R);
    ng.addColorStop(0,"#888");ng.addColorStop(.3,"#d8d8d8");ng.addColorStop(.5,"#f0f0f0");ng.addColorStop(.7,"#c0c0c0");ng.addColorStop(1,"#666");
    ctx.fillStyle=ng;ctx.beginPath();ctx.moveTo(L-4,-R*.62);ctx.lineTo(L+11,0);ctx.lineTo(L-4,R*.62);ctx.closePath();ctx.fill();
    ctx.fillStyle="#111";ctx.beginPath();ctx.arc(L+10,0,1,0,Math.PI*2);ctx.fill();
    // text
    ctx.save();ctx.fillStyle="rgba(255,255,255,.22)";ctx.font="bold 3.5px sans-serif";
    ctx.fillText("REYNOLDS 045",-L+23,-R+4.2);ctx.restore();
    // clip
    ctx.fillStyle="#bbb";ctx.fillRect(-L+1,-R-1.5,30,1.4);
    ctx.fillStyle="#ccc";ctx.beginPath();ctx.arc(-L+31,-R-.8,1.8,0,Math.PI*2);ctx.fill();
    // glow on idle
    if(idle){ctx.shadowColor="rgba(66,165,245,.7)";ctx.shadowBlur=20;ctx.strokeStyle="rgba(66,165,245,.55)";ctx.lineWidth=1.5;rr(ctx,-L,-R,L*2,W2,R);ctx.stroke();ctx.shadowBlur=0;}
  } else {
    // black body
    const bg=ctx.createLinearGradient(0,-R,0,R);
    bg.addColorStop(0,"#0a0a0a");bg.addColorStop(.2,"#1e1e1e");bg.addColorStop(.44,"#303030");
    bg.addColorStop(.58,"#1c1c1c");bg.addColorStop(.82,"#0d0d0d");bg.addColorStop(1,"#040404");
    ctx.fillStyle=bg;rr(ctx,-L,-R,L*2,W2,R);ctx.fill();
    // cap
    ctx.fillStyle="#060606";rr(ctx,-L,-R,18,W2,R);ctx.fill();
    // ink window
    ctx.fillStyle="rgba(215,215,215,.72)";rr(ctx,-L+24,-R+1.2,22,W2-2.4,1.2);ctx.fill();
    ctx.fillStyle="rgba(18,18,18,.5)";rr(ctx,-L+25.5,-R+2,19,W2-4,.8);ctx.fill();
    // red band
    const rg=ctx.createLinearGradient(0,-R,0,R);
    rg.addColorStop(0,"#7a0000");rg.addColorStop(.4,"#cc0000");rg.addColorStop(.6,"#e53030");rg.addColorStop(1,"#580000");
    ctx.fillStyle=rg;rr(ctx,L-27,-R-.3,8,W2+.6,1.5);ctx.fill();
    // grip
    const gg2=ctx.createLinearGradient(0,-R,0,R);
    gg2.addColorStop(0,"#111");gg2.addColorStop(.4,"#222");gg2.addColorStop(1,"#080808");
    ctx.fillStyle=gg2;rr(ctx,L-19,-R-.5,18,W2+1,R);ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,.07)";ctx.lineWidth=.7;
    for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(L-18+i*4,-R-.2);ctx.lineTo(L-18+i*4,R+.2);ctx.stroke();}
    // nib
    const ng2=ctx.createLinearGradient(0,-R,0,R);
    ng2.addColorStop(0,"#7a7a7a");ng2.addColorStop(.3,"#c8c8c8");ng2.addColorStop(.5,"#e8e8e8");ng2.addColorStop(.7,"#b0b0b0");ng2.addColorStop(1,"#5a5a5a");
    ctx.fillStyle=ng2;ctx.beginPath();ctx.moveTo(L-4,-R*.62);ctx.lineTo(L+11,0);ctx.lineTo(L-4,R*.62);ctx.closePath();ctx.fill();
    ctx.fillStyle="#111";ctx.beginPath();ctx.arc(L+10,0,1,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#3a3a3a";ctx.fillRect(-L+1,-R-1.5,30,1.4);
    ctx.fillStyle="#484848";ctx.beginPath();ctx.arc(-L+31,-R-.8,1.8,0,Math.PI*2);ctx.fill();
  }
  // highlight streak
  const sh=ctx.createLinearGradient(-L,0,L,0);
  sh.addColorStop(0,"rgba(255,255,255,0)");sh.addColorStop(.15,"rgba(255,255,255,.28)");
  sh.addColorStop(.85,"rgba(255,255,255,.28)");sh.addColorStop(1,"rgba(255,255,255,0)");
  ctx.fillStyle=sh;rr(ctx,-L+4,-R,L*2-8,R*.52,.4);ctx.fill();
  ctx.restore();
}

/* ── table drawing ──────────────────────────── */
function drawTable(ctx:CanvasRenderingContext2D,g:GS){
  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,"#b5722a");bg.addColorStop(.35,"#c88748");bg.addColorStop(.65,"#d4955a");bg.addColorStop(1,"#b06228");
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  const zone=ctx.createRadialGradient(W*.6,H*.4,60,W*.6,H*.4,340);
  zone.addColorStop(0,"rgba(220,165,90,.22)");zone.addColorStop(1,"rgba(80,40,8,.1)");
  ctx.fillStyle=zone;ctx.fillRect(0,0,W,H);
  // grain
  const gc=["rgba(100,52,8,.13)","rgba(80,38,4,.1)","rgba(140,78,20,.07)","rgba(60,28,2,.15)","rgba(170,100,35,.06)"];
  for(let p=0;p<5;p++){
    ctx.strokeStyle=gc[p];ctx.lineWidth=p%2===0?.8:1.1;
    const sd=p*37;
    for(let i=0;i<H;i+=7+p*3){
      const y=i+(sd%11);
      ctx.beginPath();ctx.moveTo(0,y+Math.sin(y*.04+sd)*5);
      ctx.bezierCurveTo(W*.25,y+Math.cos(y*.03+sd)*8,W*.65,y+Math.sin(y*.025+sd*.7)*6,W,y+Math.cos(y*.05+sd)*4);
      ctx.stroke();
    }
  }
  // knots
  [[W*.78,H*.18,.3],[W*.22,H*.78,-.25]].forEach(([kx,ky,ka])=>{
    ctx.save();ctx.translate(kx,ky);
    for(let r=16;r>2;r-=4){ctx.strokeStyle=`rgba(78,36,3,${.04+(16-r)*.006})`;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,r,r*.55,ka,0,Math.PI*2);ctx.stroke();}
    ctx.restore();
  });
  // scratches
  ctx.strokeStyle="rgba(80,38,4,.1)";ctx.lineWidth=.6;
  [[W*.35,H*.52,W*.55,H*.49],[W*.6,H*.3,W*.75,H*.32],[W*.15,H*.65,W*.3,H*.63]].forEach(([x1,y1,x2,y2])=>{
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  });
  // sheen
  const sh=ctx.createRadialGradient(W*.5,H*.5,10,W*.5,H*.5,220);
  sh.addColorStop(0,"rgba(255,238,195,.07)");sh.addColorStop(1,"rgba(255,238,195,0)");
  ctx.fillStyle=sh;ctx.fillRect(0,0,W,H);
  // edge shadows
  [["l",0,0,18,H],["r",W-18,0,18,H],["t",0,0,W,18],["b",0,H-18,W,18]].forEach(([d,x,y,w,h])=>{
    const eg=d==="l"?ctx.createLinearGradient(0,0,18,0):d==="r"?ctx.createLinearGradient(W,0,W-18,0):d==="t"?ctx.createLinearGradient(0,0,0,18):ctx.createLinearGradient(0,H,0,H-18);
    eg.addColorStop(0,"rgba(0,0,0,.32)");eg.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=eg;ctx.fillRect(x as number,y as number,w as number,h as number);
  });
  // border
  ctx.strokeStyle="#7a4010";ctx.lineWidth=10;ctx.strokeRect(5,5,W-10,H-10);
  ctx.strokeStyle="#9a5a22";ctx.lineWidth=3;ctx.strokeRect(5,5,W-10,H-10);
  ctx.strokeStyle="rgba(255,200,130,.22)";ctx.lineWidth=1;ctx.strokeRect(6,6,W-12,H-12);
  // center divider
  ctx.save();ctx.setLineDash([14,12]);ctx.strokeStyle="rgba(80,38,4,.25)";ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(22,H/2);ctx.lineTo(W-22,H/2);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  // aim
  if(g.phase==="aiming"&&g.drag){
    const p=g.p1,d=g.drag;
    const dx=d.x-p.x,dy=d.y-p.y,dist=Math.hypot(dx,dy);
    const pwr=Math.min(dist/60,1);
    ctx.save();
    ctx.strokeStyle=`rgba(255,230,80,${.35+pwr*.5})`;ctx.lineWidth=1.8;ctx.setLineDash([9,8]);
    ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+dx*2,p.y+dy*2);ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle=`rgba(255,210,0,${.45+pwr*.35})`;ctx.lineWidth=3;
    ctx.beginPath();ctx.arc(p.x,p.y,22,0,Math.PI*2*pwr);ctx.stroke();
    ctx.restore();
  }
}

/* ── audio ──────────────────────────────────── */
type AC = AudioContext & { webkitAudioContext?: never };
function makeAudio(){
  const ctx=new (window.AudioContext||(window as unknown as{webkitAudioContext:typeof AudioContext}).webkitAudioContext)() as AC;

  /* classroom ambience — layered pink noise + murmur oscillators */
  function startAmbience(){
    const rate=ctx.sampleRate;
    const buf=ctx.createBuffer(1,rate*4,rate);
    const d=buf.getChannelData(0);
    let b=[0,0,0,0,0,0,0];
    for(let i=0;i<d.length;i++){
      const w=Math.random()*2-1;
      b[0]=.99886*b[0]+w*.0555179;b[1]=.99332*b[1]+w*.0750759;
      b[2]=.96900*b[2]+w*.1538520;b[3]=.86650*b[3]+w*.3104856;
      b[4]=.55000*b[4]+w*.5329522;b[5]=-.7616*b[5]-w*.0168980;
      d[i]=(b[0]+b[1]+b[2]+b[3]+b[4]+b[5]+b[6]+w*.5362)*.11;
      b[6]=w*.115926;
    }
    const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;
    const bp=ctx.createBiquadFilter();bp.type="bandpass";bp.frequency.value=700;bp.Q.value=0.35;
    const g=ctx.createGain();g.gain.value=0.045;
    src.connect(bp);bp.connect(g);g.connect(ctx.destination);src.start();

    /* distant chair/student murmur — slow-modulated oscillators */
    [130,220,310].forEach((freq,i)=>{
      const osc=ctx.createOscillator();
      const lfo=ctx.createOscillator();
      const lfoG=ctx.createGain();
      const g2=ctx.createGain();
      osc.type="sine";osc.frequency.value=freq;
      lfo.type="sine";lfo.frequency.value=0.15+i*0.07;
      lfoG.gain.value=freq*0.35;
      lfo.connect(lfoG);lfoG.connect(osc.frequency);
      g2.gain.value=0.012;
      osc.connect(g2);g2.connect(ctx.destination);
      osc.start(ctx.currentTime+i*0.4);
      lfo.start();
    });
  }

  /* pen flick — finger snap + swish */
  function playFlick(){
    const t=ctx.currentTime;
    const len=Math.floor(ctx.sampleRate*.07);
    const buf=ctx.createBuffer(1,len,ctx.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.5);
    const src=ctx.createBufferSource();src.buffer=buf;
    const hp=ctx.createBiquadFilter();hp.type="highpass";hp.frequency.value=1800;
    const g=ctx.createGain();g.gain.value=0.35;
    src.connect(hp);hp.connect(g);g.connect(ctx.destination);src.start(t);
  }

  /* pen-on-pen clack — plastic percussive hit */
  function playClack(){
    const t=ctx.currentTime;
    const osc=ctx.createOscillator();
    const g=ctx.createGain();
    const bp=ctx.createBiquadFilter();
    osc.type="square";osc.frequency.setValueAtTime(900,t);osc.frequency.exponentialRampToValueAtTime(280,t+.09);
    bp.type="bandpass";bp.frequency.value=1400;bp.Q.value=1.2;
    g.gain.setValueAtTime(.45,t);g.gain.exponentialRampToValueAtTime(.001,t+.13);
    osc.connect(bp);bp.connect(g);g.connect(ctx.destination);
    osc.start(t);osc.stop(t+.14);
    // noise component
    const nlen=Math.floor(ctx.sampleRate*.07);
    const nbuf=ctx.createBuffer(1,nlen,ctx.sampleRate);
    const nd=nbuf.getChannelData(0);
    for(let i=0;i<nlen;i++) nd[i]=(Math.random()*2-1)*Math.pow(1-i/nlen,3.5);
    const ns=ctx.createBufferSource();ns.buffer=nbuf;
    const ng=ctx.createGain();ng.gain.value=.18;
    ns.connect(ng);ng.connect(ctx.destination);ns.start(t);
  }

  /* score chime */
  function playScore(){
    const t=ctx.currentTime;
    [523,659,784].forEach((f,i)=>{
      const o=ctx.createOscillator();const g=ctx.createGain();
      o.type="sine";o.frequency.value=f;
      g.gain.setValueAtTime(0,t+i*.1);g.gain.linearRampToValueAtTime(.22,t+i*.1+.05);
      g.gain.exponentialRampToValueAtTime(.001,t+i*.1+.32);
      o.connect(g);g.connect(ctx.destination);o.start(t+i*.1);o.stop(t+i*.1+.35);
    });
  }

  /* fail thud */
  function playThud(){
    const t=ctx.currentTime;
    const o=ctx.createOscillator();const g=ctx.createGain();
    o.type="sine";o.frequency.setValueAtTime(180,t);o.frequency.exponentialRampToValueAtTime(60,t+.15);
    g.gain.setValueAtTime(.4,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);
    o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+.2);
  }

  return{startAmbience,playFlick,playClack,playScore,playThud,resume:()=>ctx.state==="suspended"&&ctx.resume()};
}

/* ── component ──────────────────────────────── */
export default function PenFightPage(){
  const cvs  = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const G    = useRef<GS>({
    p1:mkP(W/2,H*.73,.2), p2:mkP(W/2,H*.27,-.15),
    phase:"idle", lastPhase:null, drag:null, s1:0, s2:0,
    msg:"👆 Tap your blue pen and drag to flick!", tmr:null, clackAt:0,
  });
  const audio    = useRef<ReturnType<typeof makeAudio>|null>(null);
  const msgEl    = useRef<HTMLDivElement>(null);
  const btnEl    = useRef<HTMLButtonElement>(null);

  function sync(){
    const g=G.current;
    if(msgEl.current) msgEl.current.textContent=g.msg;
    if(cvs.current)   cvs.current.style.cursor=g.phase==="idle"?"pointer":"default";
    if(btnEl.current) btnEl.current.style.display=g.phase==="game_over"?"block":"none";
  }

  function initAudio(){
    if(audio.current)return;
    try{ audio.current=makeAudio(); audio.current.startAmbience(); }catch(e){ void e; }
  }

  function resetRound(){
    const g=G.current;
    if(g.tmr){clearTimeout(g.tmr);g.tmr=null;}
    g.p1=mkP(W/2+(Math.random()-.5)*70,H*.73+(Math.random()-.5)*28,(Math.random()-.5)*.7);
    g.p2=mkP(W/2+(Math.random()-.5)*70,H*.27+(Math.random()-.5)*28,(Math.random()-.5)*.7);
    g.phase="idle";g.lastPhase=null;g.drag=null;
    g.msg="Your turn — flick your pen!";sync();
  }

  function endRound(){
    const g=G.current;const{p1,p2}=g;
    let scored=false;
    if(p1.out&&!p2.out){g.s2++;g.msg="You fell off! CPU scores 😅";scored=true;audio.current?.playThud();}
    else if(p2.out&&!p1.out){g.s1++;g.msg="CPU fell! You score 🎉";scored=true;audio.current?.playScore();}
    else if(p1.out&&p2.out){g.msg="Both fell! Resetting...";scored=true;}
    sync();
    if(g.s1>=WIN||g.s2>=WIN){
      g.phase="game_over";
      g.msg=g.s1>=WIN?`🏆 You win ${g.s1}–${g.s2}!`:`💻 CPU wins ${g.s2}–${g.s1}. Try again!`;
      sync();return;
    }
    if(scored){g.phase="round_end";g.tmr=setTimeout(resetRound,1500);return;}
    if(g.lastPhase==="moving"){
      g.phase="cpu_wait";g.msg="CPU thinking... 🤔";sync();
      g.tmr=setTimeout(cpuFlick,700+Math.random()*600);
    } else {
      g.phase="idle";g.msg="Your turn — flick your pen!";sync();
    }
  }

  function cpuFlick(){
    const g=G.current;if(g.phase!=="cpu_wait")return;
    const{p1,p2}=g;
    const ang=Math.atan2(p1.y-p2.y,p1.x-p2.x)+(Math.random()-.5)*.5;
    const pwr=5+Math.random()*4; // CPU also uses realistic speed
    p2.vx=Math.cos(ang)*pwr;p2.vy=Math.sin(ang)*pwr;p2.va=(Math.random()-.5)*.12;
    g.phase="cpu_move";g.msg="CPU attacks! 💥";sync();
    audio.current?.playFlick();
  }

  function draw(){
    const c=cvs.current;if(!c)return;
    const ctx=c.getContext("2d")!;
    const g=G.current;
    drawTable(ctx,g);
    drawPen(ctx,g.p2,false,false);
    drawPen(ctx,g.p1,true,g.phase==="idle");
  }

  useEffect(()=>{
    let alive=true;
    function tick(){
      if(!alive)return;
      const g=G.current;
      const moving=g.phase==="moving"||g.phase==="cpu_move";
      if(moving){
        const{p1,p2}=g;
        p1.x+=p1.vx;p1.y+=p1.vy;p1.a+=p1.va;
        p2.x+=p2.vx;p2.y+=p2.vy;p2.a+=p2.va;
        p1.vx*=FRIC;p1.vy*=FRIC;p1.va*=AFRIC;
        p2.vx*=FRIC;p2.vy*=FRIC;p2.va*=AFRIC;
        const hit=capsuleCollide(p1,p2);
        if(hit){ const now=Date.now(); if(now-g.clackAt>120){g.clackAt=now;audio.current?.playClack();} }
        const E=10;
        if(!p1.out&&(p1.x<E||p1.x>W-E||p1.y<E||p1.y>H-E)){p1.out=true;p1.vx=p1.vy=p1.va=0;}
        if(!p2.out&&(p2.x<E||p2.x>W-E||p2.y<E||p2.y>H-E)){p2.out=true;p2.vx=p2.vy=p2.va=0;}
        const s1=Math.hypot(p1.vx,p1.vy),s2=Math.hypot(p2.vx,p2.vy);
        if((s1<.1&&s2<.1&&Math.abs(p1.va)<.008&&Math.abs(p2.va)<.008)||(p1.out&&p2.out)){
          p1.vx=p1.vy=p1.va=0;p2.vx=p2.vy=p2.va=0;
          g.lastPhase=g.phase as "moving"|"cpu_move";
          g.phase="round_end";endRound();
        }
      }
      draw();
      raf.current=requestAnimationFrame(tick);
    }
    raf.current=requestAnimationFrame(tick);
    return()=>{alive=false;cancelAnimationFrame(raf.current);};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(()=>{
    const el=cvs.current!;
    const fn=(e:TouchEvent)=>{if(G.current.phase==="aiming")e.preventDefault();};
    el.addEventListener("touchmove",fn,{passive:false});
    return()=>el.removeEventListener("touchmove",fn);
  },[]);

  function getPos(e:React.MouseEvent|React.TouchEvent){
    const c=cvs.current!,r=c.getBoundingClientRect();
    const sx=W/r.width,sy=H/r.height;
    const cl="touches"in e?e.changedTouches[0]:e;
    return{x:(cl.clientX-r.left)*sx,y:(cl.clientY-r.top)*sy};
  }
  function onDown(e:React.MouseEvent|React.TouchEvent){
    initAudio();audio.current?.resume();
    const g=G.current;if(g.phase!=="idle")return;
    const pos=getPos(e);
    if(Math.hypot(pos.x-g.p1.x,pos.y-g.p1.y)<65){g.drag={x:pos.x,y:pos.y};g.phase="aiming";}
  }
  function onMove(e:React.MouseEvent|React.TouchEvent){
    const g=G.current;if(g.phase!=="aiming"||!g.drag)return;
    const pos=getPos(e);g.drag={x:pos.x,y:pos.y};
  }
  function onUp(){
    const g=G.current;if(g.phase!=="aiming"||!g.drag)return;
    const p=g.p1,d=g.drag;
    const dx=d.x-p.x,dy=d.y-p.y,dist=Math.hypot(dx,dy);
    g.drag=null;
    if(dist>6){
      const pwr=Math.min(dist/12,MAX_V); // less power per drag distance
      p.vx=(dx/dist)*pwr;p.vy=(dy/dist)*pwr;p.va=(Math.random()-.5)*.1;
      g.phase="moving";g.msg="Pen flying! 💨";sync();
      audio.current?.playFlick();
    } else { g.phase="idle"; }
  }

  return(
    <div style={{minHeight:"100vh",background:"#131008",display:"flex",flexDirection:"column",alignItems:"center",paddingTop:14,paddingBottom:24,color:"#fff"}}>
      <div style={{width:"100%",maxWidth:W,padding:"0 16px 10px"}}>
        <Link href="/vibe-room/play-zone" style={{color:"rgba(255,255,255,.33)",fontSize:13,textDecoration:"none"}}>← Play Zone</Link>
      </div>
      <div ref={msgEl} style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,.62)",marginBottom:10,textAlign:"center",minHeight:22,padding:"0 20px"}}>👆 Tap your blue pen and drag to flick!</div>
      <canvas ref={cvs} width={W} height={H}
        style={{borderRadius:6,boxShadow:"0 20px 70px rgba(0,0,0,.8),0 4px 12px rgba(0,0,0,.5)",maxWidth:"94vw",display:"block",touchAction:"none",cursor:"pointer"}}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp}
        onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      />
      <div style={{display:"flex",gap:22,marginTop:14}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <div style={{width:32,height:8,borderRadius:4,background:"linear-gradient(90deg,#071e50,#3a90e8,#071e50)"}}/>
          <span style={{fontSize:11,color:"rgba(255,255,255,.32)"}}>Your pen</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <div style={{width:32,height:8,borderRadius:4,background:"linear-gradient(90deg,#0a0a0a,#c62828,#0a0a0a)"}}/>
          <span style={{fontSize:11,color:"rgba(255,255,255,.32)"}}>CPU pen</span>
        </div>
      </div>
      <button ref={btnEl} onClick={()=>{const g=G.current;g.s1=0;g.s2=0;resetRound();}}
        style={{display:"none",marginTop:20,padding:"12px 32px",borderRadius:50,background:"#c8873a",color:"#fff",fontSize:14,fontWeight:800,border:"none",cursor:"pointer",boxShadow:"0 4px 16px rgba(200,135,58,.4)"}}>
        Play Again
      </button>
    </div>
  );
}
