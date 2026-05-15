const year = 2026;
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const eventColors = { culto: "culto", oracion: "oracion", vigilia: "vigilia", ayuno: "ayuno", especial: "especial" };
const activeFilters = new Set(Object.keys(eventColors));

const fallbackImage = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'><rect width='100%' height='100%' fill='#1f3b68'/><text x='50%' y='50%' fill='white' text-anchor='middle' font-size='46'>IPUC Villa del Río</text></svg>`);
const logoFallback = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='500' height='220'><rect width='100%' height='100%' rx='22' fill='#0f4fa3'/><text x='50%' y='48%' text-anchor='middle' fill='white' font-size='48'>IPUC</text><text x='50%' y='68%' text-anchor='middle' fill='#cde3ff' font-size='28'>Villa del Río</text></svg>`);

const verses = ['"Y recibiréis poder..." — Hechos 1:8', '"Un Señor, una fe, un bautismo." — Efesios 4:5', '"Sed llenos del Espíritu." — Efesios 5:18'];

const committeeCultoSchedule = [
  { committee: "Comité de Jóvenes", dates: ["2026-01-17","2026-02-07","2026-02-21","2026-03-07","2026-03-21","2026-04-04","2026-04-18","2026-05-02","2026-05-16","2026-06-06","2026-06-13","2026-07-04","2026-07-18","2026-08-01","2026-08-15","2026-09-05","2026-09-19","2026-10-03","2026-10-17","2026-11-07","2026-11-21","2026-12-05","2026-12-19"] },
  { committee: "Comité de Dorcas", dates: ["2026-01-06","2026-01-20","2026-02-03","2026-02-17","2026-03-03","2026-03-17","2026-04-07","2026-04-21","2026-05-05","2026-05-19","2026-06-02","2026-06-16","2026-07-07","2026-07-21","2026-08-04","2026-08-18","2026-09-01","2026-09-15","2026-10-06","2026-10-20","2026-11-03","2026-11-17","2026-12-01","2026-12-15"] },
  { committee: "Comité de Evangelismo", dates: ["2026-01-08","2026-01-22","2026-02-12","2026-02-26","2026-03-12","2026-03-26","2026-04-09","2026-04-23","2026-05-14","2026-05-28","2026-06-11","2026-06-25","2026-07-09","2026-07-23","2026-08-13","2026-08-27","2026-09-10","2026-09-24","2026-10-08","2026-10-22","2026-11-12","2026-11-26","2026-12-10","2026-12-24"] },
  { committee: "Comité Escuela Dominical", dates: ["2026-01-10","2026-02-14","2026-03-14","2026-04-11","2026-05-09","2026-06-13","2026-07-11","2026-08-08","2026-09-12","2026-10-10","2026-11-14","2026-12-12"] },
  { committee: "Comité de Alabanza", dates: ["2026-01-31","2026-05-30","2026-08-29","2026-10-31"] },
  { committee: "Comité de Obra Social", dates: ["2026-01-27","2026-02-24","2026-03-24","2026-04-28","2026-05-26","2026-06-23","2026-07-28","2026-08-25","2026-09-22","2026-10-27","2026-11-24","2026-12-22"] },
  { committee: "Comité de Edad Dorada", dates: ["2026-03-31","2026-06-30","2026-09-29","2026-12-29"] },
  { committee: "Comité de Caballeros", dates: ["2026-01-13","2026-02-10","2026-03-10","2026-04-14","2026-05-12","2026-06-09","2026-07-14","2026-08-11","2026-09-08","2026-10-13","2026-11-10","2026-12-08"] },
  { committee: "Comité Red de Familia", dates: ["2026-01-24","2026-02-28","2026-03-28","2026-04-25","2026-05-23","2026-06-27","2026-07-25","2026-08-22","2026-09-26","2026-10-24","2026-11-28","2026-12-26"] },
  { committee: "Comité de Misiones", dates: ["2026-01-25","2026-02-22","2026-03-29","2026-04-26","2026-05-31","2026-06-28","2026-07-26","2026-08-30","2026-09-27","2026-10-25","2026-11-29","2026-12-27"] }
];
const prayerSchedule = [{date:"2026-02-09",committees:["Junta local","Damas Dorcas","Jóvenes"]},{date:"2026-03-09",committees:["Escuela dominical","Caballeros","Alabanza"]},{date:"2026-04-06",committees:["Edad dorada","Evangelismo","Red de familia"]},{date:"2026-05-11",committees:["Obra social","Misiones","Recepción"]},{date:"2026-06-01",committees:["Junta local","Damas Dorcas","Jóvenes"]},{date:"2026-07-13",committees:["Escuela dominical","Caballeros","Alabanza"]},{date:"2026-08-10",committees:["Edad dorada","Evangelismo","Red de familia"]},{date:"2026-09-14",committees:["Obra social","Misiones","Recepción"]},{date:"2026-10-05",committees:["Junta local","Damas Dorcas","Jóvenes"]},{date:"2026-11-09",committees:["Escuela dominical","Caballeros","Alabanza"]},{date:"2026-12-07",committees:["Edad dorada","Evangelismo","Red de familia"]}];
const fastingSchedule=[{date:"2026-03-01",committees:["Todos los comités"]},{date:"2026-05-03",committees:["Obra social","Misiones","Recepción"]},{date:"2026-07-05",committees:["Edad dorada","Evangelismo","Red de familias"]},{date:"2026-09-06",committees:["Escuela dominical","Caballeros","Alabanza"]},{date:"2026-11-01",committees:["Junta local","Damas Dorcas","Jóvenes"]}];
const vigilSchedule=[{date:"2026-04-17",committees:["Evangelismo","Red de familias","Edad dorada"]},{date:"2026-06-19",committees:["Escuela dominical","Caballeros","Alabanza"]},{date:"2026-08-21",committees:["Obra social","Misiones","Recepción"]},{date:"2026-10-23",committees:["Junta local","Damas Dorcas","Jóvenes"]},{date:"2026-12-18",committees:["Evangelismo","Red de familias","Edad dorada"]}];
const featuredEvents=[{date:"2026-04-03",title:"CONFRATERNIDAD DISTRITAL",time:"10:00 AM · 02:00 PM · 05:00 PM",type:"especial",description:"Sede: IPUC Villa del Río",responsable:"Distrito 4",featured:true,imageCandidates:["confraternidad-abril-3.jpg"]}];

const yearContainer=document.getElementById("yearContainer");
const monthContainer=document.getElementById("calendarContainer");
const weekView=document.getElementById("weekView");
const dayView=document.getElementById("dayView");
const modal=document.getElementById("eventModal");

let currentView='year';
const now=new Date();
let activeDate=(now.getFullYear()===year)?new Date(now.getFullYear(),now.getMonth(),now.getDate()):new Date(year,0,1);

const formatDateKey=(y,m,d)=>`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const dateToKey=(d)=>formatDateKey(d.getFullYear(),d.getMonth(),d.getDate());
const parseKey=(key)=>{const [y,m,d]=key.split('-').map(Number);return new Date(y,m-1,d)};
const addDays=(d,n)=>{const c=new Date(d);c.setDate(c.getDate()+n);return c;};

function addEvent(map,date,event){const l=map.get(date)||[];l.push(event);map.set(date,l);}
function getDefaultCultoEvent(dateObj){const day=dateObj.getDay();if(day===4)return{title:"Culto de Oración y Enseñanza",time:"07:00 PM",type:"culto",isDefault:true};if([2,6].includes(day))return{title:"Culto congregacional",time:"07:00 PM",type:"culto",isDefault:true};if(day===0)return{title:"Culto dominical",time:"10:00 AM",type:"culto",isDefault:true};return null;}

function buildEventsByDate(){
  const map=new Map();
  for(let m=0;m<12;m++){const dim=new Date(year,m+1,0).getDate();for(let d=1;d<=dim;d++){const date=new Date(year,m,d);const def=getDefaultCultoEvent(date);map.set(dateToKey(date),def?[def]:[]);}}
  committeeCultoSchedule.forEach(({committee,dates})=>dates.forEach((date)=>{const dd=parseKey(date);addEvent(map,date,{title:`Culto ${committee}`,time:dd.getDay()===0?"10:00 AM":"07:00 PM",type:"culto",description:"Programación oficial",responsable:committee});}));
  map.forEach((events,key)=>{if(events.some(e=>e.type==='culto'&&e.responsable))map.set(key,events.filter(e=>!e.isDefault));});
  prayerSchedule.forEach(({date,committees})=>addEvent(map,date,{title:"Oración",time:"06:00 PM - 08:00 PM",type:"oracion",responsable:committees.join(', ')}));
  fastingSchedule.forEach(({date,committees})=>addEvent(map,date,{title:"Ayuno",time:"Jornada de ayuno",type:"ayuno",responsable:committees.join(', ')}));
  vigilSchedule.forEach(({date,committees})=>addEvent(map,date,{title:"Vigilia",time:"08:00 PM - 12:00 AM",type:"vigilia",responsable:committees.join(', ')}));
  featuredEvents.forEach((e)=>addEvent(map,e.date,e));
  return map;
}
const eventsByDate=buildEventsByDate();

function filteredEvents(dateKey){return (eventsByDate.get(dateKey)||[]).filter(e=>activeFilters.has(e.type));}
function dayTypes(dateKey){return [...new Set((eventsByDate.get(dateKey)||[]).map(e=>e.type))];}

function setProgressiveImage(img,candidates=[]){const c=[...new Set(candidates)];let i=0;const load=()=>{img.src=c[i]||fallbackImage};img.onerror=()=>{i++;if(i<c.length)load();};load();}
const churchLogo=document.getElementById('churchLogo');if(churchLogo)setProgressiveImage(churchLogo,["DECOM VILLA DEL RIO.png","decom-villa-del-rio.png","logo-villa-del-rio.png",logoFallback]);

function openModal(event,dateText){document.getElementById('modalTitle').textContent=event.title;document.getElementById('modalDate').textContent=`Fecha: ${dateText}`;document.getElementById('modalTime').textContent=`Hora: ${event.time||'Por confirmar'}`;document.getElementById('modalDescription').textContent=event.responsable?`Encargados: ${event.responsable}`:'';modal.classList.add('show');}
function closeModal(){modal.classList.remove('show');}
document.getElementById('closeModal').addEventListener('click',closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});

function createEventButton(event,dateObj){const b=document.createElement('button');b.className=`event ${eventColors[event.type]||'especial'}`;const t=document.createElement('strong');t.textContent=event.title;const s=document.createElement('span');s.textContent=[event.time,event.responsable].filter(Boolean).join(' · ');b.append(t);if(s.textContent)b.append(s);b.addEventListener('click',()=>openModal(event,`${dateObj.getDate()} de ${monthNames[dateObj.getMonth()]} de ${year}`));return b;}

function renderMonthSection(month,container,isOverview=false){
  const section=document.createElement('section');section.className='month';
  if(isOverview) section.classList.add('month-compact');
  const header=document.createElement('div');header.className='month-header';header.textContent=`${monthNames[month]} ${year}`;
  if(isOverview){header.style.cursor='pointer';header.title='Abrir vista mensual';header.addEventListener('click',()=>{activeDate=new Date(year,month,1);setView('month');});}
  section.append(header);
  const weekdays=document.createElement('div');weekdays.className='weekdays';dayNames.forEach((d)=>{const el=document.createElement('div');el.textContent=d;weekdays.append(el);});section.append(weekdays);
  const grid=document.createElement('div');grid.className='days-grid';
  const first=new Date(year,month,1);const offset=first.getDay()===0?6:first.getDay()-1;for(let i=0;i<offset;i++){const e=document.createElement('div');e.className='day empty';grid.append(e);}  
  const dim=new Date(year,month+1,0).getDate();
  for(let d=1;d<=dim;d++){
    const dateObj=new Date(year,month,d);const key=dateToKey(dateObj);const cell=document.createElement('article');cell.className='day';
    const num=document.createElement('div');num.className='day-number';num.textContent=d;cell.append(num);
    const isToday=now.getFullYear()===year && now.getMonth()===month && now.getDate()===d;
    if(isToday) cell.classList.add('today');

    if(isOverview){
      const types=dayTypes(key);
      if(types.length){
        const bars=document.createElement('div');
        bars.className='day-type-bars';
        types.forEach((type)=>{const bar=document.createElement('span');bar.className=`type-bar ${type}`;bars.append(bar);});
        cell.append(bars);
      }
    } else {
      filteredEvents(key).forEach((ev)=>cell.append(createEventButton(ev,dateObj)));
    }

    cell.addEventListener('click',()=>{activeDate=dateObj;setView('day');});
    grid.append(cell);
  }
  section.append(grid);container.append(section);
}

function renderYearView(){yearContainer.innerHTML='';for(let m=0;m<12;m++)renderMonthSection(m,yearContainer,true);}
function renderMonthView(){monthContainer.innerHTML='';renderMonthSection(activeDate.getMonth(),monthContainer,false);}

function weekStart(d){const day=d.getDay()===0?7:d.getDay();return addDays(d,-(day-1));}
function renderWeekView(){weekView.innerHTML='';const start=weekStart(activeDate);const wrap=document.createElement('div');wrap.className='week-layout';const t=document.createElement('h3');t.className='week-title';t.textContent=`Semana de ${start.getDate()} ${monthNames[start.getMonth()]}`;wrap.append(t);const grid=document.createElement('div');grid.className='week-grid';for(let i=0;i<7;i++){const dateObj=addDays(start,i);const card=document.createElement('article');card.className='week-card';const h=document.createElement('h4');h.textContent=`${dayNames[i]} ${dateObj.getDate()}`;card.append(h);filteredEvents(dateToKey(dateObj)).forEach(ev=>card.append(createEventButton(ev,dateObj)));card.addEventListener('click',()=>{activeDate=dateObj;setView('day');});grid.append(card);}wrap.append(grid);weekView.append(wrap);}
function renderDayView(){dayView.innerHTML='';const wrap=document.createElement('div');wrap.className='day-layout';const t=document.createElement('h3');t.className='day-title';t.textContent=`${dayNames[(activeDate.getDay()||7)-1]}, ${activeDate.getDate()} de ${monthNames[activeDate.getMonth()]}`;wrap.append(t);const list=document.createElement('div');list.className='event-list';const events=filteredEvents(dateToKey(activeDate));if(!events.length){const p=document.createElement('p');p.textContent='No hay eventos para los filtros seleccionados.';list.append(p);}else events.forEach(ev=>list.append(createEventButton(ev,activeDate)));wrap.append(list);dayView.append(wrap);}

function setView(view){currentView=view;['year','month','week','day'].forEach((v)=>{document.getElementById(v+'View')?.classList.toggle('active',v===view);document.getElementById('view'+v[0].toUpperCase()+v.slice(1))?.classList.toggle('btn-primary',v===view);});if(view==='year')renderYearView();if(view==='month')renderMonthView();if(view==='week')renderWeekView();if(view==='day')renderDayView();}
function shift(dir){if(currentView==='year')activeDate=new Date(year,activeDate.getMonth()+dir,1);if(currentView==='month')activeDate=new Date(year,activeDate.getMonth()+dir,1);if(currentView==='week')activeDate=addDays(activeDate,dir*7);if(currentView==='day')activeDate=addDays(activeDate,dir);setView(currentView);} 

document.getElementById('prevMonth').addEventListener('click',()=>shift(-1));
document.getElementById('nextMonth').addEventListener('click',()=>shift(1));
document.getElementById('todayBtn').addEventListener('click',()=>{const t=new Date();activeDate=t.getFullYear()===year?t:new Date(year,0,1);setView(currentView);});
document.getElementById('viewYear').addEventListener('click',()=>setView('year'));
document.getElementById('viewMonth').addEventListener('click',()=>setView('month'));
document.getElementById('viewWeek').addEventListener('click',()=>setView('week'));
document.getElementById('viewDay').addEventListener('click',()=>setView('day'));

function findNearestEventByType(type){
  const sorted=[...eventsByDate.keys()].sort();
  const currentKey=dateToKey(activeDate);
  let candidate=sorted.find((k)=>k>=currentKey && (eventsByDate.get(k)||[]).some((e)=>e.type===type));
  if(!candidate){
    candidate=sorted.find((k)=>(eventsByDate.get(k)||[]).some((e)=>e.type===type));
  }
  return candidate;
}

document.querySelectorAll('.legend .chip').forEach((chip)=>{
  chip.addEventListener('click',()=>{
    const type=chip.dataset.type;
    const nearest=findNearestEventByType(type);
    if(nearest){
      activeDate=parseKey(nearest);
      setView('day');
    }
  });
});

function initVerseCarousel(){const v=document.getElementById('verseText');let i=0;v.textContent=verses[i];setInterval(()=>{i=(i+1)%verses.length;v.textContent=verses[i];},7000);} 

function escapeIcsText(text=''){return String(text).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');}
function buildIcsCalendar(){const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//IPUC Villa del Río//Cronograma 2026//ES","CALSCALE:GREGORIAN","METHOD:PUBLISH"];const stamp=new Date().toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';[...eventsByDate.entries()].forEach(([dateKey,events])=>{events.forEach((event,idx)=>{const d=parseKey(dateKey);const start=`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;lines.push('BEGIN:VEVENT',`UID:${dateKey}-${idx}@ipuc`,`DTSTAMP:${stamp}`,`DTSTART;VALUE=DATE:${start}`,`DTEND;VALUE=DATE:${start}`,`SUMMARY:${escapeIcsText(event.title)}`,`DESCRIPTION:${escapeIcsText(event.responsable||'')}`,'LOCATION:IPUC Villa del Río','END:VEVENT');});});lines.push('END:VCALENDAR');return lines.join('\r\n');}
function downloadIcsFile(){const blob=new Blob([buildIcsCalendar()],{type:'text/calendar;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='IPUC-Villa-del-Rio-Cronograma-2026.ics';a.click();URL.revokeObjectURL(url);} 
async function shareIcsFile(){const file=new File([buildIcsCalendar()],'IPUC-Villa-del-Rio-Cronograma-2026.ics',{type:'text/calendar'});if(navigator.canShare&&navigator.canShare({files:[file]}))await navigator.share({title:'Cronograma 2026',files:[file]});else downloadIcsFile();}
document.getElementById('downloadIcs').addEventListener('click',downloadIcsFile);
document.getElementById('shareIcs').addEventListener('click',()=>shareIcsFile().catch(downloadIcsFile));

setView('year');
initVerseCarousel();
