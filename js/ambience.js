// Luciérnagas decorativas; su movimiento se controla desde CSS.
const fireflies = document.querySelector('.fireflies');

if (fireflies) {
  const lights = document.createDocumentFragment();

  for (let index = 0; index < 18; index++) {
    const light = document.createElement('span');
    light.className = 'firefly';
    light.style.setProperty('--x', `${8 + Math.random() * 84}%`);
    light.style.setProperty('--y', `${22 + Math.random() * 65}%`);
    light.style.setProperty('--size', `${2 + Math.random() * 2}px`);
    light.style.setProperty('--drift-x', `${Math.random() * 60 - 30}px`);
    light.style.setProperty('--drift-y', `${-25 - Math.random() * 55}px`);
    light.style.setProperty('--duration', `${7 + Math.random() * 7}s`);
    light.style.setProperty('--delay', `${-Math.random() * 14}s`);
    lights.appendChild(light);
  }

  fireflies.replaceChildren(lights);
}

// Un conjunto fijo de adornos se reutiliza en CSS, sin acumular elementos.
const celebration = document.querySelector('.celebration');

if (celebration) {
  const decorations = document.createDocumentFragment();
  const colors = ['#ffcf00', '#ff3e75', '#9b5cff', '#00d6b2',
    '#ff852b', '#36b6ff', '#ff59d5', '#91ed38'];
  const counts = { balloon: 10, gift: 8, confetti: 40 };
  const durations = { balloon: 14, gift: 12, confetti: 9 };
  const phases = { balloon: 0, gift: 0, confetti: 0 };
  const types = Object.entries(counts).flatMap(([type, count]) => Array(count).fill(type));

  types.forEach((type, index) => {
    const particle = document.createElement('span');
    particle.className = `celebration-particle celebration-particle--${type}`;
    particle.style.setProperty('--origin', `${Math.random() * 20 - 10}vmin`);
    particle.style.setProperty('--drift', `${Math.random() * 64 - 32}vw`);
    // Fases uniformes: siempre hay adornos naciendo, subiendo y desvaneciéndose.
    const phase = phases[type]++ / counts[type];
    particle.style.setProperty('--duration', `${durations[type]}s`);
    particle.style.setProperty('--delay', `${-phase * durations[type]}s`);
    particle.style.setProperty('--color', colors[index % colors.length]);
    particle.style.setProperty('--turn', `${type === 'confetti' ? 360 + Math.random() * 360 : Math.random() * 30 - 15}deg`);
    const shape = document.createElement('span');
    shape.className = 'celebration-shape';
    particle.appendChild(shape);
    decorations.appendChild(particle);
  });

  celebration.replaceChildren(decorations);
}

// La canción se reproduce con el clic en ABRE o en el control de música.
const musicButton = document.querySelector('.music-toggle');

// Dentro de la sorpresa incrustada, el audio pertenece a la portada para
// conservar la autorización del clic incluso al abrirla desde un celular.
if (musicButton && window.parent !== window) {
  musicButton.hidden = false;
  musicButton.addEventListener('click', () => {
    window.parent.postMessage({ type: 'birthday-music-toggle' }, '*');
  });
  window.addEventListener('message', (event) => {
    if (event.source !== window.parent || event.data?.type !== 'birthday-music-state') return;
    const playing = event.data.playing === true;
    musicButton.setAttribute('aria-pressed', String(playing));
    musicButton.querySelector('.music-label').textContent = playing ? 'Pausar música' : 'Activar música';
    const status = document.querySelector('.music-status');
    if (status) status.textContent = event.data.error || '';
  });
  window.parent.postMessage({ type: 'birthday-music-ready' }, '*');
} else if (typeof window.Audio === 'function') {
  const label = musicButton?.querySelector('.music-label');
  const status = document.querySelector('.music-status');
  const audio = new window.Audio('audio/ma\u00f1anitas.mp3');
  audio.preload = 'metadata';
  audio.volume = 0.65;
  let playing = false;
  let busy = false;
  let error = '';
  let playbackRequest = 0;

  function updateButton() {
    if (musicButton) musicButton.setAttribute('aria-pressed', String(playing));
    if (label) label.textContent = playing ? 'Pausar música' : 'Activar música';
    if (status) status.textContent = error;
    window.dispatchEvent(new CustomEvent('birthday-music-state'));
  }

  async function pauseMusic() {
    playbackRequest++;
    audio.pause();
    playing = false;
    updateButton();
  }

  async function startMusic() {
    const request = ++playbackRequest;
    if (audio.error) audio.load();
    if (audio.ended) audio.currentTime = 0;
    try {
      // play() se llama directamente durante el clic, sin esperas previas.
      await audio.play();
    } catch (playError) {
      if (request !== playbackRequest) return;
      throw playError;
    }
    if (document.hidden || request !== playbackRequest) {
      await pauseMusic();
      return;
    }

    playing = true;
    updateButton();
  }

  async function controlMusic(action) {
    if (busy) {
      if (action === 'toggle' || action === 'pause') await pauseMusic();
      return;
    }
    busy = true;
    if (musicButton) musicButton.disabled = true;

    try {
      error = '';
      if (action === 'pause' || (action === 'toggle' && playing)) {
        await pauseMusic();
      } else if (!playing) {
        await startMusic();
      }
    } catch {
      await pauseMusic().catch(() => {});
      error = 'No se pudo reproducir la música. Inténtalo de nuevo.';
      updateButton();
    } finally {
      busy = false;
      if (musicButton) musicButton.disabled = false;
    }
  }

  window.birthdayMusic = {
    start: () => controlMusic('start'),
    toggle: () => controlMusic('toggle'),
    pause: pauseMusic,
    get playing() { return playing; },
    get error() { return error; }
  };

  if (musicButton) {
    musicButton.hidden = false;
    musicButton.addEventListener('click', () => controlMusic('toggle'));
  }

  audio.addEventListener('pause', () => {
    playing = false;
    updateButton();
  });
  audio.addEventListener('ended', () => {
    playing = false;
    updateButton();
  });
  audio.addEventListener('error', () => {
    pauseMusic();
    error = 'No se pudo cargar la canción. Comprueba tu conexión e inténtalo de nuevo.';
    updateButton();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseMusic().catch(() => {});
  });
  window.addEventListener('pagehide', () => pauseMusic().catch(() => {}));
}
