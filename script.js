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

// IMPORTANTE: aquí puedes pegar exactamente el cronograma completo sin modificarlo.
// Usa el formato de objetos mostrado abajo para cada evento adicional puntual.
const customEvents = [
  {
    date: "2026-04-03",
    title: "CONFRATERNIDAD DISTRITAL",
    time: "10:00 AM · 02:00 PM · 05:00 PM",
    type: "especial",
    description: "Evento distrital en IPUC Villa del Río - Manizales.",
    featured: true,
    image: "confraternidad-abril-3.jpg"
  }
  // Ejemplo para pegar más eventos:
  // { date: "2026-07-20", title: "Nombre", time: "06:00 PM", type: "especial", description: "Detalles" }
];

function formatDateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function getWeeklyRecurringEvents(date) {
  const day = date.getDay();
  const events = [];

  // JS: 0 domingo, 2 martes, 4 jueves, 6 sábado
  if ([2, 4, 6].includes(day)) {
    events.push({ title: "Culto", time: "07:00 PM", type: "culto", description: "Culto congregacional." });
  }
  if (day === 0) {
    events.push({ title: "Culto", time: "10:00 AM", type: "culto", description: "Culto dominical." });
  }

  // Plantillas opcionales para completar el cronograma oficial si aplica.
  // if (day === 3) events.push({ title: "Oración", time: "06:00 PM - 08:00 PM", type: "oracion" });
  // if (day === 5) events.push({ title: "Vigilia", time: "08:00 PM - 12:00 AM", type: "vigilia" });

  return events;
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
    list.push(ev);
    map.set(ev.date, list);
  });

  return map;
}

const eventsByDate = buildEventsByDate();
const container = document.getElementById("calendarContainer");
const modal = document.getElementById("eventModal");

function openModal(event, dateText) {
  document.getElementById("modalTitle").textContent = event.title;
  document.getElementById("modalDate").textContent = `Fecha: ${dateText}`;
  document.getElementById("modalTime").textContent = `Hora: ${event.time || "Por confirmar"}`;
  document.getElementById("modalDescription").textContent = event.description || "Sin descripción adicional.";
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
          featured.innerHTML = `
            <strong>${event.title}</strong>
            <div>${event.time}</div>
            <small>Evento principal de la semana</small>
            <img src="${event.image}" alt="Imagen de ${event.title}" />
          `;
          featured.addEventListener("click", () =>
            openModal(event, `${d} de ${monthNames[month]} de ${year}`)
          );
          dayCell.appendChild(featured);
        }

        const badge = document.createElement("button");
        badge.type = "button";
        badge.className = `event ${eventColors[event.type] || "especial"} ${event.featured ? "principal" : ""}`;
        badge.textContent = `${event.title} · ${event.time}`;
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
