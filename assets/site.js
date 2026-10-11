document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('[data-nav-toggle]');
  const rail = document.querySelector('[data-rail]');
  if (toggle && rail) {
    toggle.addEventListener('click', () => rail.classList.toggle('open'));
  }
  if (window.mermaid) {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: '#D8F3DC',
        primaryTextColor: '#081C15',
        primaryBorderColor: '#1B4332',
        lineColor: '#2D6A4F',
        secondaryColor: '#FFF3CD',
        tertiaryColor: '#D6EAF8',
        fontFamily: 'Source Sans 3, sans-serif'
      }
    });
  }
});