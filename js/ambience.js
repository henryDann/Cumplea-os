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

// Melodía original, con timbre de caja de música, creada mediante Web Audio.
// El contexto de audio se crea con el clic en ABRE o en el control de música.
const musicButton = document.querySelector('.music-toggle');
const AudioEngine = window.AudioContext || window.webkitAudioContext;

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
} else if (AudioEngine) {
  const label = musicButton?.querySelector('.music-label');
  const status = document.querySelector('.music-status');
  const melody = [72, 76, 79, 76, 74, 72, 69, null,
    67, 72, 76, 74, 72, 69, 67, null,
    69, 72, 76, 79, 81, 79, 76, null,
    74, 76, 72, 69, 67, 69, 72, null];
  const harmonies = [[48, 55, 64], [45, 52, 60], [53, 60, 69], [55, 62, 67]];
  const beat = 0.8;
  let context;
  let volume;
  let timer;
  let noteIndex = 0;
  let nextNoteTime = 0;
  let playing = false;
  let busy = false;
  let error = '';
  let playbackRequest = 0;

  const frequency = (note) => 440 * 2 ** ((note - 69) / 12);

  function tone(note, start, duration, level, type = 'sine') {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency(note);
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(level, start + 0.04);
    envelope.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(volume);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  }

  function schedule() {
    while (nextNoteTime < context.currentTime + 0.6) {
      const note = melody[noteIndex % melody.length];
      if (note !== null) {
        tone(note, nextNoteTime, 1.8, 0.35);
        tone(note + 12, nextNoteTime, 0.9, 0.045, 'triangle');
      }

      if (noteIndex % 8 === 0) {
        for (const chordNote of harmonies[Math.floor(noteIndex / 8) % harmonies.length]) {
          tone(chordNote, nextNoteTime, beat * 7, 0.055);
        }
      }

      nextNoteTime += beat;
      noteIndex++;
    }
  }

  function updateButton() {
    if (musicButton) musicButton.setAttribute('aria-pressed', String(playing));
    if (label) label.textContent = playing ? 'Pausar música' : 'Activar música';
    if (status) status.textContent = error;
    window.dispatchEvent(new CustomEvent('birthday-music-state'));
  }

  async function pauseMusic() {
    playbackRequest++;
    clearInterval(timer);
    playing = false;
    updateButton();
    if (context && context.state === 'running') await context.suspend();
  }

  async function startMusic() {
    const request = ++playbackRequest;
    if (!context) {
      context = new AudioEngine();
      volume = context.createGain();
      volume.gain.value = 0.16;
      volume.connect(context.destination);
    }

    await context.resume();
    if (document.hidden || request !== playbackRequest) {
      await pauseMusic();
      return;
    }

    nextNoteTime = Math.max(nextNoteTime, context.currentTime + 0.05);
    playing = true;
    clearInterval(timer);
    schedule();
    timer = setInterval(schedule, 250);
    updateButton();
  }

  async function controlMusic(action) {
    if (busy) return;
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

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseMusic().catch(() => {});
  });
  window.addEventListener('pagehide', () => pauseMusic().catch(() => {}));
}
