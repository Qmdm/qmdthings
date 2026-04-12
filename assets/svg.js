function updateSvgTheme() {
  const dark = document.body.classList.contains('quarto-dark');
  document.querySelectorAll('img[src$=".svg"]').forEach(img => {
    img.style.filter = dark ? 'invert(1)' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', updateSvgTheme);

const observer = new MutationObserver(updateSvgTheme);
observer.observe(document.body, {
  attributes: true,
  attributeFilter: ['class']
});