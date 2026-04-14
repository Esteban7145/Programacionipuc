const spaceCanvas = document.getElementById("space-canvas");
const fxCanvas = document.getElementById("fx-canvas");
const cursorGlow = document.querySelector(".cursor-glow");
const soundToggle = document.getElementById("sound-toggle");
const audio = document.getElementById("ambient-audio");

const pages = [...document.querySelectorAll(".page")];
const book = document.getElementById("book");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageIndicator = document.getElementById("page-indicator");
const burstBtn = document.getElementById("burst-btn");
const morphText = document.getElementById("morph-text");

const starCtx = spaceCanvas.getContext("2d");
const fxCtx = fxCanvas.getContext("2d");

const stars = [];
const balloons = [];
const confetti = [];
const sparkles = [];

const names = ["Mopris", "Ñobo"];
let nameIndex = 0;
let currentPage = 0;

function resizeCanvas() {
  [spaceCanvas, fxCanvas].forEach((canvas) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function initStars() {
  stars.length = 0;
  const count = Math.floor((window.innerWidth * window.innerHeight) / 9000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * spaceCanvas.width,
      y: Math.random() * spaceCanvas.height,
      radius: Math.random() * 1.5 + 0.2,
      alpha: Math.random(),
      twinkle: Math.random() * 0.03 + 0.008,
      speed: Math.random() * 0.16 + 0.04,
    });
  }
}

function initBalloons() {
  balloons.length = 0;
  const colors = [190, 210, 285, 320, 45];
  const count = Math.max(15, Math.floor(window.innerWidth / 80));
  for (let i = 0; i < count; i++) {
    balloons.push({
      x: Math.random() * fxCanvas.width,
      y: Math.random() * fxCanvas.height,
      w: Math.random() * 22 + 18,
      h: Math.random() * 28 + 24,
      speed: Math.random() * 0.8 + 0.35,
      sway: Math.random() * 2,
      hue: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
    });
  }
}

function spawnConfetti(amount = 90, x = window.innerWidth * 0.5, y = 50) {
  for (let i = 0; i < amount; i++) {
    confetti.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 2 + 1,
      gravity: Math.random() * 0.06 + 0.03,
      size: Math.random() * 5 + 2,
      rotation: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.24,
      life: Math.random() * 90 + 80,
      hue: Math.random() > 0.5 ? 190 : 320,
    });
  }
}

function spawnSparkles(x, y, amount = 80) {
  for (let i = 0; i < amount; i++) {
    const angle = (Math.PI * 2 * i) / amount;
    const speed = Math.random() * 3.5 + 1;
    sparkles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 60,
      size: Math.random() * 2.2 + 1,
      hue: Math.random() > 0.5 ? 190 : 330,
    });
  }
}

function drawBackgroundSpace() {
  starCtx.clearRect(0, 0, spaceCanvas.width, spaceCanvas.height);

  const nebula = starCtx.createRadialGradient(
    spaceCanvas.width * 0.18,
    spaceCanvas.height * 0.18,
    40,
    spaceCanvas.width * 0.5,
    spaceCanvas.height * 0.5,
    Math.max(spaceCanvas.width, spaceCanvas.height)
  );
  nebula.addColorStop(0, "rgba(139, 92, 246, 0.25)");
  nebula.addColorStop(0.45, "rgba(76, 201, 240, 0.1)");
  nebula.addColorStop(1, "rgba(6, 7, 19, 0)");

  starCtx.fillStyle = nebula;
  starCtx.fillRect(0, 0, spaceCanvas.width, spaceCanvas.height);

  stars.forEach((star) => {
    star.alpha += star.twinkle;
    if (star.alpha > 1 || star.alpha < 0.15) star.twinkle *= -1;
    star.y += star.speed;
    if (star.y > spaceCanvas.height + 4) star.y = -4;

    starCtx.beginPath();
    starCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    starCtx.fillStyle = `rgba(255,255,255,${star.alpha})`;
    starCtx.fill();
  });
}

function drawFx() {
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

  balloons.forEach((b) => {
    b.y -= b.speed;
    b.phase += 0.02;
    b.x += Math.sin(b.phase) * 0.4 + (Math.sin(performance.now() / 1300 + b.sway) * 0.2);

    if (b.y + b.h < -10) {
      b.y = fxCanvas.height + b.h + Math.random() * 180;
      b.x = Math.random() * fxCanvas.width;
    }

    fxCtx.beginPath();
    fxCtx.ellipse(b.x, b.y, b.w * 0.5, b.h * 0.5, 0, 0, Math.PI * 2);
    fxCtx.fillStyle = `hsla(${b.hue}, 95%, 62%, 0.35)`;
    fxCtx.fill();

    fxCtx.beginPath();
    fxCtx.moveTo(b.x, b.y + b.h * 0.5);
    fxCtx.lineTo(b.x + Math.sin(b.phase) * 4, b.y + b.h * 1.25);
    fxCtx.strokeStyle = "rgba(255,255,255,0.25)";
    fxCtx.stroke();
  });

  confetti.forEach((c, i) => {
    c.x += c.vx;
    c.y += c.vy;
    c.vy += c.gravity;
    c.rotation += c.vr;
    c.life -= 1;

    fxCtx.save();
    fxCtx.translate(c.x, c.y);
    fxCtx.rotate(c.rotation);
    fxCtx.fillStyle = `hsla(${c.hue}, 100%, 65%, ${Math.max(0, c.life / 120)})`;
    fxCtx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.65);
    fxCtx.restore();

    if (c.life <= 0 || c.y > fxCanvas.height + 40) confetti.splice(i, 1);
  });

  sparkles.forEach((s, i) => {
    s.x += s.vx;
    s.y += s.vy;
    s.life -= 1;

    fxCtx.beginPath();
    fxCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    fxCtx.fillStyle = `hsla(${s.hue}, 100%, 70%, ${s.life / 60})`;
    fxCtx.fill();

    if (s.life <= 0) sparkles.splice(i, 1);
  });
}

function animate() {
  drawBackgroundSpace();
  drawFx();
  requestAnimationFrame(animate);
}

function updateBookUI() {
  pages.forEach((page, index) => {
    const isCurrent = index === currentPage;
    page.classList.toggle("active", isCurrent);
    page.classList.remove("exit-left");
  });

  pageIndicator.textContent = `Página ${currentPage + 1} de ${pages.length}`;
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === pages.length - 1;
  book.dataset.page = String(currentPage);

  spawnConfetti(45, window.innerWidth * 0.5, 40);
}

function goToPage(nextIndex) {
  if (nextIndex < 0 || nextIndex >= pages.length || nextIndex === currentPage) return;

  const leaving = pages[currentPage];
  leaving.classList.add("exit-left");

  currentPage = nextIndex;
  setTimeout(updateBookUI, 140);
}

function setupBookNavigation() {
  nextBtn.addEventListener("click", () => goToPage(currentPage + 1));
  prevBtn.addEventListener("click", () => goToPage(currentPage - 1));

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") goToPage(currentPage + 1);
    if (e.key === "ArrowLeft") goToPage(currentPage - 1);
  });

  updateBookUI();
}

function setupTilt() {
  const card = document.querySelector(".book");
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `rotateY(${x * 8}deg) rotateX(${y * -7}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "rotateY(0deg) rotateX(0deg)";
  });
}

function setupCursorGlow() {
  window.addEventListener("pointermove", (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
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
  }, 1700);
}

function setupCelebrationActions() {
  burstBtn.addEventListener("click", (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + rect.width * 0.5;
    const y = rect.top + rect.height * 0.5;
    spawnSparkles(x, y, 120);
    spawnConfetti(140, x, y - 70);
  });

  setInterval(() => {
    spawnConfetti(15, Math.random() * window.innerWidth, -10);
  }, 1200);
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

window.addEventListener("resize", () => {
  resizeCanvas();
  initStars();
  initBalloons();
});

resizeCanvas();
initStars();
initBalloons();
setupBookNavigation();
setupTilt();
setupCursorGlow();
setupMorphText();
setupCelebrationActions();
setupAudio();
animate();
