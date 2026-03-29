const year = 2026;

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const eventColors = {
  culto: "culto",
  oracion: "oracion",
  vigilia: "vigilia",
  ayuno: "ayuno",
  especial: "especial"
};

// Fallback visual si una imagen no existe en la ruta indicada.
const fallbackImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#1f3b68' />
          <stop offset='100%' stop-color='#402060' />
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)' />
      <text x='50%' y='47%' fill='white' text-anchor='middle' font-size='54' font-family='Arial'>
        CONFRATERNIDAD DISTRITAL
      </text>
      <text x='50%' y='57%' fill='#ffe7a8' text-anchor='middle' font-size='34' font-family='Arial'>
        3 de abril de 2026
      </text>
      <text x='50%' y='66%' fill='white' text-anchor='middle' font-size='26' font-family='Arial'>
        10:00 AM · 02:00 PM · 05:00 PM
      </text>
    </svg>
  `);

// Define aquí el nombre específico de cada culto y su responsable por día.
const weeklyTemplateByWeekday = {
  2: [
    {
      title: "Culto de Martes",
      time: "07:00 PM",
      type: "culto",
      description: "Servicio congregacional de martes.",
      responsable: "Responsable: por definir"
    }
  ],
  4: [
    {
      title: "Culto de Jueves",
      time: "07:00 PM",
      type: "culto",
      description: "Servicio congregacional de jueves.",
      responsable: "Responsable: por definir"
    }
  ],
  6: [
    {
      title: "Culto de Sábado",
      time: "07:00 PM",
      type: "culto",
      description: "Servicio congregacional de sábado.",
      responsable: "Responsable: por definir"
    }
  ],
  0: [
    {
      title: "Culto Dominical",
      time: "10:00 AM",
      type: "culto",
      description: "Servicio general dominical.",
      responsable: "Responsable: por definir"
    }
  ]
};

// IMPORTANTE: pega aquí TODO el cronograma oficial con nombres exactos de cultos, responsables e imágenes.
const customEvents = [
  {
    date: "2026-04-03",
    title: "CONFRATERNIDAD DISTRITAL",
    time: "10:00 AM · 02:00 PM · 05:00 PM",
    type: "especial",
    description: "Evento distrital en IPUC Villa del Río - Manizales.",
    responsable: "Participan iglesias del distrito 4",
    featured: true,
    image: "confraternidad-abril-3.jpg",
    imageCandidates: [
      "confraternidad-abril-3.jpg",
      "Confraternidad Distrital Abril 3.jpg",
      "assets/confraternidad-abril-3.jpg"
    ]
  }

  // EJEMPLO para agregar cultos con nombre y responsable reales:
  // {
  //   date: "2026-01-06",
  //   title: "Culto de Jóvenes",
  //   time: "07:00 PM",
  //   type: "culto",
  //   description: "Tema: Santidad y compromiso",
  //   responsable: "Dirige: Hno. Carlos Pérez",
  //   image: "imagenes/culto-jovenes-ene-06.jpg"
  // }
];

function formatDateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function cloneEvents(events = []) {
  return events.map((event) => ({ ...event }));
}

function getWeeklyRecurringEvents(date) {
  const day = date.getDay();
  return cloneEvents(weeklyTemplateByWeekday[day] || []);
}

function buildEventsByDate() {
  const map = new Map();

  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const key = formatDateKey(year, month, d);
      map.set(key, getWeeklyRecurringEvents(date));
    }
  }

  customEvents.forEach((ev) => {
    const list = map.get(ev.date) || [];
    list.push({ ...ev });
    map.set(ev.date, list);
  });

  return map;
}

function getImageCandidates(event) {
  if (Array.isArray(event.imageCandidates) && event.imageCandidates.length) {
    return [...event.imageCandidates, fallbackImage];
  }
  return [event.image, fallbackImage].filter(Boolean);
}

function setProgressiveImage(imgEl, candidates = []) {
  let index = 0;
  const uniqueCandidates = [...new Set(candidates)];

  function loadCurrent() {
    imgEl.src = uniqueCandidates[index] || fallbackImage;
  }

  imgEl.onerror = () => {
    index += 1;
    if (index < uniqueCandidates.length) {
      loadCurrent();
    }
  };

  loadCurrent();
}

const eventsByDate = buildEventsByDate();
const container = document.getElementById("calendarContainer");
const modal = document.getElementById("eventModal");
const churchLogo = document.getElementById("churchLogo");

if (churchLogo) {
  setProgressiveImage(churchLogo, [
    "LOGO IPUC.png",
    "LOGO IPUC PNG.png",
    "logo ipuc.png",
    "logo-ipuc.png",
    fallbackImage
  ]);
}

function openModal(event, dateText) {
  document.getElementById("modalTitle").textContent = event.title;
  document.getElementById("modalDate").textContent = `Fecha: ${dateText}`;
  document.getElementById("modalTime").textContent = `Hora: ${event.time || "Por confirmar"}`;
  document.getElementById("modalDescription").textContent = [
    event.description || "Sin descripción adicional.",
    event.responsable || ""
  ]
    .filter(Boolean)
    .join(" · ");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

document.getElementById("closeModal").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

function buildEventLabel(event) {
  const details = [event.time, event.responsable].filter(Boolean).join(" · ");
  return `<strong>${event.title}</strong>${details ? `<span>${details}</span>` : ""}`;
}

function renderCalendar() {
  const today = new Date();
  const isCurrentYear = today.getFullYear() === year;
  container.innerHTML = "";

  for (let month = 0; month < 12; month++) {
    const monthSection = document.createElement("section");
    monthSection.className = "month";
    monthSection.id = `month-${month}`;

    const monthHeader = document.createElement("div");
    monthHeader.className = "month-header";
    monthHeader.textContent = `${monthNames[month]} ${year}`;
    monthSection.appendChild(monthHeader);

    const weekdays = document.createElement("div");
    weekdays.className = "weekdays";
    dayNames.forEach((day) => {
      const el = document.createElement("div");
      el.textContent = day;
      weekdays.appendChild(el);
    });
    monthSection.appendChild(weekdays);

    const daysGrid = document.createElement("div");
    daysGrid.className = "days-grid";

    const firstDay = new Date(year, month, 1);
    const rawOffset = firstDay.getDay();
    const mondayOffset = rawOffset === 0 ? 6 : rawOffset - 1;

    for (let i = 0; i < mondayOffset; i++) {
      const empty = document.createElement("div");
      empty.className = "day empty";
      daysGrid.appendChild(empty);
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const key = formatDateKey(year, month, d);
      const dayCell = document.createElement("article");
      dayCell.className = "day";

      if (isCurrentYear && today.getMonth() === month && today.getDate() === d) {
        dayCell.classList.add("today");
      }

      const dayNumber = document.createElement("div");
      dayNumber.className = "day-number";
      dayNumber.textContent = d;
      dayCell.appendChild(dayNumber);

      const events = eventsByDate.get(key) || [];
      events.forEach((event) => {
        if (event.featured) {
          const featured = document.createElement("div");
          featured.className = "special-card";

          const image = document.createElement("img");
          image.alt = `Imagen de ${event.title}`;
          setProgressiveImage(image, getImageCandidates(event));

          featured.innerHTML = `
            <strong>${event.title}</strong>
            <div>${event.time}</div>
            <small>Evento principal de la semana</small>
          `;
          featured.appendChild(image);

          featured.addEventListener("click", () =>
            openModal(event, `${d} de ${monthNames[month]} de ${year}`)
          );
          dayCell.appendChild(featured);
        }

        const badge = document.createElement("button");
        badge.type = "button";
        badge.className = `event ${eventColors[event.type] || "especial"} ${event.featured ? "principal" : ""}`;
        badge.innerHTML = buildEventLabel(event);
        badge.title = event.description || "Ver detalles";
        badge.addEventListener("click", () =>
          openModal(event, `${d} de ${monthNames[month]} de ${year}`)
        );
        dayCell.appendChild(badge);
      });

      daysGrid.appendChild(dayCell);
    }

    monthSection.appendChild(daysGrid);
    container.appendChild(monthSection);
  }
}

function scrollToMonth(targetMonth) {
  const section = document.getElementById(`month-${targetMonth}`);
  if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
}

let activeMonth = 0;
document.getElementById("prevMonth").addEventListener("click", () => {
  activeMonth = (activeMonth + 11) % 12;
  scrollToMonth(activeMonth);
});

document.getElementById("nextMonth").addEventListener("click", () => {
  activeMonth = (activeMonth + 1) % 12;
  scrollToMonth(activeMonth);
});

document.getElementById("todayBtn").addEventListener("click", () => {
  const today = new Date();
  activeMonth = today.getFullYear() === year ? today.getMonth() : 0;
  scrollToMonth(activeMonth);
});

renderCalendar();
