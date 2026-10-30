const noteTrigger = document.querySelector('.note-trigger');
const birthdayNote = document.getElementById('birthday-note');

if (noteTrigger && birthdayNote) {
  noteTrigger.addEventListener('click', () => {
    if (birthdayNote.open) return;
    birthdayNote.showModal();
    noteTrigger.setAttribute('aria-expanded', 'true');
  });

  birthdayNote.querySelector('.note-close').addEventListener('click', () => {
    birthdayNote.close();
  });

  birthdayNote.addEventListener('click', (event) => {
    if (event.target !== birthdayNote) return;
    const bounds = birthdayNote.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) birthdayNote.close();
  });

  // Incluye el cierre con Escape que proporciona el diálogo nativo.
  birthdayNote.addEventListener('close', () => {
    noteTrigger.setAttribute('aria-expanded', 'false');
    noteTrigger.focus({ preventScroll: true });
  });
}
