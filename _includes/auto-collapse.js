(() => {
  const mq = matchMedia('(max-width: 991.98px)');
  if (!mq.matches) return;

  function closeAll() {
    // 1. 汉堡菜单
    document.querySelectorAll('.navbar-collapse.show').forEach(el => {
      const c = window.bootstrap?.Collapse?.getInstance(el);
      c ? c.hide() : el.classList.remove('show');
    });

    // 2. Offcanvas 侧边栏
    document.querySelectorAll('.offcanvas.show').forEach(el => {
      const o = window.bootstrap?.Offcanvas?.getInstance(el);
      if (o) { o.hide(); return; }
      el.classList.remove('show');
      el.setAttribute('aria-hidden', 'true');
    });

    // 3. 蒙版兜底
    document.querySelectorAll('.offcanvas-backdrop, .modal-backdrop').forEach(el => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 300);
    });

    // 4. body 锁定样式兜底
    document.body.classList.remove('offcanvas-open', 'modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  // —— 真·用户滚动时关闭 ——
  let ticking = false;
  let suppressUntil = 0;

  function onUserScroll() {
    if (Date.now() < suppressUntil) return;
    if (!ticking) {
      requestAnimationFrame(() => { closeAll(); ticking = false; });
      ticking = true;
    }
  }
  addEventListener('wheel',     onUserScroll, { passive: true });
  addEventListener('touchmove', onUserScroll, { passive: true });

  // —— 菜单内点击处理（只注册一次！）——
  document.addEventListener('click', e => {
    // 点到蒙版 → 立即关
    if (e.target.classList.contains('offcanvas-backdrop') ||
        e.target.classList.contains('modal-backdrop')) {
      closeAll();
      return;
    }

    const inMenu = e.target.closest('.offcanvas, .navbar-collapse');
    if (!inMenu) return;

    // 点击后 600ms 内禁止滚动触发关闭
    suppressUntil = Date.now() + 600;

    // 下拉切换按钮 / 可折叠项 → 不关
    if (e.target.closest(
      '[data-bs-toggle], .dropdown-toggle, .sidebar-item-toggle, ' +
      '.quarto-btn-toggle, button'
    )) {
      return;
    }

    // 锚点链接（#xxx）→ 不关，让用户看到跳转位置
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href.startsWith('#')) return;

    // 普通跳转链接 → 延迟关
    setTimeout(closeAll, 100);
  });
})();