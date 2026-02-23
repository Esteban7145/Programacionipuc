// Experiencia romántica elegante-futurista personalizada.
const introScreen = document.querySelector('[data-screen="intro"]');
const storyScreen = document.querySelector('[data-screen="story"]');
const introLineOne = document.getElementById('introLineOne');
const introLineTwo = document.getElementById('introLineTwo');
const sectionCards = [...document.querySelectorAll('.section-card')];
const startBtn = document.getElementById('startBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const muteBtn = document.getElementById('muteBtn');
const replayBtn = document.getElementById('replayBtn');
const songBtn = document.getElementById('songBtn');
const signatureText = document.getElementById('signatureText');
const yesBtn = document.getElementById('yesBtn');
const thinkBtn = document.getElementById('thinkBtn');
const finalResponse = document.getElementById('finalResponse');

const biblePages = [...document.querySelectorAll('.bible-page')];
const prevVerseBtn = document.getElementById('prevVerseBtn');
const nextVerseBtn = document.getElementById('nextVerseBtn');

let currentStep = 0;
let currentVerse = 0;
let isMuted = false;
let audioContext;
let masterGain;
let musicStarted = false;

function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new window.AudioContext();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.06;
    masterGain.connect(audioContext.destination);
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

function playAmbientMusic() {
  if (musicStarted) {
    return;
  }

  ensureAudioContext();
  musicStarted = true;

  const chords = [
    [261.63, 329.63, 392.0],
    [220.0, 277.18, 329.63],
    [246.94, 311.13, 369.99],
    [196.0, 246.94, 329.63],
  ];

  let chordIndex = 0;
  setInterval(() => {
    if (isMuted || !audioContext) {
      return;
    }

    const now = audioContext.currentTime;
    const chord = chords[chordIndex % chords.length];

    chord.forEach((freq, idx) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.07 / (idx + 1), now + 0.6);
      gain.gain.linearRampToValueAtTime(0.0, now + 4.2);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 4.3);
    });

    chordIndex += 1;
  }, 3600);
}

function playPageFlipSound() {
  if (isMuted) {
    return;
  }

  ensureAudioContext();
  const now = audioContext.currentTime;
  const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.22, audioContext.sampleRate);
  const data = noiseBuffer.getChannelData(0);

  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }

  const noise = audioContext.createBufferSource();
  noise.buffer = noiseBuffer;

  const filter = audioContext.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 420;

  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.15, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  noise.start(now);
  noise.stop(now + 0.23);
}

function initIntroAnimation() {
  gsap.from('h1', { opacity: 0, y: 12, duration: 1.2, ease: 'power2.out' });
  gsap.to(introLineOne, { opacity: 1, y: -4, delay: 0.8, duration: 1.2 });
  gsap.to(introLineTwo, { opacity: 1, y: -4, delay: 1.8, duration: 1.2 });
}

function buildParticles() {
  const particlesContainer = document.getElementById('particles');
  for (let i = 0; i < 34; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'particle';
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.animationDuration = `${9 + Math.random() * 14}s`;
    dot.style.animationDelay = `${-Math.random() * 6}s`;
    particlesContainer.appendChild(dot);
  }
}

function showSection(index) {
  sectionCards.forEach((card, i) => card.classList.toggle('active', i === index));
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === sectionCards.length - 1;
  animateSection(index);
}

function animateSection(index) {
  const activeCard = sectionCards[index];
  gsap.fromTo(activeCard, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8 });

  if (activeCard.dataset.step === '4') {
    signatureText.style.width = '0ch';
    gsap.to(signatureText, { width: '24ch', duration: 2.3, ease: 'steps(24)' });
  }

  if (activeCard.dataset.step === '5') {
    currentVerse = 0;
    showVerse(0, false);
  }
}

function showVerse(index, withFlip = true) {
  biblePages.forEach((page, i) => {
    page.classList.remove('active');
    if (i === index) {
      page.classList.add('active');
      if (withFlip) {
        gsap.fromTo(
          page,
          { rotateY: -96, opacity: 0.18, x: 10 },
          { rotateY: 0, opacity: 1, x: 0, duration: 0.9, ease: 'power2.out' }
        );
      }
    }
  });

  prevVerseBtn.disabled = index === 0;
  nextVerseBtn.disabled = index === biblePages.length - 1;

  playPageFlipSound();
}

function replayCurrentAnimation() {
  animateSection(currentStep);
  if (currentStep === 5) {
    showVerse(currentVerse, true);
  }
}

startBtn.addEventListener('click', () => {
  introScreen.classList.remove('active');
  introScreen.setAttribute('aria-hidden', 'true');
  storyScreen.classList.add('active');
  storyScreen.setAttribute('aria-hidden', 'false');
  playAmbientMusic();
  showSection(0);
});

prevBtn.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep -= 1;
    showSection(currentStep);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentStep < sectionCards.length - 1) {
    currentStep += 1;
    showSection(currentStep);
  }
});

muteBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  if (masterGain) {
    masterGain.gain.value = isMuted ? 0 : 0.06;
  }
  muteBtn.textContent = isMuted ? 'Activar música' : 'Silenciar música';
});

songBtn.addEventListener('click', () => {
  window.open('https://www.youtube.com/watch?v=JQx7r8L9QJ8', '_blank', 'noopener');
});

replayBtn.addEventListener('click', replayCurrentAnimation);

prevVerseBtn.addEventListener('click', () => {
  if (currentVerse > 0) {
    currentVerse -= 1;
    showVerse(currentVerse, true);
  }
});

nextVerseBtn.addEventListener('click', () => {
  if (currentVerse < biblePages.length - 1) {
    currentVerse += 1;
    showVerse(currentVerse, true);
  }
});

yesBtn.addEventListener('click', () => {
  finalResponse.textContent =
    'Gracias por abrir tu corazón. Quiero cuidarte bonito, hablarte con verdad y demostrarte cada día lo especial que eres para mí.';
  gsap.fromTo(finalResponse, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9 });
  gsap.to('.section-card[data-step="6"]', {
    boxShadow: '0 0 0 1px rgba(255, 157, 227, 0.45), 0 0 36px rgba(170, 107, 255, 0.35)',
    duration: 1,
  });
});

thinkBtn.addEventListener('click', () => {
  finalResponse.textContent = 'Tómate el tiempo que necesites. Yo voy a seguir aquí, con respeto, paciencia y mucho cariño por ti.';
  gsap.fromTo(finalResponse, { opacity: 0 }, { opacity: 1, duration: 0.7 });
});

buildParticles();
initIntroAnimation();
showSection(0);
showVerse(0, false);
