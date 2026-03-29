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

const committeeCultoSchedule = [
  // Jóvenes - Primer y tercer sábado
  { committee: "Comité de Jóvenes", dates: ["2026-01-17", "2026-02-07", "2026-02-21", "2026-03-07", "2026-03-21", "2026-04-04", "2026-04-18", "2026-05-02", "2026-05-16", "2026-06-06", "2026-06-13", "2026-07-04", "2026-07-18", "2026-08-01", "2026-08-15", "2026-09-05", "2026-09-19", "2026-10-03", "2026-10-17", "2026-11-07", "2026-11-21", "2026-12-05", "2026-12-19"] },
  // Damas Dorcas - Primer y tercer martes
  { committee: "Comité de Dorcas", dates: ["2026-01-06", "2026-01-20", "2026-02-03", "2026-02-17", "2026-03-03", "2026-03-17", "2026-04-07", "2026-04-21", "2026-05-05", "2026-05-19", "2026-06-02", "2026-06-16", "2026-07-07", "2026-07-21", "2026-08-04", "2026-08-18", "2026-09-01", "2026-09-15", "2026-10-06", "2026-10-20", "2026-11-03", "2026-11-17", "2026-12-01", "2026-12-15"] },
  // Evangelismo - Segundo y cuarto jueves
  { committee: "Comité de Evangelismo", dates: ["2026-01-08", "2026-01-22", "2026-02-12", "2026-02-26", "2026-03-12", "2026-03-26", "2026-04-09", "2026-04-23", "2026-05-14", "2026-05-28", "2026-06-11", "2026-06-25", "2026-07-09", "2026-07-23", "2026-08-13", "2026-08-27", "2026-09-10", "2026-09-24", "2026-10-08", "2026-10-22", "2026-11-12", "2026-11-26", "2026-12-10", "2026-12-24"] },
  // Escuela Dominical - Segundo sábado
  { committee: "Comité Escuela Dominical", dates: ["2026-01-10", "2026-02-14", "2026-03-14", "2026-04-11", "2026-05-09", "2026-06-13", "2026-07-11", "2026-08-08", "2026-09-12", "2026-10-10", "2026-11-14", "2026-12-12"] },
  // Alabanza - Quinto sábado
  { committee: "Comité de Alabanza", dates: ["2026-01-31", "2026-05-30", "2026-08-29", "2026-10-31"] },
  // Obra Social - Cuarto martes
  { committee: "Comité de Obra Social", dates: ["2026-01-27", "2026-02-24", "2026-03-24", "2026-04-28", "2026-05-26", "2026-06-23", "2026-07-28", "2026-08-25", "2026-09-22", "2026-10-27", "2026-11-24", "2026-12-22"] },
  // Edad Dorada - Quinto martes
  { committee: "Comité de Edad Dorada", dates: ["2026-03-31", "2026-06-30", "2026-09-29", "2026-12-29"] },
  // Caballeros - Segundo martes
  { committee: "Comité de Caballeros", dates: ["2026-01-13", "2026-02-10", "2026-03-10", "2026-04-14", "2026-05-12", "2026-06-09", "2026-07-14", "2026-08-11", "2026-09-08", "2026-10-13", "2026-11-10", "2026-12-08"] },
  // Red de Familia - Cuarto sábado
  { committee: "Comité Red de Familia", dates: ["2026-01-24", "2026-02-28", "2026-03-28", "2026-04-25", "2026-05-23", "2026-06-27", "2026-07-25", "2026-08-22", "2026-09-26", "2026-10-24", "2026-11-28", "2026-12-26"] },
  // Misiones - Último domingo
  { committee: "Comité de Misiones", dates: ["2026-01-25", "2026-02-22", "2026-03-29", "2026-04-26", "2026-05-31", "2026-06-28", "2026-07-26", "2026-08-30", "2026-09-27", "2026-10-25", "2026-11-29", "2026-12-27"] }
];

const prayerSchedule = [
  { date: "2026-02-09", committees: ["Junta local", "Damas Dorcas", "Jóvenes"] },
  { date: "2026-03-09", committees: ["Escuela dominical", "Caballeros", "Alabanza"] },
  { date: "2026-04-06", committees: ["Edad dorada", "Evangelismo", "Red de familia"] },
  { date: "2026-05-11", committees: ["Obra social", "Misiones", "Recepción"] },
  { date: "2026-06-01", committees: ["Junta local", "Damas Dorcas", "Jóvenes"] },
  { date: "2026-07-13", committees: ["Escuela dominical", "Caballeros", "Alabanza"] },
  { date: "2026-08-10", committees: ["Edad dorada", "Evangelismo", "Red de familia"] },
  { date: "2026-09-14", committees: ["Obra social", "Misiones", "Recepción"] },
  { date: "2026-10-05", committees: ["Junta local", "Damas Dorcas", "Jóvenes"] },
  { date: "2026-11-09", committees: ["Escuela dominical", "Caballeros", "Alabanza"] },
  { date: "2026-12-07", committees: ["Edad dorada", "Evangelismo", "Red de familia"] }
];

const fastingSchedule = [
  { date: "2026-03-01", committees: ["Todos los comités"] },
  { date: "2026-05-03", committees: ["Obra social", "Misiones", "Recepción"] },
  { date: "2026-07-05", committees: ["Edad dorada", "Evangelismo", "Red de familias"] },
  { date: "2026-09-06", committees: ["Escuela dominical", "Caballeros", "Alabanza"] },
  { date: "2026-11-01", committees: ["Junta local", "Damas Dorcas", "Jóvenes"] }
];

const vigilSchedule = [
  { date: "2026-04-17", committees: ["Evangelismo", "Red de familias", "Edad dorada"] },
  { date: "2026-06-19", committees: ["Escuela dominical", "Caballeros", "Alabanza"] },
  { date: "2026-08-21", committees: ["Obra social", "Misiones", "Recepción"] },
  { date: "2026-10-23", committees: ["Junta local", "Damas Dorcas", "Jóvenes"] },
  { date: "2026-12-18", committees: ["Evangelismo", "Red de familias", "Edad dorada"] }
];

const featuredEvents = [
  {
    date: "2026-04-03",
    title: "CONFRATERNIDAD DISTRITAL",
    time: "10:00 AM · 02:00 PM · 05:00 PM",
    type: "especial",
    description: "Sede: IPUC Villa del Río - Manizales",
    responsable: "Distrito 4",
    featured: true,
    imageCandidates: [
      "confraternidad-abril-3.jpg",
      "confraternidad.jpg",
      "Confraternidad Distrital Abril 3.jpg",
      "assets/confraternidad-abril-3.jpg"
    ]
  }
];

function formatDateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function addEvent(map, date, event) {
  const existing = map.get(date) || [];
  existing.push(event);
  map.set(date, existing);
}

function getDefaultCultoEvent(dateObj) {
  const day = dateObj.getDay();

  if (day === 4) {
    return {
      title: "Culto de Oración y Enseñanza",
      time: "07:00 PM",
      type: "culto",
      description: "Jueves regular",
      isDefault: true
    };
  }

  if ([2, 6].includes(day)) {
    return {
      title: "Culto congregacional",
      time: "07:00 PM",
      type: "culto",
      description: "Culto regular",
      isDefault: true
    };
  }

  if (day === 0) {
    return {
      title: "Culto dominical",
      time: "10:00 AM",
      type: "culto",
      description: "Culto regular",
      isDefault: true
    };
  }

  return null;
}

function buildEventsByDate() {
  const map = new Map();

  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const key = formatDateKey(year, month, d);
      const defaultEvent = getDefaultCultoEvent(new Date(year, month, d));
      map.set(key, defaultEvent ? [defaultEvent] : []);
    }
  }

  committeeCultoSchedule.forEach(({ committee, dates }) => {
    dates.forEach((date) => {
      addEvent(map, date, {
        title: `Culto ${committee}`,
        time: "07:00 PM",
        type: "culto",
        description: "Programación oficial de culto",
        responsable: committee
      });
    });
  });

  // Si un día ya tiene culto de comité, se elimina el culto default para evitar duplicados.
  map.forEach((events, date) => {
    const hasCommitteeCulto = events.some((event) => event.type === "culto" && event.responsable);
    if (hasCommitteeCulto) {
      map.set(
        date,
        events.filter((event) => !event.isDefault)
      );
    }
  });

  prayerSchedule.forEach(({ date, committees }) => {
    addEvent(map, date, {
      title: "Oración",
      time: "06:00 PM - 08:00 PM",
      type: "oracion",
      description: "Programación oración lunes 2026",
      responsable: committees.join(", ")
    });
  });

  fastingSchedule.forEach(({ date, committees }) => {
    addEvent(map, date, {
      title: "Ayuno",
      time: "Jornada de ayuno",
      type: "ayuno",
      description: "Programación de ayunos 2026",
      responsable: committees.join(", ")
    });
  });

  vigilSchedule.forEach(({ date, committees }) => {
    addEvent(map, date, {
      title: "Vigilia",
      time: "08:00 PM - 12:00 AM",
      type: "vigilia",
      description: "Programación de vigilias 2026",
      responsable: committees.join(", ")
    });
  });

  featuredEvents.forEach((event) => addEvent(map, event.date, event));

  return map;
}

function getImageCandidates(event) {
  if (Array.isArray(event.imageCandidates) && event.imageCandidates.length) {
    return [...event.imageCandidates, fallbackImage];
  }
  return [event.image, fallbackImage].filter(Boolean);
}

function setProgressiveImage(imgEl, candidates = []) {
  const uniqueCandidates = [...new Set(candidates)];
  let index = 0;

  function tryLoad() {
    imgEl.src = uniqueCandidates[index] || fallbackImage;
  }

  imgEl.onerror = () => {
    index += 1;
    if (index < uniqueCandidates.length) {
      tryLoad();
    }
  };

  tryLoad();
}

const eventsByDate = buildEventsByDate();
const container = document.getElementById("calendarContainer");
const modal = document.getElementById("eventModal");
const churchLogo = document.getElementById("churchLogo");

if (churchLogo) {
  setProgressiveImage(churchLogo, [
    "logo-villa-del-rio.png",
    "LOGO IPUC VILLA DEL RIO.png",
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
    event.description || "Sin descripción adicional",
    event.responsable ? `Encargados: ${event.responsable}` : ""
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

function createEventButton(event, d, month) {
  const badge = document.createElement("button");
  badge.type = "button";
  badge.className = `event ${eventColors[event.type] || "especial"} ${event.featured ? "principal" : ""}`;

  const strong = document.createElement("strong");
  strong.textContent = event.title;
  const detail = document.createElement("span");
  detail.textContent = [event.time, event.responsable].filter(Boolean).join(" · ");

  badge.appendChild(strong);
  if (detail.textContent) badge.appendChild(detail);

  badge.title = event.description || "Ver detalles";
  badge.addEventListener("click", () => openModal(event, `${d} de ${monthNames[month]} de ${year}`));

  return badge;
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

          const title = document.createElement("strong");
          title.textContent = event.title;
          const times = document.createElement("div");
          times.textContent = event.time;
          const subtitle = document.createElement("small");
          subtitle.textContent = "Evento principal de la semana";
          const image = document.createElement("img");
          image.alt = `Imagen de ${event.title}`;
          setProgressiveImage(image, getImageCandidates(event));

          featured.append(title, times, subtitle, image);
          featured.addEventListener("click", () => openModal(event, `${d} de ${monthNames[month]} de ${year}`));
          dayCell.appendChild(featured);
        }

        dayCell.appendChild(createEventButton(event, d, month));
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
