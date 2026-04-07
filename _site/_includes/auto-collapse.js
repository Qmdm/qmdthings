(() => {
  // 只在移动端生效
  const mq = matchMedia('(max-width: 991.98px)');  // Bootstrap lg 断点
  if (!mq.matches) return;

  let lastY = window.scrollY;
  let ticking = false;

  function collapseAll() {
    // 汉堡菜单（navbar）
    document.querySelectorAll('.navbar-collapse.show').forEach(el => {
      // 用 Bootstrap API 关闭，如果没有就手动移除 class
      const bs = window.bootstrap?.Collapse?.getInstance(el);
      if (bs) bs.hide();
      else el.classList.remove('show');
    });

    // 左侧 sidebar（docked 模式下的离屏抽屉）
    document.querySelectorAll('.quarto-sidebar.show, #quarto-sidebar.show').forEach(el => {
      el.classList.remove('show');
    });

    // 右侧 TOC（移动端通常是一个可折叠块）
    document.querySelectorAll('#TOC.show, .sidebar-toc.show, nav[role="doc-toc"].show')
      .forEach(el => el.classList.remove('show'));

    // Quarto 自带的 margin-sidebar 在 mobile 下也可能展开
    document.querySelectorAll('.quarto-title-block .quarto-toc-sidebar.show')
      .forEach(el => el.classList.remove('show'));
    
    document.querySelectorAll('.offcanvas.show').forEach(el => {
        const bs = window.bootstrap?.Offcanvas?.getInstance(el);
        if (bs) bs.hide();
    });
  }

  function onScroll() {
    const y = window.scrollY;
    if (Math.abs(y - lastY) < 8) return;   // 小抖动忽略
    lastY = y;
    if (!ticking) {
      requestAnimationFrame(() => {
        collapseAll();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();