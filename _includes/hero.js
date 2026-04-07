
(() => {
  function boot() {
    const canvas = document.getElementById('wind');
    if (!canvas) return requestAnimationFrame(boot);
    const ctx = canvas.getContext('2d');

    let W = 0, H = 0, particles = [];
    const N = 2500, STEP = 1.2, LIFE = 120;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = canvas.clientWidth, ch = canvas.clientHeight;
      if (cw === 0 || ch === 0) return;
      W = canvas.width  = cw * dpr;
      H = canvas.height = ch * dpr;
      if (particles.length === 0) init();
    }

    const perm = new Uint8Array(512);
    for (let i=0;i<256;i++) perm[i]=i;
    for (let i=255;i>0;i--){const j=(Math.random()*(i+1))|0;[perm[i],perm[j]]=[perm[j],perm[i]];}
    for (let i=0;i<256;i++) perm[i+256]=perm[i];
    const fade = t => t*t*t*(t*(t*6-15)+10);
    const lerp = (a,b,t) => a+(b-a)*t;
    function noise2(x,y){
      const X=Math.floor(x)&255, Y=Math.floor(y)&255;
      x-=Math.floor(x); y-=Math.floor(y);
      const u=fade(x), v=fade(y);
      const A=perm[X]+Y, B=perm[X+1]+Y;
      const g=(h,x,y)=>{const u=h&1?x:-x,v=h&2?y:-y;return u+v;};
      return lerp(
        lerp(g(perm[A],x,y),     g(perm[B],x-1,y),   u),
        lerp(g(perm[A+1],x,y-1), g(perm[B+1],x-1,y-1), u),
        v);
    }

    const SCALE = 0.0025, EPS = 1.0;
    let t0 = 0;
    function velocity(x,y){
      const psi = (X,Y) => noise2(X*SCALE, Y*SCALE + t0) + Y*SCALE*0.3;
      const dpsidy = (psi(x, y+EPS) - psi(x, y-EPS)) / (2*EPS);
      const dpsidx = (psi(x+EPS, y) - psi(x-EPS, y)) / (2*EPS);
      return [dpsidy, -dpsidx];
    }

    function spawn(p){
      p.x = Math.random()*W;
      p.y = Math.random()*H;
      p.age = (Math.random()*LIFE)|0;
    }
    function init(){
      particles = Array.from({length:N}, () => { const p={}; spawn(p); return p; });
    }

    function frame(){
      if (!W || !H) { resize(); requestAnimationFrame(frame); return; }

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(180,210,255,0.55)';
      ctx.beginPath();
      for (const p of particles){
        const [vx,vy] = velocity(p.x, p.y);
        const sp = Math.hypot(vx,vy) + 1e-6;
        const nx = p.x + (vx/sp) * STEP * 60;
        const ny = p.y + (vy/sp) * STEP * 60;
        ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny);
        p.x = nx; p.y = ny; p.age++;
        if (p.age > LIFE || p.x<0||p.x>W||p.y<0||p.y>H) spawn(p);
      }
      ctx.stroke();

      t0 += 0.0015;
      requestAnimationFrame(frame);
    }

    new ResizeObserver(resize).observe(canvas);
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(frame);
    console.log('[hero] started, size =', canvas.clientWidth, canvas.clientHeight);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();