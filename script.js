// Experiencia romántica elegante para Francisca y Esteban.
const introScreen = document.querySelector('[data-screen="intro"]');
const storyScreen = document.querySelector('[data-screen="story"]');
const introLines = [document.getElementById('introLineOne'), document.getElementById('introLineTwo')];
const sectionCards = [...document.querySelectorAll('.section-card')];
const verses = [...document.querySelectorAll('.verse')];
const startBtn = document.getElementById('startBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const muteBtn = document.getElementById('muteBtn');
const replayBtn = document.getElementById('replayBtn');
const yesBtn = document.getElementById('yesBtn');
const thinkBtn = document.getElementById('thinkBtn');
const finalResponse = document.getElementById('finalResponse');
const bgMusic = document.getElementById('bgMusic');
const pageSound = document.getElementById('pageSound');
const signatureText = document.getElementById('signatureText');

let currentStep = 0;
let isMuted = false;

const ecgOriginal =
  'M0 60 H80 L110 60 L130 20 L160 100 L190 60 H250 L280 60 L300 40 L320 80 L340 60 H500';
const ecgHeart =
  'M0 60 H95 L120 60 Q145 20 170 60 Q195 100 220 60 H250 Q270 25 300 60 Q330 95 350 60 H500';

bgMusic.volume = 0.22;

function initIntroAnimation() {
  gsap.to(introLines[0], { opacity: 1, y: -4, delay: 0.7, duration: 1.4, ease: 'power2.out' });
  gsap.to(introLines[1], { opacity: 1, y: -4, delay: 2, duration: 1.4, ease: 'power2.out' });
}

function buildParticles() {
  const particlesContainer = document.getElementById('particles');
  const amount = 28;

  for (let i = 0; i < amount; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'particle';
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.animationDuration = `${11 + Math.random() * 16}s`;
    dot.style.animationDelay = `${-Math.random() * 8}s`;
    particlesContainer.appendChild(dot);
  }
}

function showSection(index) {
  sectionCards.forEach((card, i) => {
    card.classList.toggle('active', i === index);
  });

  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === sectionCards.length - 1;

  animateSection(index);
}

function animateSection(index) {
  const activeCard = sectionCards[index];

  gsap.fromTo(
    activeCard,
    { opacity: 0, y: 25 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }
  );

  if (activeCard.classList.contains('scripture')) {
    if (pageSound) {
      pageSound.currentTime = 0;
      pageSound.volume = 0.14;
      pageSound.play().catch(() => {});
    }
    gsap.to(verses, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power2.out',
      stagger: 0.6,
    });
  }

  if (activeCard.dataset.step === '0') {
    const ecgPath = document.getElementById('ecgPath');
    gsap.fromTo(ecgPath, { strokeDashoffset: 1200 }, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.out' });
    gsap.to(ecgPath, { attr: { d: ecgHeart }, duration: 1.8, delay: 1.8, ease: 'power1.inOut' });
  }

  if (activeCard.dataset.step === '4') {
    signatureText.style.width = '0ch';
    gsap.to(signatureText, { width: '19ch', duration: 2.2, ease: 'steps(19)' });
  }
}

function replayCurrentAnimation() {
  const activeCard = sectionCards[currentStep];

  if (activeCard.dataset.step === '0') {
    const ecgPath = document.getElementById('ecgPath');
    ecgPath.setAttribute('d', ecgOriginal);
    gsap.set(ecgPath, { strokeDashoffset: 1200 });
  }

  if (activeCard.classList.contains('scripture')) {
    gsap.set(verses, { opacity: 0, y: 12 });
  }

  animateSection(currentStep);
}

startBtn.addEventListener('click', () => {
  introScreen.classList.remove('active');
  introScreen.setAttribute('aria-hidden', 'true');
  storyScreen.classList.add('active');
  storyScreen.setAttribute('aria-hidden', 'false');

  bgMusic.play().catch(() => {});
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
  bgMusic.muted = isMuted;
  muteBtn.textContent = isMuted ? 'Activar música' : 'Silenciar música';
});

replayBtn.addEventListener('click', replayCurrentAnimation);

yesBtn.addEventListener('click', () => {
  finalResponse.textContent =
    'Gracias por abrir esta puerta. Prometo que lo nuestro sea guiado por Dios, cuidado con honra y construido con paciencia.';
  gsap.fromTo(
    finalResponse,
    { opacity: 0, y: 10, color: '#9f7f42' },
    { opacity: 1, y: 0, color: '#5b472e', duration: 1.3, ease: 'power2.out' }
  );
  gsap.to('.final-question', {
    boxShadow: '0 0 0 2px rgba(185, 153, 98, 0.38), 0 16px 48px rgba(175, 143, 87, 0.25)',
    duration: 1.2,
  });
});

thinkBtn.addEventListener('click', () => {
  finalResponse.textContent =
    'Está bien, Francisca. Lo valioso se discierne con calma. Yo seguiré orando y caminando con respeto.';
  gsap.fromTo(finalResponse, { opacity: 0 }, { opacity: 1, duration: 0.8 });
});

buildParticles();
initIntroAnimation();
showSection(0);
