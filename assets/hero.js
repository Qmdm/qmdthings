
(() => {
  function boot() {
    const canvas = document.getElementById('wind');
    if (!canvas) return requestAnimationFrame(boot);
    const ctx = canvas.getContext('2d');

    let W = 0, H = 0, particles = [];
    let gradient = null;
    const N = 2000, STEP = 1.2, LIFE = 120;

    const mouse = {
      x: -9999, y: -9999,        // 平滑后的位置
      rx: -9999, ry: -9999,      // 原始位置
      vx: 0, vy: 0,              // 平滑速度（带惯性）
      active: false
    };
    const target = document.querySelector('.quarto-title-banner') || canvas;
    target.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      mouse.rx = (e.clientX - r.left) * dpr;
      mouse.ry = (e.clientY - r.top)  * dpr;
      if (!mouse.active) { mouse.x = mouse.rx; mouse.y = mouse.ry; }
      mouse.active = true;
    });
    target.addEventListener('pointerleave', () => { mouse.active = false; });

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = canvas.clientWidth, ch = canvas.clientHeight;
      if (cw === 0 || ch === 0) return;
      W = canvas.width  = cw * dpr;
      H = canvas.height = ch * dpr;

      gradient = ctx.createLinearGradient(0, 0, W, 0);
      gradient.addColorStop(0,   'rgba(42, 94, 112, 0.55)');   // #2A5E70
      gradient.addColorStop(0.5, 'rgba(78, 154, 176, 0.75)');  // #4E9AB0
      gradient.addColorStop(1,   'rgba(168, 212, 222, 0.45)'); // #A8D4DE

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

    // —— 流函数——
    const SCALE = 0.0025;
    const EPS = 1.0;
    let t0 = 0;
    function velocity(x, y){
      const psi = (X,Y) => noise2(X*SCALE, Y*SCALE + t0) + Y*SCALE*0.3;
      const vx =  (psi(x, y+EPS) - psi(x, y-EPS)) / (2*EPS);
      const vy = -(psi(x+EPS, y) - psi(x-EPS, y)) / (2*EPS);
      return [vx, vy];
    }

   
    const MOUSE_RADIUS   = 220;   // 影响半径（canvas 像素）
    const MOUSE_STRENGTH = 1.2;   // 拖曳强度
    const MOUSE_PUSH     = 6;     // 径向斥力强度（设 0 关闭）

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

      // —— 平滑鼠标位置和速度（惯性）——
      const smooth = 0.25;
      const newX = mouse.x + (mouse.rx - mouse.x) * smooth;
      const newY = mouse.y + (mouse.ry - mouse.y) * smooth;
      mouse.vx = mouse.vx * 0.85 + (newX - mouse.x) * 0.5;
      mouse.vy = mouse.vy * 0.85 + (newY - mouse.y) * 0.5;
      mouse.x = newX;
      mouse.y = newY;

      // —— 拖尾衰减（透明）——
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, 0, W, H);

      // —— 画粒子线段 ——
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = 1;
      ctx.strokeStyle = gradient;
      ctx.beginPath();

      const STEP_PX = STEP * 60;
      for (const p of particles){
        // 1. 噪声场基础流（归一化）
        const [bx, by] = velocity(p.x, p.y);
        const bs = Math.hypot(bx, by) + 1e-6;
        let nx = p.x + (bx/bs) * STEP_PX;
        let ny = p.y + (by/bs) * STEP_PX;

        // 2. 鼠标扰动（独立叠加，不被归一化吃掉）
        if (mouse.active) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d2 = dx*dx + dy*dy;
          const r2 = MOUSE_RADIUS * MOUSE_RADIUS;
          if (d2 < r2) {
            const t = 1 - d2 / r2;
            const falloff = t * t * (3 - 2 * t);   // smoothstep
            // 拖曳：沿鼠标移动方向
            nx += mouse.vx * falloff * MOUSE_STRENGTH;
            ny += mouse.vy * falloff * MOUSE_STRENGTH;
            // 径向斥力：向外推
            const inv = 1 / Math.sqrt(d2 + 1);
            nx += dx * inv * falloff * MOUSE_PUSH;
            ny += dy * inv * falloff * MOUSE_PUSH;
          }
        }

        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
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