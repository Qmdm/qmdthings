function updateSvgTheme() {
  const dark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
  document.querySelectorAll('img[src$=".svg"]').forEach(img => {
    img.style.filter = dark ? 'invert(1)' : 'none';
  });
}

// 页面加载时
document.addEventListener('DOMContentLoaded', updateSvgTheme);

// 主题切换时
const observer = new MutationObserver(updateSvgTheme);
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-bs-theme'] });