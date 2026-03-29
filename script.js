const year = 2026;

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const eventColors = { culto: "culto", oracion: "oracion", vigilia: "vigilia", ayuno: "ayuno", especial: "especial" };

const fallbackImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#1f3b68' /><stop offset='100%' stop-color='#402060' /></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)' /><text x='50%' y='47%' fill='white' text-anchor='middle' font-size='54' font-family='Arial'>CONFRATERNIDAD DISTRITAL</text><text x='50%' y='57%' fill='#ffe7a8' text-anchor='middle' font-size='34' font-family='Arial'>3 de abril de 2026</text><text x='50%' y='66%' fill='white' text-anchor='middle' font-size='26' font-family='Arial'>10:00 AM · 02:00 PM · 05:00 PM</text></svg>`);

const verses = [
  '"Y recibiréis poder, cuando haya venido sobre vosotros el Espíritu Santo." — Hechos 1:8',
  '"Jesucristo es el mismo ayer, y hoy, y por los siglos." — Hebreos 13:8',
  '"Un Señor, una fe, un bautismo." — Efesios 4:5',
  '"No con ejército, ni con fuerza, sino con mi Espíritu." — Zacarías 4:6',
  '"Sed llenos del Espíritu." — Efesios 5:18'
];

const committeeCultoSchedule = [
  { committee: "Comité de Jóvenes", dates: ["2026-01-17", "2026-02-07", "2026-02-21", "2026-03-07", "2026-03-21", "2026-04-04", "2026-04-18", "2026-05-02", "2026-05-16", "2026-06-06", "2026-06-13", "2026-07-04", "2026-07-18", "2026-08-01", "2026-08-15", "2026-09-05", "2026-09-19", "2026-10-03", "2026-10-17", "2026-11-07", "2026-11-21", "2026-12-05", "2026-12-19"] },
  { committee: "Comité de Dorcas", dates: ["2026-01-06", "2026-01-20", "2026-02-03", "2026-02-17", "2026-03-03", "2026-03-17", "2026-04-07", "2026-04-21", "2026-05-05", "2026-05-19", "2026-06-02", "2026-06-16", "2026-07-07", "2026-07-21", "2026-08-04", "2026-08-18", "2026-09-01", "2026-09-15", "2026-10-06", "2026-10-20", "2026-11-03", "2026-11-17", "2026-12-01", "2026-12-15"] },
  { committee: "Comité de Evangelismo", dates: ["2026-01-08", "2026-01-22", "2026-02-12", "2026-02-26", "2026-03-12", "2026-03-26", "2026-04-09", "2026-04-23", "2026-05-14", "2026-05-28", "2026-06-11", "2026-06-25", "2026-07-09", "2026-07-23", "2026-08-13", "2026-08-27", "2026-09-10", "2026-09-24", "2026-10-08", "2026-10-22", "2026-11-12", "2026-11-26", "2026-12-10", "2026-12-24"] },
  { committee: "Comité Escuela Dominical", dates: ["2026-01-10", "2026-02-14", "2026-03-14", "2026-04-11", "2026-05-09", "2026-06-13", "2026-07-11", "2026-08-08", "2026-09-12", "2026-10-10", "2026-11-14", "2026-12-12"] },
  { committee: "Comité de Alabanza", dates: ["2026-01-31", "2026-05-30", "2026-08-29", "2026-10-31"] },
  { committee: "Comité de Obra Social", dates: ["2026-01-27", "2026-02-24", "2026-03-24", "2026-04-28", "2026-05-26", "2026-06-23", "2026-07-28", "2026-08-25", "2026-09-22", "2026-10-27", "2026-11-24", "2026-12-22"] },
  { committee: "Comité de Edad Dorada", dates: ["2026-03-31", "2026-06-30", "2026-09-29", "2026-12-29"] },
  { committee: "Comité de Caballeros", dates: ["2026-01-13", "2026-02-10", "2026-03-10", "2026-04-14", "2026-05-12", "2026-06-09", "2026-07-14", "2026-08-11", "2026-09-08", "2026-10-13", "2026-11-10", "2026-12-08"] },
  { committee: "Comité Red de Familia", dates: ["2026-01-24", "2026-02-28", "2026-03-28", "2026-04-25", "2026-05-23", "2026-06-27", "2026-07-25", "2026-08-22", "2026-09-26", "2026-10-24", "2026-11-28", "2026-12-26"] },
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

const featuredEvents = [{ date: "2026-04-03", title: "CONFRATERNIDAD DISTRITAL", time: "10:00 AM · 02:00 PM · 05:00 PM", type: "especial", description: "Sede: IPUC Villa del Río - Manizales", responsable: "Distrito 4", featured: true, imageCandidates: ["confraternidad-abril-3.jpg", "confraternidad.jpg", "Confraternidad Distrital Abril 3.jpg", "assets/confraternidad-abril-3.jpg"] }];

const container = document.getElementById("calendarContainer");
const monthView = document.getElementById("monthView");
const weekView = document.getElementById("weekView");
const dayView = document.getElementById("dayView");
const modal = document.getElementById("eventModal");

let currentView = "month";
let activeDate = new Date(year, 0, 1);

function formatDateKey(y, m, d) { return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }
function dateToKey(date) { return formatDateKey(date.getFullYear(), date.getMonth(), date.getDate()); }
function parseKey(key) { const [y, m, d] = key.split("-").map(Number); return new Date(y, m - 1, d); }
function addDays(date, days) { const copy = new Date(date); copy.setDate(copy.getDate() + days); return copy; }

function addEvent(map, date, event) {
  const existing = map.get(date) || [];
  existing.push(event);
  map.set(date, existing);
}

function getDefaultCultoEvent(dateObj) {
  const day = dateObj.getDay();
  if (day === 4) return { title: "Culto de Oración y Enseñanza", time: "07:00 PM", type: "culto", description: "Jueves regular", isDefault: true };
  if ([2, 6].includes(day)) return { title: "Culto congregacional", time: "07:00 PM", type: "culto", description: "Culto regular", isDefault: true };
  if (day === 0) return { title: "Culto dominical", time: "10:00 AM", type: "culto", description: "Culto regular", isDefault: true };
  return null;
}

function buildEventsByDate() {
  const map = new Map();
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const key = dateToKey(date);
      const defaultEvent = getDefaultCultoEvent(date);
      map.set(key, defaultEvent ? [defaultEvent] : []);
    }
  }

  committeeCultoSchedule.forEach(({ committee, dates }) =>
    dates.forEach((date) => {
      const dateObj = parseKey(date);
      const cultoTime = dateObj.getDay() === 0 ? "10:00 AM" : "07:00 PM";
      addEvent(map, date, {
        title: `Culto ${committee}`,
        time: cultoTime,
        type: "culto",
        description: "Programación oficial de culto",
        responsable: committee
      });
    })
  );

  map.forEach((events, date) => {
    if (events.some((event) => event.type === "culto" && event.responsable)) map.set(date, events.filter((event) => !event.isDefault));
  });

  prayerSchedule.forEach(({ date, committees }) => addEvent(map, date, { title: "Oración", time: "06:00 PM - 08:00 PM", type: "oracion", description: "Programación oración lunes 2026", responsable: committees.join(", ") }));
  fastingSchedule.forEach(({ date, committees }) => addEvent(map, date, { title: "Ayuno", time: "Jornada de ayuno", type: "ayuno", description: "Programación de ayunos 2026", responsable: committees.join(", ") }));
  vigilSchedule.forEach(({ date, committees }) => addEvent(map, date, { title: "Vigilia", time: "08:00 PM - 12:00 AM", type: "vigilia", description: "Programación de vigilias 2026", responsable: committees.join(", ") }));
  featuredEvents.forEach((event) => addEvent(map, event.date, event));

  return map;
}

const eventsByDate = buildEventsByDate();

function setProgressiveImage(imgEl, candidates = []) {
  const uniqueCandidates = [...new Set(candidates)];
  let index = 0;
  function tryLoad() { imgEl.src = uniqueCandidates[index] || fallbackImage; }
  imgEl.onerror = () => { index += 1; if (index < uniqueCandidates.length) tryLoad(); };
  tryLoad();
}

const churchLogo = document.getElementById("churchLogo");
if (churchLogo) setProgressiveImage(churchLogo, ["logo-villa-del-rio.png", "LOGO IPUC VILLA DEL RIO.png", "LOGO IPUC.png", "LOGO IPUC PNG.png", "logo ipuc.png", "logo-ipuc.png", fallbackImage]);

function openModal(event, dateText) {
  document.getElementById("modalTitle").textContent = event.title;
  document.getElementById("modalDate").textContent = `Fecha: ${dateText}`;
  document.getElementById("modalTime").textContent = `Hora: ${event.time || "Por confirmar"}`;
  document.getElementById("modalDescription").textContent = [event.description || "Sin descripción adicional", event.responsable ? `Encargados: ${event.responsable}` : ""].filter(Boolean).join(" · ");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal() { modal.classList.remove("show"); modal.setAttribute("aria-hidden", "true"); }
document.getElementById("closeModal").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

function createEventButton(event, dateObj) {
  const badge = document.createElement("button");
  badge.type = "button";
  badge.className = `event ${eventColors[event.type] || "especial"}`;
  const strong = document.createElement("strong");
  strong.textContent = event.title;
  const detail = document.createElement("span");
  detail.textContent = [event.time, event.responsable].filter(Boolean).join(" · ");
  badge.append(strong);
  if (detail.textContent) badge.append(detail);
  badge.addEventListener("click", () => openModal(event, `${dateObj.getDate()} de ${monthNames[dateObj.getMonth()]} de ${year}`));
  return badge;
}

function createFeaturedCard(event, dateObj) {
  const card = document.createElement("div");
  card.className = "special-card";
  const title = document.createElement("strong"); title.textContent = event.title;
  const time = document.createElement("div"); time.textContent = event.time;
  const sub = document.createElement("small"); sub.textContent = "Evento principal de la semana";
  const img = document.createElement("img"); img.alt = `Imagen de ${event.title}`;
  setProgressiveImage(img, [...(event.imageCandidates || []), fallbackImage]);
  card.append(title, time, sub, img);
  card.addEventListener("click", () => openModal(event, `${dateObj.getDate()} de ${monthNames[dateObj.getMonth()]} de ${year}`));
  return card;
}

function renderMonthView(targetMonth = activeDate.getMonth()) {
  container.innerHTML = "";
  const monthSection = document.createElement("section");
  monthSection.className = "month";
  const monthHeader = document.createElement("div");
  monthHeader.className = "month-header";
  monthHeader.textContent = `${monthNames[targetMonth]} ${year}`;
  monthSection.append(monthHeader);

  const weekdays = document.createElement("div");
  weekdays.className = "weekdays";
  dayNames.forEach((day) => { const el = document.createElement("div"); el.textContent = day; weekdays.append(el); });
  monthSection.append(weekdays);

  const grid = document.createElement("div");
  grid.className = "days-grid";

  const firstDay = new Date(year, targetMonth, 1);
  const offset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  for (let i = 0; i < offset; i++) { const empty = document.createElement("div"); empty.className = "day empty"; grid.append(empty); }

  const today = new Date();
  const daysInMonth = new Date(year, targetMonth + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, targetMonth, d);
    const key = dateToKey(dateObj);
    const dayCell = document.createElement("article");
    dayCell.className = "day";
    if (today.getFullYear() === year && today.getMonth() === targetMonth && today.getDate() === d) dayCell.classList.add("today");
    const n = document.createElement("div"); n.className = "day-number"; n.textContent = d; dayCell.append(n);

    (eventsByDate.get(key) || []).forEach((event) => {
      if (event.featured) dayCell.append(createFeaturedCard(event, dateObj));
      dayCell.append(createEventButton(event, dateObj));
    });

    dayCell.addEventListener("dblclick", () => {
      activeDate = dateObj;
      setView("day");
    });

    grid.append(dayCell);
  }

  monthSection.append(grid);
  container.append(monthSection);
}

function weekStart(date) {
  const day = date.getDay() === 0 ? 7 : date.getDay();
  return addDays(date, -(day - 1));
}

function renderWeekView() {
  weekView.innerHTML = "";
  const start = weekStart(activeDate);
  const end = addDays(start, 6);

  const wrapper = document.createElement("div");
  wrapper.className = "week-layout";
  const title = document.createElement("h3");
  title.className = "week-title";
  title.textContent = `Semana: ${start.getDate()} ${monthNames[start.getMonth()]} - ${end.getDate()} ${monthNames[end.getMonth()]} ${year}`;
  wrapper.append(title);

  const grid = document.createElement("div");
  grid.className = "week-grid";

  for (let i = 0; i < 7; i++) {
    const dateObj = addDays(start, i);
    const key = dateToKey(dateObj);
    const card = document.createElement("article");
    card.className = "week-card";
    const head = document.createElement("h4");
    head.textContent = `${dayNames[i]} ${dateObj.getDate()}`;
    card.append(head);

    (eventsByDate.get(key) || []).forEach((event) => card.append(createEventButton(event, dateObj)));

    card.addEventListener("click", () => { activeDate = dateObj; setView("day"); });
    grid.append(card);
  }

  wrapper.append(grid);
  weekView.append(wrapper);
}

function renderDayView() {
  dayView.innerHTML = "";
  const key = dateToKey(activeDate);
  const wrapper = document.createElement("div");
  wrapper.className = "day-layout";

  const title = document.createElement("h3");
  title.className = "day-title";
  title.textContent = `${dayNames[(activeDate.getDay() || 7) - 1]}, ${activeDate.getDate()} de ${monthNames[activeDate.getMonth()]} ${year}`;
  wrapper.append(title);

  const list = document.createElement("div");
  list.className = "event-list";
  const events = eventsByDate.get(key) || [];
  if (!events.length) {
    const empty = document.createElement("p");
    empty.textContent = "No hay eventos programados para este día.";
    list.append(empty);
  } else {
    events.forEach((event) => {
      if (event.featured) list.append(createFeaturedCard(event, activeDate));
      list.append(createEventButton(event, activeDate));
    });
  }

  wrapper.append(list);
  dayView.append(wrapper);
}

function setView(view) {
  currentView = view;
  ["month", "week", "day"].forEach((name) => {
    document.getElementById(`${name}View`).classList.toggle("active", name === view);
    document.getElementById(`view${name[0].toUpperCase()}${name.slice(1)}`).classList.toggle("btn-primary", name === view);
  });

  if (view === "month") renderMonthView(activeDate.getMonth());
  if (view === "week") renderWeekView();
  if (view === "day") renderDayView();
}

function shift(direction) {
  if (currentView === "month") activeDate = new Date(year, activeDate.getMonth() + direction, 1);
  if (currentView === "week") activeDate = addDays(activeDate, 7 * direction);
  if (currentView === "day") activeDate = addDays(activeDate, direction);
  setView(currentView);
}

document.getElementById("prevMonth").addEventListener("click", () => shift(-1));
document.getElementById("nextMonth").addEventListener("click", () => shift(1));
document.getElementById("todayBtn").addEventListener("click", () => {
  const today = new Date();
  activeDate = today.getFullYear() === year ? today : new Date(year, 0, 1);
  setView(currentView);
});
document.getElementById("viewMonth").addEventListener("click", () => setView("month"));
document.getElementById("viewWeek").addEventListener("click", () => setView("week"));
document.getElementById("viewDay").addEventListener("click", () => setView("day"));

function initVerseCarousel() {
  const verseText = document.getElementById("verseText");
  let index = 0;
  verseText.textContent = verses[index];
  setInterval(() => {
    index = (index + 1) % verses.length;
    verseText.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 400, fill: "forwards" });
    verseText.textContent = verses[index];
  }, 7000);
}

setView("month");
initVerseCarousel();
