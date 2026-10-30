
window.addEventListener('load', () => {
  const message = 'Feliz Cumpleaños Zulema';
  const titleElement = document.getElementById('title');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (titleElement) {
    titleElement.parentElement.setAttribute('aria-label', message);
    titleElement.setAttribute('aria-hidden', 'true');
    titleElement.textContent = '';
  }

  setTimeout(() => {
    document.body.classList.remove('not-loaded');
    if (!titleElement) return;

    if (reducedMotion) {
      titleElement.textContent = message;
      return;
    }

    const characters = Array.from(message);
    let index = 0;

    function appendTitle() {
      titleElement.textContent += characters[index++];
      if (index < characters.length) setTimeout(appendTitle, 300);
    }

    appendTitle();
  }, reducedMotion ? 0 : 1000);
}, { once: true });
