(() => {
  const mq = matchMedia('(max-width: 991.98px)');
  if (!mq.matches) return;

  function closeAll() {
    // 1. 汉堡菜单（navbar collapse）
    document.querySelectorAll('.navbar-collapse.show').forEach(el => {
      const c = window.bootstrap?.Collapse?.getInstance(el);
      c ? c.hide() : el.classList.remove('show');
    });

    // 2. Offcanvas 侧边栏（Quarto 移动端 sidebar / TOC）
    document.querySelectorAll('.offcanvas.show').forEach(el => {
      const o = window.bootstrap?.Offcanvas?.getInstance(el);
      if (o) { o.hide(); return; }
      // 兜底：手动移除 class
      el.classList.remove('show');
      el.setAttribute('aria-hidden', 'true');
    });

    // 3. 蒙版（offcanvas-backdrop / modal-backdrop）
    document.querySelectorAll('.offcanvas-backdrop, .modal-backdrop').forEach(el => {
      el.classList.remove('show');
      // 动画结束后移除，避免残留
      setTimeout(() => el.remove(), 300);
    });

    // 4. body 上的锁定 class（Bootstrap 打开 offcanvas 时会加）
    document.body.classList.remove('offcanvas-open', 'modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  // —— 滚动时自动关 ——
  let lastY = scrollY;
  let ticking = false;
  addEventListener('scroll', () => {
    if (Math.abs(scrollY - lastY) < 8) return;
    lastY = scrollY;
    if (!ticking) {
      requestAnimationFrame(() => { closeAll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  // —— 点击蒙版时也关（Bootstrap 原生应该会处理，这是兜底）——
  document.addEventListener('click', e => {
    if (e.target.classList.contains('offcanvas-backdrop') ||
        e.target.classList.contains('modal-backdrop')) {
      closeAll();
    }
  });

  // —— 点击 sidebar 里的链接后也关（导航到锚点时）——
  document.addEventListener('click', e => {
    const link = e.target.closest('.offcanvas a, .navbar-collapse a');
    if (link) setTimeout(closeAll, 50);
  });
})();