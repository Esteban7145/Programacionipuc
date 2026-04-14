const spaceCanvas = document.getElementById("space-canvas");
const particleCanvas = document.getElementById("particles-canvas");
const cursorGlow = document.querySelector(".cursor-glow");
const navButtons = document.querySelectorAll(".nav-btn");
const enterBtn = document.getElementById("enter-btn");
const burstBtn = document.getElementById("burst-btn");
const soundToggle = document.getElementById("sound-toggle");
const audio = document.getElementById("ambient-audio");
const morphText = document.getElementById("morph-text");

const sections = [...document.querySelectorAll(".page-section")];
const animatedLines = [...document.querySelectorAll(".animated-line")];

const names = ["Mopris", "Ñobo"];
let nameIndex = 0;

const starCtx = spaceCanvas.getContext("2d");
const particleCtx = particleCanvas.getContext("2d");

const stars = [];
const particles = [];
const bursts = [];

function resizeCanvas() {
  [spaceCanvas, particleCanvas].forEach((canvas) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function initStars() {
  stars.length = 0;
  const count = Math.floor((window.innerWidth * window.innerHeight) / 8500);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * spaceCanvas.width,
      y: Math.random() * spaceCanvas.height,
      radius: Math.random() * 1.4 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.25 + 0.05,
      twinkle: Math.random() * 0.03 + 0.01,
    });
  }
}

function initParticles() {
  particles.length = 0;
  const count = Math.floor((window.innerWidth * window.innerHeight) / 18000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * particleCanvas.width,
      y: Math.random() * particleCanvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2.4 + 0.8,
      hue: Math.random() > 0.5 ? 190 : 290,
    });
  }
}

function drawSpace() {
  starCtx.clearRect(0, 0, spaceCanvas.width, spaceCanvas.height);

  const gradient = starCtx.createRadialGradient(
    spaceCanvas.width * 0.2,
    spaceCanvas.height * 0.15,
    30,
    spaceCanvas.width * 0.5,
    spaceCanvas.height * 0.5,
    Math.max(spaceCanvas.width, spaceCanvas.height)
  );
  gradient.addColorStop(0, "rgba(139, 92, 246, 0.2)");
  gradient.addColorStop(0.4, "rgba(76, 201, 240, 0.09)");
  gradient.addColorStop(1, "rgba(6, 7, 19, 0)");
  starCtx.fillStyle = gradient;
  starCtx.fillRect(0, 0, spaceCanvas.width, spaceCanvas.height);

  stars.forEach((star) => {
    star.alpha += star.twinkle;
    if (star.alpha >= 1 || star.alpha <= 0.2) star.twinkle *= -1;
    star.y += star.speed;
    if (star.y > spaceCanvas.height + 4) star.y = -4;

    starCtx.beginPath();
    starCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    starCtx.fillStyle = `rgba(255,255,255,${star.alpha})`;
    starCtx.fill();
  });
}

function drawParticles() {
  particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < -5) p.x = particleCanvas.width + 5;
    if (p.x > particleCanvas.width + 5) p.x = -5;
    if (p.y < -5) p.y = particleCanvas.height + 5;
    if (p.y > particleCanvas.height + 5) p.y = -5;

    particleCtx.beginPath();
    particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    particleCtx.fillStyle = `hsla(${p.hue}, 100%, 65%, 0.7)`;
    particleCtx.fill();
  });

  bursts.forEach((burst, i) => {
    burst.x += burst.vx;
    burst.y += burst.vy;
    burst.life -= 1;

    particleCtx.beginPath();
    particleCtx.arc(burst.x, burst.y, burst.size, 0, Math.PI * 2);
    particleCtx.fillStyle = `hsla(${burst.hue}, 100%, 70%, ${burst.life / 60})`;
    particleCtx.fill();

    if (burst.life <= 0) bursts.splice(i, 1);
  });
}

function animate() {
  drawSpace();
  drawParticles();
  requestAnimationFrame(animate);
}

function setupNavigation() {
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  enterBtn.addEventListener("click", () => {
    document.getElementById("message-1")?.scrollIntoView({ behavior: "smooth" });
  });
}

function setupIntersections() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");
          entry.target.querySelectorAll(".animated-line").forEach((line) => {
            line.classList.add("visible");
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupCursorGlow() {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;

    particles.push({
      x: event.clientX,
      y: event.clientY,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      size: Math.random() * 1.8 + 0.4,
      hue: Math.random() > 0.5 ? 190 : 315,
    });

    if (particles.length > 180) particles.splice(0, particles.length - 180);
  });
}

function setupTilt() {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -7;
      const ry = ((x / rect.width) - 0.5) * 10;
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  });
}

function setupMorphText() {
  setInterval(() => {
    nameIndex = (nameIndex + 1) % names.length;
    morphText.animate(
      [
        { opacity: 0.2, filter: "blur(6px)", transform: "scale(0.9)" },
        { opacity: 1, filter: "blur(0)", transform: "scale(1)" },
      ],
      { duration: 500, easing: "ease-out" }
    );
    morphText.textContent = names[nameIndex];
  }, 1800);
}

function spawnBurst(x = window.innerWidth * 0.5, y = window.innerHeight * 0.5) {
  for (let i = 0; i < 120; i++) {
    const angle = (Math.PI * 2 * i) / 120;
    const speed = Math.random() * 3 + 1;
    bursts.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 2.7 + 1,
      life: 60,
      hue: Math.random() > 0.5 ? 190 : 320,
    });
  }
}

function setupBurst() {
  burstBtn.addEventListener("click", () => {
    const rect = burstBtn.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  });

  document.getElementById("final")?.addEventListener("click", (e) => {
    if (e.target.closest("button")) return;
    spawnBurst(e.clientX, e.clientY);
  });
}

function setupAudio() {
  soundToggle.addEventListener("click", async () => {
    try {
      if (audio.paused) {
        await audio.play();
        soundToggle.textContent = "🔊 Ambient ON";
        soundToggle.setAttribute("aria-pressed", "true");
      } else {
        audio.pause();
        soundToggle.textContent = "🔈 Ambient";
        soundToggle.setAttribute("aria-pressed", "false");
      }
    } catch {
      soundToggle.textContent = "Audio bloqueado";
    }
  });
}

function setupParallax() {
  window.addEventListener("scroll", () => {
    const offset = window.scrollY;
    spaceCanvas.style.transform = `translateY(${offset * 0.08}px)`;
    particleCanvas.style.transform = `translateY(${offset * 0.14}px)`;
  });
}

window.addEventListener("resize", () => {
  resizeCanvas();
  initStars();
  initParticles();
});

resizeCanvas();
initStars();
initParticles();
setupNavigation();
setupIntersections();
setupCursorGlow();
setupTilt();
setupMorphText();
setupBurst();
setupAudio();
setupParallax();
animate();

// Ensure initial animation state for static lines if observer takes a moment.
setTimeout(() => animatedLines.forEach((line) => line.classList.add("visible")), 500);
