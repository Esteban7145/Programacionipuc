/* ================================================================
   Cronograma IPUC Villa del Río — Aplicación Principal v2
   Glassmorphism, persistencia localStorage, clock real, toast,
   debounce, preview de archivos, modal animado, router limpio
   ================================================================ */

'use strict';

// ─────────────────────────────────────────────────────────────
// Tipos de evento
// ─────────────────────────────────────────────────────────────
const TYPES = {
  culto:    { label: 'Culto',    color: 'var(--culto)' },
  oracion:  { label: 'Oración',  color: 'var(--oracion)' },
  vigilia:  { label: 'Vigilia',  color: 'var(--vigilia)' },
  ayuno:    { label: 'Ayuno',    color: 'var(--ayuno)' },
  especial: { label: 'Especial', color: 'var(--especial)' }
};

// ─────────────────────────────────────────────────────────────
// Eventos programados (anuales fijos)
// ─────────────────────────────────────────────────────────────
const PROGRAMMED_EVENTS = [
  { date: '2026-02-09', type: 'oracion', title: 'Oración lunes - Junta local, Damas Dorcas y Jóvenes', time: '7:00 p. m.' },
  { date: '2026-03-09', type: 'oracion', title: 'Oración lunes - Escuela dominical, Caballeros y Alabanza', time: '7:00 p. m.' },
  { date: '2026-04-06', type: 'oracion', title: 'Oración lunes - Edad dorada, Evangelismo y Red de familia', time: '7:00 p. m.' },
  { date: '2026-05-11', type: 'oracion', title: 'Oración lunes - Obra social, Misiones y Recepción', time: '7:00 p. m.' },
  { date: '2026-06-01', type: 'oracion', title: 'Oración lunes - Junta local, Damas Dorcas y Jóvenes', time: '7:00 p. m.' },
  { date: '2026-07-13', type: 'oracion', title: 'Oración lunes - Escuela dominical, Caballeros y Alabanza', time: '7:00 p. m.' },
  { date: '2026-08-10', type: 'oracion', title: 'Oración lunes - Edad dorada, Evangelismo y Red de familia', time: '7:00 p. m.' },
  { date: '2026-09-14', type: 'oracion', title: 'Oración lunes - Obra social, Misiones y Recepción', time: '7:00 p. m.' },
  { date: '2026-10-05', type: 'oracion', title: 'Oración lunes - Junta local, Damas Dorcas y Jóvenes', time: '7:00 p. m.' },
  { date: '2026-11-09', type: 'oracion', title: 'Oración lunes - Escuela dominical, Caballeros y Alabanza', time: '7:00 p. m.' },
  { date: '2026-12-07', type: 'oracion', title: 'Oración lunes - Edad dorada, Evangelismo y Red de familia', time: '7:00 p. m.' },
  { date: '2026-03-01', type: 'ayuno', title: 'Ayuno - Todos los comités', time: '8:00 a. m.' },
  { date: '2026-05-03', type: 'ayuno', title: 'Ayuno - Obra social, Misiones y Recepción', time: '8:00 a. m.' },
  { date: '2026-07-05', type: 'ayuno', title: 'Ayuno - Edad dorada, Evangelismo y Red de familias', time: '8:00 a. m.' },
  { date: '2026-09-06', type: 'ayuno', title: 'Ayuno - Escuela dominical, Caballeros y Alabanza', time: '8:00 a. m.' },
  { date: '2026-11-01', type: 'ayuno', title: 'Ayuno - Junta local, Damas Dorcas y Jóvenes', time: '8:00 a. m.' },
  { date: '2026-04-17', type: 'vigilia', title: 'Vigilia - Evangelismo, Red de familias y Edad dorada', time: '9:00 p. m.' },
  { date: '2026-06-19', type: 'vigilia', title: 'Vigilia - Escuela dominical, Caballeros y Alabanza', time: '9:00 p. m.' },
  { date: '2026-08-21', type: 'vigilia', title: 'Vigilia - Obra social, Misiones y Recepción', time: '9:00 p. m.' },
  { date: '2026-10-23', type: 'vigilia', title: 'Vigilia - Junta local, Damas Dorcas y Jóvenes', time: '9:00 p. m.' },
  { date: '2026-12-18', type: 'vigilia', title: 'Vigilia - Evangelismo, Red de familias y Edad dorada', time: '9:00 p. m.' },
  { date: '2026-01-17', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-02-07', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-02-21', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-03-07', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-03-21', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-04-04', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-04-18', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-05-02', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-05-16', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-06-06', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-06-13', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-07-04', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-07-18', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-08-01', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-08-15', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-09-05', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-09-19', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-10-03', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-10-17', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-11-07', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-11-21', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-12-05', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-12-19', type: 'culto', title: 'Culto comité de Jóvenes', time: '7:00 p. m.' },
  { date: '2026-01-06', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-01-20', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-02-03', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-02-17', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-03-03', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-03-17', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-04-07', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-04-21', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-05-05', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-05-19', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-06-02', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-06-16', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-07-07', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-07-21', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-08-04', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-08-18', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-09-01', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-09-15', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-10-06', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-10-20', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-11-03', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-11-17', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-12-01', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-12-15', type: 'culto', title: 'Culto de Damas Dorcas', time: '7:00 p. m.' },
  { date: '2026-01-08', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-01-22', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-02-12', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-02-26', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-03-12', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-03-26', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-04-09', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-04-23', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-05-14', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-05-28', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-06-11', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-06-25', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-07-09', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-07-23', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-08-13', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-08-27', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-09-10', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-09-24', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-10-08', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-10-22', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-11-12', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-11-26', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-12-10', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-12-24', type: 'culto', title: 'Culto comité de Evangelismo', time: '7:00 p. m.' },
  { date: '2026-01-10', type: 'culto', title: 'Culto comité de Escuela Dominical', time: '7:00 p. m.' },
  { date: '2026-02-14', type: 'culto', title: 'Culto comité de Escuela Dominical', time: '7:00 p. m.' },
  { date: '2026-03-14', type: 'culto', title: 'Culto comité de Escuela Dominical', time: '7:00 p. m.' },
  { date: '2026-04-11', type: 'culto', title: 'Culto comité de Escuela Dominical', time: '7:00 p. m.' },
  { date: '2026-05-09', type: 'culto', title: 'Culto comité de Escuela Dominical', time: '7:00 p. m.' },
  { date: '2026-06-13', type: 'culto', title: 'Culto comité de Escuela Dominical', time: '7:00 p. m.' },
  { date: '2026-07-11', type: 'culto', title: 'Culto comité de Escuela Dominical', time: '7:00 p. m.' },
  { date: '2026-08-08', type: 'culto', title: 'Culto comité de Escuela Dominical', time: '7:00 p. m.' },
  { date: '2026-09-12', type: 'culto', title: 'Culto comité de Escuela Dominical', time: '7:00 p. m.' },
  { date: '2026-10-10', type: 'culto', title: 'Culto comité de Escuela Dominical', time: '7:00 p. m.' },
  { date: '2026-11-14', type: 'culto', title: 'Culto comité de Escuela Dominical', time: '7:00 p. m.' },
  { date: '2026-12-12', type: 'culto', title: 'Culto comité de Escuela Dominical', time: '7:00 p. m.' },
  { date: '2026-01-31', type: 'culto', title: 'Culto comité de Alabanza', time: '7:00 p. m.' },
  { date: '2026-05-30', type: 'culto', title: 'Culto comité de Alabanza', time: '7:00 p. m.' },
  { date: '2026-08-29', type: 'culto', title: 'Culto comité de Alabanza', time: '7:00 p. m.' },
  { date: '2026-10-31', type: 'culto', title: 'Culto comité de Alabanza', time: '7:00 p. m.' },
  { date: '2026-01-27', type: 'culto', title: 'Culto comité de Obra Social', time: '7:00 p. m.' },
  { date: '2026-02-24', type: 'culto', title: 'Culto comité de Obra Social', time: '7:00 p. m.' },
  { date: '2026-03-24', type: 'culto', title: 'Culto comité de Obra Social', time: '7:00 p. m.' },
  { date: '2026-04-28', type: 'culto', title: 'Culto comité de Obra Social', time: '7:00 p. m.' },
  { date: '2026-05-26', type: 'culto', title: 'Culto comité de Obra Social', time: '7:00 p. m.' },
  { date: '2026-06-23', type: 'culto', title: 'Culto comité de Obra Social', time: '7:00 p. m.' },
  { date: '2026-07-28', type: 'culto', title: 'Culto comité de Obra Social', time: '7:00 p. m.' },
  { date: '2026-08-25', type: 'culto', title: 'Culto comité de Obra Social', time: '7:00 p. m.' },
  { date: '2026-09-22', type: 'culto', title: 'Culto comité de Obra Social', time: '7:00 p. m.' },
  { date: '2026-10-27', type: 'culto', title: 'Culto comité de Obra Social', time: '7:00 p. m.' },
  { date: '2026-11-24', type: 'culto', title: 'Culto comité de Obra Social', time: '7:00 p. m.' },
  { date: '2026-12-22', type: 'culto', title: 'Culto comité de Obra Social', time: '7:00 p. m.' },
  { date: '2026-03-31', type: 'culto', title: 'Culto comité de Edad Dorada', time: '7:00 p. m.' },
  { date: '2026-06-30', type: 'culto', title: 'Culto comité de Edad Dorada', time: '7:00 p. m.' },
  { date: '2026-09-29', type: 'culto', title: 'Culto comité de Edad Dorada', time: '7:00 p. m.' },
  { date: '2026-12-29', type: 'culto', title: 'Culto comité de Edad Dorada', time: '7:00 p. m.' },
  { date: '2026-01-13', type: 'culto', title: 'Culto comité de Caballeros', time: '7:00 p. m.' },
  { date: '2026-02-10', type: 'culto', title: 'Culto comité de Caballeros', time: '7:00 p. m.' },
  { date: '2026-03-10', type: 'culto', title: 'Culto comité de Caballeros', time: '7:00 p. m.' },
  { date: '2026-04-14', type: 'culto', title: 'Culto comité de Caballeros', time: '7:00 p. m.' },
  { date: '2026-05-12', type: 'culto', title: 'Culto comité de Caballeros', time: '7:00 p. m.' },
  { date: '2026-06-09', type: 'culto', title: 'Culto comité de Caballeros', time: '7:00 p. m.' },
  { date: '2026-07-14', type: 'culto', title: 'Culto comité de Caballeros', time: '7:00 p. m.' },
  { date: '2026-08-11', type: 'culto', title: 'Culto comité de Caballeros', time: '7:00 p. m.' },
  { date: '2026-09-08', type: 'culto', title: 'Culto comité de Caballeros', time: '7:00 p. m.' },
  { date: '2026-10-13', type: 'culto', title: 'Culto comité de Caballeros', time: '7:00 p. m.' },
  { date: '2026-11-10', type: 'culto', title: 'Culto comité de Caballeros', time: '7:00 p. m.' },
  { date: '2026-12-08', type: 'culto', title: 'Culto comité de Caballeros', time: '7:00 p. m.' },
  { date: '2026-01-24', type: 'culto', title: 'Culto comité de Red de Familia', time: '7:00 p. m.' },
  { date: '2026-02-28', type: 'culto', title: 'Culto comité de Red de Familia', time: '7:00 p. m.' },
  { date: '2026-03-28', type: 'culto', title: 'Culto comité de Red de Familia', time: '7:00 p. m.' },
  { date: '2026-04-25', type: 'culto', title: 'Culto comité de Red de Familia', time: '7:00 p. m.' },
  { date: '2026-05-23', type: 'culto', title: 'Culto comité de Red de Familia', time: '7:00 p. m.' },
  { date: '2026-06-27', type: 'culto', title: 'Culto comité de Red de Familia', time: '7:00 p. m.' },
  { date: '2026-07-25', type: 'culto', title: 'Culto comité de Red de Familia', time: '7:00 p. m.' },
  { date: '2026-08-22', type: 'culto', title: 'Culto comité de Red de Familia', time: '7:00 p. m.' },
  { date: '2026-09-26', type: 'culto', title: 'Culto comité de Red de Familia', time: '7:00 p. m.' },
  { date: '2026-10-24', type: 'culto', title: 'Culto comité de Red de Familia', time: '7:00 p. m.' },
  { date: '2026-11-28', type: 'culto', title: 'Culto comité de Red de Familia', time: '7:00 p. m.' },
  { date: '2026-12-26', type: 'culto', title: 'Culto comité de Red de Familia', time: '7:00 p. m.' },
  { date: '2026-01-25', type: 'culto', title: 'Culto comité de Misiones', time: '10:00 a. m.' },
  { date: '2026-02-22', type: 'culto', title: 'Culto comité de Misiones', time: '10:00 a. m.' },
  { date: '2026-03-29', type: 'culto', title: 'Culto comité de Misiones', time: '10:00 a. m.' },
  { date: '2026-04-26', type: 'culto', title: 'Culto comité de Misiones', time: '10:00 a. m.' },
  { date: '2026-05-31', type: 'culto', title: 'Culto comité de Misiones', time: '10:00 a. m.' },
  { date: '2026-06-28', type: 'culto', title: 'Culto comité de Misiones', time: '10:00 a. m.' },
  { date: '2026-07-26', type: 'culto', title: 'Culto comité de Misiones', time: '10:00 a. m.' },
  { date: '2026-08-30', type: 'culto', title: 'Culto comité de Misiones', time: '10:00 a. m.' },
  { date: '2026-09-27', type: 'culto', title: 'Culto comité de Misiones', time: '10:00 a. m.' },
  { date: '2026-10-25', type: 'culto', title: 'Culto comité de Misiones', time: '10:00 a. m.' },
  { date: '2026-11-29', type: 'culto', title: 'Culto comité de Misiones', time: '10:00 a. m.' },
  { date: '2026-12-27', type: 'culto', title: 'Culto comité de Misiones', time: '10:00 a. m.' }
];

// ─────────────────────────────────────────────────────────────
// Datos estáticos
// ─────────────────────────────────────────────────────────────
const MONTHS = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const WEEKDAYS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const WEEKDAYS_SHORT = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

const DAILY_REFLECTIONS = [
  { text: 'Unidos en el nombre de Jesús, la iglesia camina con gozo y firmeza.', ref: 'Hechos 2:46' },
  { text: 'Un Señor, una fe, un bautismo: seguimos adelante en unidad.', ref: 'Efesios 4:5' },
  { text: 'La oración abre camino cuando el pueblo se reúne con fe.', ref: 'Hechos 4:31' },
  { text: 'El nombre de Jesús sigue siendo nuestra esperanza y fortaleza.', ref: 'Filipenses 2:10' },
  { text: 'La iglesia permanece firme cuando sirve con amor y humildad.', ref: 'Colosenses 3:23' },
  { text: 'Donde hay unidad, Dios derrama bendición y vida.', ref: 'Salmo 133:1' },
  { text: 'Cada día es una oportunidad para adorar en espíritu y en verdad.', ref: 'Juan 4:24' },
  { text: 'El Señor añade fuerzas al que espera en Él.', ref: 'Isaías 40:31' },
  { text: 'La luz de Cristo se nota en una vida rendida a su Palabra.', ref: 'Mateo 5:16' },
  { text: 'Somos un cuerpo llamado a servir, amar y perseverar.', ref: '1 Corintios 12:27' },
  { text: 'La fe se aviva cuando recordamos que Dios sigue obrando.', ref: 'Hebreos 11:1' },
  { text: 'La familia de la fe crece cuando camina en paz.', ref: 'Romanos 12:18' },
  { text: 'La santidad también se vive en lo sencillo de cada día.', ref: '1 Pedro 1:16' },
  { text: 'El gozo del Señor sostiene al pueblo que le busca.', ref: 'Nehemías 8:10' },
  { text: 'La Palabra guía nuestros pasos y afirma nuestro camino.', ref: 'Salmo 119:105' }
];

const STORAGE_KEY = 'ipuc-villa-del-rio-event-center-v2';
const TAGS = ['Jóvenes','Damas','Caballeros','Escuela Dominical','Evangelismo','Infantil','Música','Multimedia','Pastoral','Distrital','Nacional','Especial'];

const INVITATION_FIELDS = [
  ['main',    'Invitación principal'],
  ['whatsapp','Invitación para WhatsApp'],
  ['story',   'Historia Instagram/Facebook'],
  ['banner',  'Banner para proyección'],
  ['video',   'Video promocional']
];

const DEFAULT_ANNOUNCEMENTS = [
  { title: 'Cronograma anual disponible', description: 'Ya puedes consultar los cultos, ayunos, vigilias y oraciones del año.', date: '2026-06-03', eventId: '' }
];

// ─────────────────────────────────────────────────────────────
// Estado de la app
// ─────────────────────────────────────────────────────────────
let APP_STATE = loadState();
let activeTags = new Set();
const today = cleanDate(new Date());
let active = findOpeningDate(today);

// ─────────────────────────────────────────────────────────────
// Referencias al DOM
// ─────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const DOM = {
  grid:              $('grid'),
  monthName:         $('monthName'),
  yearName:          $('yearName'),
  selectedTitle:     $('selectedTitle'),
  eventsBox:         $('events'),
  summary:           $('summary'),
  heroTitle:         $('heroTitle'),
  heroType:          $('heroType'),
  heroTime:          $('heroTime'),
  dailyVerse:        $('dailyVerse'),
  clockTime:         $('clockTime'),
  badgeWeekday:      $('badgeWeekday'),
  badgeDay:          $('badgeDay'),
  badgeMonth:        $('badgeMonth'),
  tagFilters:        $('tagFilters'),
  featuredEvents:    $('featuredEvents'),
  announcementList:  $('announcementList'),
  pastEvents:        $('pastEvents'),
  eventModal:        $('eventModal'),
  modalTitle:        $('modalTitle'),
  modalStatus:       $('modalStatus'),
  modalBody:         $('modalBody'),
  mediaModal:        $('mediaModal'),
  mediaTitle:        $('mediaTitle'),
  mediaBody:         $('mediaBody'),
  adminEventSelect:  $('adminEventSelect'),
  announcementEvent: $('announcementEvent'),
  backgroundAudio:   $('backgroundAudio'),
  musicText:         $('musicText'),
  adminTitle:        $('adminTitle'),
  adminDate:         $('adminDate'),
  adminTime:         $('adminTime'),
  adminType:         $('adminType'),
  adminStatus:       $('adminStatus'),
  adminPlace:        $('adminPlace'),
  adminOrganizer:    $('adminOrganizer'),
  adminResponsible:  $('adminResponsible'),
  adminFeatured:     $('adminFeatured'),
  adminDescription:  $('adminDescription'),
  adminObservations: $('adminObservations'),
  adminAttacments:   $('adminAttachments'),
  adminGallery:      $('adminGallery'),
  adminMusic:        $('adminMusic'),
  saveEventButton:   $('saveEventButton'),
  deleteEventButton: $('deleteEventButton'),
  clearLocalButton:  $('clearLocalButton'),
  saveAnnouncementButton: $('saveAnnouncementButton'),
  prevButton:        $('prev'),
  nextButton:        $('next'),
  todayButton:       $('todayButton'),
  addCalendarButton: $('addCalendarButton'),
};

// Crear contenedor de toasts (solo una vez)
if (!document.querySelector('.toast-container')) {
  const tc = document.createElement('div');
  tc.className = 'toast-container';
  tc.id = 'toastContainer';
  document.body.appendChild(tc);
}

// ─────────────────────────────────────────────────────────────
// Inicialización
// ─────────────────────────────────────────────────────────────
function init() {
  renderTagFilters();
  renderAdminTagChecks();
  render();
  populateAdminSelectors();
  loadAdminEvent(DOM.adminEventSelect.value);
  renderMusic();
  startClock();
  updateClock();

  // Navegación
  DOM.prevButton.onclick    = () => { active = new Date(active.getFullYear(), active.getMonth() - 1, Math.min(active.getDate(), 28)); render(); };
  DOM.nextButton.onclick    = () => { active = new Date(active.getFullYear(), active.getMonth() + 1, Math.min(active.getDate(), 28)); render(); };
  DOM.todayButton.onclick   = () => { active = new Date(today); render(); };
  DOM.addCalendarButton.onclick = addAllEventsToCalendar;

  // Admin
  DOM.saveEventButton.onclick   = saveAdminEvent;
  DOM.deleteEventButton.onclick = deleteAdminEvent;
  DOM.clearLocalButton.onclick  = clearLocalData;
  DOM.saveAnnouncementButton.onclick = saveAnnouncement;

  // Music
  DOM.adminMusic.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    APP_STATE.music = await fileToAsset(file, 'Música ambiente');
    saveState();       // ← BUG FIX: persistencia real
    renderMusic();
    showToast('Música guardada en este navegador', 'success');
  };

  // Filtros de tipo
  document.querySelectorAll('.chip').forEach(btn => {
    btn.onclick = () => {
      const ev = closestEvent(btn.dataset.type);
      if (ev) { active = parseDate(ev.date); render(); }
    };
  });

  // Modal cierre
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.onclick = () => closeModal(btn.closest('.modal-backdrop'));
  });
  [DOM.eventModal, DOM.mediaModal].forEach(modal => {
    modal.onclick = (e) => { if (e.target === modal) closeModal(modal); };
  });

  // Redirect limpio para #/inicioquiero → #/inicio
  if (location.hash === '#/inicioquiero' || location.hash === '#/inicioquiero/') {
    history.replaceState(null, '', '#/inicio');
  }

  // Persistencia: escuchar cambios (ya guarda en localStorage vía saveState)
  // Para recuperar el estado después de recargar:
  // loadState() ya lee de localStorage al inicio

  // Preview de archivos seleccionados en admin
  setupFilePreviews();
}

// ─────────────────────────────────────────────────────────────
// Persistencia (BUG FIX principal)
// ─────────────────────────────────────────────────────────────
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      // Recuperar también la música en base64
      return {
        events: data.events || {},
        announcements: data.announcements || DEFAULT_ANNOUNCEMENTS,
        reflections: data.reflections || {},
        music: data.music || null
      };
    }
  } catch (e) {
    console.warn('Error al leer localStorage:', e);
  }
  return { events: {}, announcements: DEFAULT_ANNOUNCEMENTS, reflections: {}, music: null };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      events: APP_STATE.events,
      announcements: APP_STATE.announcements,
      reflections: APP_STATE.reflections,
      music: APP_STATE.music
    }));
  } catch (e) {
    console.warn('Error al guardar localStorage (quizás quota excedida):', e);
    showToast('No se pudo guardar (almacenamiento lleno)', 'error');
  }
}

function clearLocalData() {
  if (!confirm('Esto borrará todos los cambios locales de este navegador. ¿Continuar?')) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) { console.warn(e); }
  APP_STATE = { events: {}, announcements: DEFAULT_ANNOUNCEMENTS, reflections: {}, music: null };
  render();
  loadAdminEvent('__new__');
  renderMusic();
  showToast('Cambios locales eliminados', 'success');
  renderTagFilters();
  renderAdminTagChecks();
}

// ─────────────────────────────────────────────────────────────
// Reloj con manecillas SVG reales (BUG FIX)
// ─────────────────────────────────────────────────────────────
let clockInterval = null;

function startClock() {
  // Insertar SVG de reloj si no existe
  if (!DOM.clockTime.querySelector('.clock-svg')) {
    const svg = createClockSvg();
    DOM.clockTime.appendChild(svg);
  }
  // Actualizar cada segundo para los segundos, pero las manecillas
  // cada 10s es suficiente. Sin embargo, para el reloj digital necesitamos segundos.
  // Usamos un intervalo de 1s pero solo re-renderizamos el SVG cada 10s via flag.
  clockInterval = setInterval(() => {
    updateClock();
  }, 1000);
}

function createClockSvg() {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'clock-svg');
  svg.setAttribute('viewBox', '0 0 42 42');

  // Círculo exterior
  const circle = document.createElementNS(svgNS, 'circle');
  circle.setAttribute('cx', '21');
  circle.setAttribute('cy', '21');
  circle.setAttribute('r', '18');
  circle.setAttribute('fill', 'none');
  circle.setAttribute('stroke', 'rgba(28,139,120,0.22)');
  circle.setAttribute('stroke-width', '2');
  svg.appendChild(circle);

  // Gusano de las horas
  const hourHand = document.createElementNS(svgNS, 'line');
  hourHand.setAttribute('class', 'hand hour-hand');
  hourHand.setAttribute('x1', '21');
  hourHand.setAttribute('y1', '21');
  hourHand.setAttribute('x2', '21');
  hourHand.setAttribute('y2', '9');
  hourHand.setAttribute('stroke', 'var(--brand-deep)');
  hourHand.setAttribute('stroke-width', '2.5');
  hourHand.setAttribute('stroke-linecap', 'round');
  svg.appendChild(hourHand);

  // Gusano de los minutos
  const minHand = document.createElementNS(svgNS, 'line');
  minHand.setAttribute('class', 'hand minute-hand');
  minHand.setAttribute('x1', '21');
  minHand.setAttribute('y1', '21');
  minHand.setAttribute('x2', '21');
  minHand.setAttribute('y2', '7');
  minHand.setAttribute('stroke', 'var(--brand-teal)');
  minHand.setAttribute('stroke-width', '1.8');
  minHand.setAttribute('stroke-linecap', 'round');
  svg.appendChild(minHand);

  return svg;
}

function updateClock() {
  const now = new Date();
  DOM.clockTime.textContent = now.toLocaleTimeString('es-CO', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  });

  // Actualizar manecillas SVG (cada segundo para los segundos que no se ven,
  // pero solo las manecillas cada 10s es suficiente. Aquí lo hacemos siempre para
  // precisión del minuto visible)
  const svg = DOM.clockTime.querySelector('.clock-svg');
  if (!svg) return;

  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds();

  const hourAngle = (h / 12) * 360 + (m / 60) * 30;
  const minAngle  = (m / 60) * 360 + (s / 60) * 6;

  const hourHand = svg.querySelector('.hour-hand');
  const minHand  = svg.querySelector('.minute-hand');

  if (hourHand) hourHand.setAttribute('transform', `rotate(${hourAngle}, 21, 21)`);
  if (minHand)  minHand.setAttribute('transform',  `rotate(${minAngle}, 21, 21)`);
}

// ─────────────────────────────────────────────────────────────
// Render principal
// ─────────────────────────────────────────────────────────────
function render() {
  DOM.monthName.textContent = MONTHS[active.getMonth()];
  DOM.yearName.textContent  = String(active.getFullYear());
  renderCalendar();
  renderPanel();
  renderFeatured();
  renderAnnouncements();
  renderPastEvents();
  populateAdminSelectors();
}

function renderCalendar() {
  DOM.grid.innerHTML = '';
  const year  = active.getFullYear();
  const month = active.getMonth();
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Lun = 0
  const start  = new Date(year, month, 1 - offset);

  for (let i = 0; i < 42; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'day';
    if (date.getMonth() !== month) btn.classList.add('outside');
    if (sameDay(date, today))      btn.classList.add('today');
    if (sameDay(date, active))     btn.classList.add('selected');
    btn.innerHTML = `<span class="num">${date.getDate()}</span>`;

    const dayEvents = visibleEventsForDate(date);
    const types = [...new Set(dayEvents.map(e => e.type))];
    if (types.length) {
      const bars = document.createElement('div');
      bars.className = 'bars';
      types.forEach(type => {
        const bar = document.createElement('span');
        bar.className = 'bar';
        bar.style.setProperty('--color', TYPES[type].color);
        bars.appendChild(bar);
      });
      btn.appendChild(bars);
    }

    if (dayEvents.length) {
      const preview = document.createElement('div');
      preview.className = 'day-events-preview';
      dayEvents.slice(0, 2).forEach(event => {
        const mini = document.createElement('button');
        mini.type = 'button';
        mini.className = 'mini-event';
        mini.innerHTML = (event.invitations.main && isImage(event.invitations.main))
          ? `<img src="${event.invitations.main.dataUrl}" alt="">`
          : '';
        mini.innerHTML += `<span>${escapeHtml(event.title)}</span>`;
        mini.onclick = (e) => { e.stopPropagation(); openEventModal(event.id); };
        preview.appendChild(mini);
      });
      btn.appendChild(preview);
    }

    btn.onclick = () => { active = date; render(); };
    DOM.grid.appendChild(btn);
  }
}

function renderPanel() {
  const list      = visibleEventsForDate(active);
  const isToday   = sameDay(active, today);
  const mainEvent = list[0];
  const reflection = dailyReflection(active);

  DOM.badgeWeekday.textContent = isToday ? 'Hoy' : WEEKDAYS[active.getDay()];
  DOM.badgeDay.textContent      = String(active.getDate()).padStart(2, '0');
  DOM.badgeMonth.textContent    = MONTHS[active.getMonth()];

  DOM.selectedTitle.textContent = `${isToday ? 'Hoy, ' : ''}${longDate(active)}`;
  DOM.heroTitle.textContent      = mainEvent ? mainEvent.title : 'Reflexión del día';
  DOM.heroType.textContent       = mainEvent ? TYPES[mainEvent.type].label : 'Unidad';
  DOM.heroTime.textContent       = mainEvent ? mainEvent.time : 'Para meditar';
  DOM.summary.textContent        = buildHeroSummary(list, active, isToday);
  DOM.dailyVerse.textContent     = `${reflection.text} (${reflection.ref})`;

  DOM.eventsBox.innerHTML = '';
  if (!list.length) {
    DOM.eventsBox.innerHTML = `<div class="empty">${escapeHtml(reflection.text)} <em>(${escapeHtml(reflection.ref)})</em></div>`;
    return;
  }

  list.forEach(event => {
    const wrapper = document.createElement('button');
    wrapper.type = 'button';
    wrapper.className = 'event-card-button';
    wrapper.onclick = () => openEventModal(event.id);
    const card = document.createElement('article');
    card.className = 'event';
    card.style.setProperty('--color', TYPES[event.type].color);
    card.innerHTML = `<strong>${escapeHtml(event.title)}</strong><p>${escapeHtml(TYPES[event.type]?.label || event.type)} — ${escapeHtml(event.time)} — ${escapeHtml(event.status)}</p>`;
    wrapper.appendChild(card);
    DOM.eventsBox.appendChild(wrapper);
  });
}

// ─────────────────────────────────────────────────────────────
// Filtros de tags
// ─────────────────────────────────────────────────────────────
function renderTagFilters() {
  DOM.tagFilters.innerHTML = `<button class="tag-button ${activeTags.size ? '' : 'active'}" type="button" data-tag="">Todos</button>`;
  TAGS.forEach(tag => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `tag-button ${activeTags.has(tag) ? 'active' : ''}`;
    btn.dataset.tag = tag;
    btn.textContent = tag;
    DOM.tagFilters.appendChild(btn);
  });

  DOM.tagFilters.querySelectorAll('.tag-button').forEach(btn => {
    btn.onclick = () => {
      const tag = btn.dataset.tag;
      if (!tag) { activeTags.clear(); }
      else if (activeTags.has(tag)) { activeTags.delete(tag); }
      else { activeTags.add(tag); }
      renderTagFilters();
      render();
    };
  });
}

// ─────────────────────────────────────────────────────────────
// Eventos destacados y archivados
// ─────────────────────────────────────────────────────────────
function renderFeatured() {
  const events = allEvents2026()
    .filter(e => e.featured && parseDate(e.date) >= today && eventMatchesTags(e))
    .slice(0, 6);

  DOM.featuredEvents.innerHTML = events.length
    ? ''
    : `<div class="empty">No hay eventos destacados con este filtro.</div>`;

  events.forEach(ev => DOM.featuredEvents.appendChild(eventSummaryCard(ev, 'feature-card')));
}

function renderPastEvents() {
  const events = allEvents2026()
    .filter(e => parseDate(e.date) < today && eventMatchesTags(e))
    .slice(-6)
    .reverse();

  DOM.pastEvents.innerHTML = events.length
    ? ''
    : `<div class="empty">Todavía no hay eventos realizados en este filtro.</div>`;

  events.forEach(ev => DOM.pastEvents.appendChild(eventSummaryCard(ev, 'history-card')));
}

function eventSummaryCard(ev, className) {
  const card = document.createElement('article');
  card.className = className;
  const typeLabel = TYPES[ev.type]?.label || ev.type;
  const image = (ev.invitations.main && isImage(ev.invitations.main))
    ? `<img src="${ev.invitations.main.dataUrl}" alt="">`
    : `<span>${escapeHtml(typeLabel)}</span>`;

  card.innerHTML = `
    <div class="${className === 'feature-card' ? 'feature-media' : 'history-media'}">${image}</div>
    <div class="${className === 'feature-card' ? 'feature-body' : 'history-body'}">
      <h3>${escapeHtml(ev.title)}</h3>
      <p>${escapeHtml(formatDateShort(ev.date))} — ${escapeHtml(ev.time)}<br>${escapeHtml(ev.place)}</p>
      <button class="open-event primary" type="button">Ver evento</button>
    </div>
  `;
  card.querySelector('button').onclick = () => openEventModal(ev.id);
  return card;
}

// ─────────────────────────────────────────────────────────────
// Anuncios
// ─────────────────────────────────────────────────────────────
function renderAnnouncements() {
  const items = APP_STATE.announcements || DEFAULT_ANNOUNCEMENTS;
  DOM.announcementList.innerHTML = items.length
    ? ''
    : `<div class="empty">No hay anuncios publicados.</div>`;

  items.slice().reverse().slice(0, 5).forEach(item => {
    const linked = item.eventId ? eventById(item.eventId) : null;
    const card = document.createElement('article');
    card.className = 'announcement-card';
    card.innerHTML = `
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
      <p>${escapeHtml(formatDateShort(item.date))}${linked ? ` — ${escapeHtml(linked.title)}` : ''}</p>
      ${linked ? '<button class="small-action" type="button">Ver evento</button>' : ''}
    `;
    const btn = card.querySelector('button');
    if (btn) btn.onclick = () => openEventModal(linked.id);
    DOM.announcementList.appendChild(card);
  });
}

// ─────────────────────────────────────────────────────────────
// Música
// ─────────────────────────────────────────────────────────────
function renderMusic() {
  if (APP_STATE.music && APP_STATE.music.dataUrl) {
    DOM.backgroundAudio.src = APP_STATE.music.dataUrl;
    DOM.musicText.textContent = APP_STATE.music.name;
  } else {
    DOM.backgroundAudio.removeAttribute('src');
    DOM.musicText.textContent = 'El administrador puede cargar música autorizada para reproducirla manualmente.';
  }
}

// ─────────────────────────────────────────────────────────────
// Modal de evento
// ─────────────────────────────────────────────────────────────
function openEventModal(id) {
  const ev = eventById(id);
  if (!ev) return;

  DOM.modalTitle.textContent    = ev.title;
  DOM.modalStatus.textContent   = `${ev.status} — ${TYPES[ev.type]?.label || ev.type}`;
  DOM.modalBody.innerHTML       = '';

  // Grid de detalles
  const grid = document.createElement('div');
  grid.className = 'detail-grid';
  [
    ['Fecha',         formatDateShort(ev.date)],
    ['Hora',         ev.time],
    ['Lugar',        ev.place],
    ['Departamento', ev.organizer],
    ['Responsable',  ev.responsible],
    ['Estado',       ev.status],
    ['Tipo',         TYPES[ev.type]?.label || ev.type],
    ['Etiquetas',    ev.tags.join(', ') || 'Sin etiquetas'],
    ['Descripción',  ev.description || 'Sin descripción registrada.', true],
    ['Observaciones',ev.observations || 'Sin observaciones adicionales.', true]
  ].forEach(([label, value, full]) => {
    const item = document.createElement('div');
    item.className = `detail-item ${full ? 'full' : ''}`;
    item.innerHTML = `<span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>`;
    grid.appendChild(item);
  });
  DOM.modalBody.appendChild(grid);

  // Invitaciones
  const invitationAssets = INVITATION_FIELDS
    .map(([key, label]) => ev.invitations[key] ? { ...ev.invitations[key], label } : null)
    .filter(Boolean);
  DOM.modalBody.appendChild(renderAssetSection('Invitaciones del evento', invitationAssets, 'Aún no hay invitaciones subidas para este evento.'));

  // Archivos adjuntos
  DOM.modalBody.appendChild(renderFileSection('Archivos adjuntos', ev.attachments || [], 'Aún no hay documentos adjuntos.'));

  // Galería
  DOM.modalBody.appendChild(renderAssetSection('Galería del evento', ev.gallery || [], 'La galería se puede llenar después de realizado el evento.'));

  DOM.eventModal.classList.add('open');
}

function renderAssetSection(title, assets, emptyText) {
  const section = document.createElement('section');
  section.className = 'asset-section';
  const heading = document.createElement('h3');
  heading.textContent = title;
  section.appendChild(heading);

  if (!assets.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = emptyText;
    section.appendChild(empty);
    return section;
  }

  const grid = document.createElement('div');
  grid.className = 'asset-grid';
  assets.forEach(asset => {
    const card = document.createElement('article');
    card.className = 'asset-card';

    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'asset-thumb';
    thumb.onclick = () => openMedia(asset);

    if (isImage(asset)) {
      const img = document.createElement('img');
      img.src = asset.dataUrl;
      img.alt = asset.label || asset.name;
      thumb.appendChild(img);
    } else if (isVideo(asset)) {
      const video = document.createElement('video');
      video.src = asset.dataUrl;
      video.muted = true;
      video.playsInline = true;
      thumb.appendChild(video);
    } else {
      thumb.textContent = assetTypeLabel(asset);
    }

    const footer = document.createElement('footer');
    const name = document.createElement('strong');
    name.textContent = asset.label || asset.name;
    const meta = document.createElement('span');
    meta.className = 'asset-name';
    meta.textContent = asset.name;
    const actions = document.createElement('div');
    actions.className = 'asset-actions';
    actions.appendChild(actionButton('Ver',       () => openMedia(asset)));
    actions.appendChild(actionButton('Descargar', () => downloadAsset(asset)));
    footer.append(name, meta, actions);
    card.append(thumb, footer);
    grid.appendChild(card);
  });

  section.appendChild(grid);
  return section;
}

function renderFileSection(title, files, emptyText) {
  const section = document.createElement('section');
  section.className = 'asset-section';
  const heading = document.createElement('h3');
  heading.textContent = title;
  section.appendChild(heading);

  if (!files.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = emptyText;
    section.appendChild(empty);
    return section;
  }

  const list = document.createElement('div');
  list.className = 'file-list';
  files.forEach(file => {
    const row = document.createElement('article');
    row.className = 'file-row';
    const info = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = file.name;
    const meta = document.createElement('span');
    meta.className = 'file-meta';
    meta.textContent = `${assetTypeLabel(file)} — ${humanFileSize(file.size)} — Subido ${formatDateShort(file.uploadedAt)}`;
    info.append(name, meta);
    const actions = document.createElement('div');
    actions.className = 'asset-actions';
    actions.appendChild(actionButton('Ver',       () => openMedia(file)));
    actions.appendChild(actionButton('Descargar', () => downloadAsset(file)));
    row.append(info, actions);
    list.appendChild(row);
  });
  section.appendChild(list);
  return section;
}

// ─────────────────────────────────────────────────────────────
// Modal de media
// ─────────────────────────────────────────────────────────────
function openMedia(asset) {
  DOM.mediaTitle.textContent = asset.label || asset.name;
  DOM.mediaBody.innerHTML = '';

  if (isImage(asset)) {
    const img = document.createElement('img');
    img.className = 'media-preview';
    img.src = asset.dataUrl;
    img.alt = asset.label || asset.name;
    DOM.mediaBody.appendChild(img);
  } else if (isVideo(asset)) {
    const video = document.createElement('video');
    video.className = 'media-preview';
    video.src = asset.dataUrl;
    video.controls = true;
    DOM.mediaBody.appendChild(video);
  } else if (isAudio(asset)) {
    const audio = document.createElement('audio');
    audio.className = 'media-preview';
    audio.src = asset.dataUrl;
    audio.controls = true;
    DOM.mediaBody.appendChild(audio);
  } else if (isPdf(asset)) {
    const frame = document.createElement('iframe');
    frame.className = 'media-preview';
    frame.src = asset.dataUrl;
    DOM.mediaBody.appendChild(frame);
  } else {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'Este archivo no tiene vista previa directa en el navegador, pero se puede descargar.';
    DOM.mediaBody.appendChild(empty);
  }

  const actions = document.createElement('div');
  actions.className = 'media-actions';
  actions.style.marginTop = '12px';
  actions.appendChild(actionButton('Descargar', () => downloadAsset(asset), true));
  DOM.mediaBody.appendChild(actions);

  DOM.mediaModal.classList.add('open');
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('open');
  if (modal === DOM.mediaModal) DOM.mediaBody.innerHTML = '';
}

// ─────────────────────────────────────────────────────────────
// Admin: selector, tags, carga/save/eliminar
// ─────────────────────────────────────────────────────────────
function populateAdminSelectors() {
  const prevEvent   = DOM.adminEventSelect.value || '__new__';
  const prevAnnonce = DOM.announcementEvent.value || '';

  DOM.adminEventSelect.innerHTML = `<option value="__new__">Crear evento nuevo</option>`;
  allEvents2026().forEach(ev => {
    const opt = document.createElement('option');
    opt.value = ev.id;
    opt.textContent = `${formatDateShort(ev.date)} — ${ev.title}`;
    DOM.adminEventSelect.appendChild(opt);
  });
  DOM.adminEventSelect.value = [...DOM.adminEventSelect.options]
    .some(o => o.value === prevEvent) ? prevEvent : '__new__';

  DOM.announcementEvent.innerHTML = `<option value="">Sin evento relacionado</option>`;
  allEvents2026().forEach(ev => {
    const opt = document.createElement('option');
    opt.value = ev.id;
    opt.textContent = `${formatDateShort(ev.date)} — ${ev.title}`;
    DOM.announcementEvent.appendChild(opt);
  });
  DOM.announcementEvent.value = [...DOM.announcementEvent.options]
    .some(o => o.value === prevAnnonce) ? prevAnnonce : '';
}

function renderAdminTagChecks() {
  const box = $('adminTags');
  if (!box) return;
  box.innerHTML = '';
  TAGS.forEach(tag => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = tag;
    input.id = `tag-${tag}`;
    const text = document.createTextNode(' ' + tag);
    label.append(input, text);
    box.appendChild(label);
  });

  // Restaurar tags del evento cargado
  const ev = DOM.adminEventSelect.value !== '__new__'
    ? eventById(DOM.adminEventSelect.value) : null;
  if (ev) {
    box.querySelectorAll('input').forEach(inp => {
      inp.checked = Boolean(ev.tags?.includes(inp.value));
    });
  }
}

function loadAdminEvent(id) {
  const ev = id && id !== '__new__' ? eventById(id) : null;
  DOM.adminTitle.value       = ev?.title || '';
  DOM.adminDate.value        = ev?.date || dateKey(active);
  DOM.adminTime.value        = ev?.time || '7:00 p. m.';
  DOM.adminType.value        = ev?.type || 'culto';
  DOM.adminStatus.value      = ev?.status || 'Pendiente';
  DOM.adminPlace.value       = ev?.place || 'IPUC Villa del Río';
  DOM.adminOrganizer.value   = ev?.organizer || '';
  DOM.adminResponsible.value = ev?.responsible || '';
  DOM.adminFeatured.checked  = Boolean(ev?.featured);
  DOM.adminDescription.value = ev?.description || '';
  DOM.adminObservations.value= ev?.observations || '';

  // Tags
  document.querySelectorAll('#adminTags input').forEach(input => {
    input.checked = Boolean(ev?.tags?.includes(input.value));
  });

  // Reset inputs de archivo
  clearUploadInputs();

  // Actualizar selector de etiquetas visualmente
  renderAdminTagChecks();
}

async function saveAdminEvent() {
  const btn = DOM.saveEventButton;
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Guardando...';

  try {
    const selected = DOM.adminEventSelect.value;
    const title = DOM.adminTitle.value.trim();
    const date  = DOM.adminDate.value;

    if (!title || !date) {
      showToast('Escribe al menos el nombre y la fecha del evento', 'error');
      return;
    }

    const base = selected && selected !== '__new__' ? eventById(selected) : null;
    const id = base ? selected : eventIdFor({ date, title });

    // Invitaciones con preview (ya manejado por setupFilePreviews)
    const invitations = { ...(base?.invitations || {}) };
    const invitationInputs = {
      main:     'adminInviteMain',
      whatsapp: 'adminInviteWhatsapp',
      story:    'adminInviteStory',
      banner:   'adminInviteBanner',
      video:    'adminInviteVideo'
    };
    for (const [key, label] of INVITATION_FIELDS) {
      const file = $(invitationInputs[key]).files[0];
      if (file) invitations[key] = await fileToAsset(file, label);
    }

    const attachments = [...(base?.attachments || [])];
    for (const file of DOM.adminAttacments.files) {
      attachments.push(await fileToAsset(file, 'Archivo adjunto'));
    }

    const gallery = [...(base?.gallery || [])];
    for (const file of DOM.adminGallery.files) {
      gallery.push(await fileToAsset(file, 'Galería'));
    }

    APP_STATE.events[id] = {
      ...(APP_STATE.events[id] || {}),
      id,
      custom: !base || Boolean(base.custom),
      deleted: false,
      title,
      date,
      time: DOM.adminTime.value.trim() || '7:00 p. m.',
      type: DOM.adminType.value,
      place: DOM.adminPlace.value.trim() || 'IPUC Villa del Río',
      organizer: DOM.adminOrganizer.value.trim() || 'IPUC Villa del Río',
      responsible: DOM.adminResponsible.value.trim() || 'Por definir',
      description: DOM.adminDescription.value.trim(),
      status: DOM.adminStatus.value,
      observations: DOM.adminObservations.value.trim(),
      featured: DOM.adminFeatured.checked,
      tags: selectedAdminTags().length
        ? selectedAdminTags()
        : inferTags(title, DOM.adminType.value),
      invitations,
      attachments,
      gallery
    };

    active = parseDate(date);
    saveState();                          // ← Persiste en localStorage
    renderTagFilters();
    render();
    DOM.adminEventSelect.value = id;
    loadAdminEvent(id);
    showToast('Evento guardado exitosamente', 'success');
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

function deleteAdminEvent() {
  const id = DOM.adminEventSelect.value;
  if (!id || id === '__new__') {
    loadAdminEvent('__new__');
    return;
  }
  if (!confirm('Este evento se ocultará del calendario en este navegador. ¿Continuar?')) return;

  const ev = eventById(id);
  APP_STATE.events[id] = {
    ...(ev || {}),
    ...(APP_STATE.events[id] || {}),
    id,
    deleted: true,
    custom: Boolean(ev?.custom || APP_STATE.events[id]?.custom)
  };
  saveState();
  render();
  DOM.adminEventSelect.value = '__new__';
  loadAdminEvent('__new__');
  showToast('Evento ocultado', 'success');
}

function saveAnnouncement() {
  const title       = DOM.announcementEvent.title?.value?.trim() || $('announcementTitle')?.value?.trim() || '';
  // using the correct element:
  const titleEl     = document.querySelector('#announcementTitle');
  const descEl      = document.querySelector('#announcementDescription');
  const titleVal    = titleEl ? titleEl.value.trim() : '';
  const descVal     = descEl ? descEl.value.trim() : '';
  const eventId     = DOM.announcementEvent.value;

  if (!titleVal || !descVal) {
    showToast('Escribe título y descripción del anuncio', 'error');
    return;
  }

  APP_STATE.announcements = APP_STATE.announcements || [];
  APP_STATE.announcements.push({
    id: `anuncio-${Date.now()}`,
    title: titleVal,
    description: descVal,
    date: dateKey(today),
    eventId
  });
  saveState();
  if (titleEl) titleEl.value = '';
  if (descEl) descEl.value = '';
  DOM.announcementEvent.value = '';
  renderAnnouncements();
  showToast('Anuncio publicado', 'success');
}

function selectedAdminTags() {
  return [...document.querySelectorAll('#adminTags input:checked')].map(inp => inp.value);
}

function clearUploadInputs() {
  ['adminInviteMain','adminInviteWhatsapp','adminInviteStory','adminInviteBanner','adminInviteVideo','adminAttacments','adminGallery']
    .forEach(id => { const el = $(id); if (el) el.value = ''; });
}

// ─────────────────────────────────────────────────────────────
// Preview de archivos seleccionados (nueva función)
// ─────────────────────────────────────────────────────────────
function setupFilePreviews() {
  // Para cada input de archivo, mostrar preview cuando se selecciona
  const fileInputs = [
    { id: 'adminInviteMain',     container: 'adminInviteMain',     type: 'image' },
    { id: 'adminInviteWhatsapp', container: 'adminInviteWhatsapp', type: 'image' },
    { id: 'adminInviteStory',    container: 'adminInviteStory',    type: 'image' },
    { id: 'adminInviteBanner',   container: 'adminInviteBanner',   type: 'image' },
    { id: 'adminInviteVideo',    container: 'adminInviteVideo',    type: 'video' },
    { id: 'adminAttacments',     container: 'adminAttacments',     type: 'file' },
    { id: 'adminGallery',        container: 'adminGallery',        type: 'file' },
    { id: 'adminMusic',          container: 'adminMusic',          type: 'audio' }
  ];

  fileInputs.forEach(({ id, type }) => {
    const input = $(id);
    if (!input) return;

    input.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;

      // Buscar contenedor de preview (si existe)
      const previewId = `${id}Preview`;
      const previewEl = $(previewId);
      if (previewEl) {
        // Actualizar o crear preview
        updateFilePreview(previewEl, file, type);
      }

      // Si no hay preview nativo, creamos uno dinámicamente al lado del input
      // Esto es opcional — implementado por el HTML si se agrega un div#idPreview
    });

    // Si ya hay un archivo (ej. al cargar el admin), intentar preview
    if (input.files[0]) {
      const previewId = `${id}Preview`;
      const previewEl = $(previewId);
      if (previewEl) {
        updateFilePreview(previewEl, input.files[0], type);
      }
    }
  });
}

function updateFilePreview(container, file, type) {
  container.innerHTML = '';
  if (type === 'image') {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.alt = file.name;
    img.className = 'file-preview-img';
    container.appendChild(img);
    const name = document.createElement('span');
    name.className = 'file-preview-name';
    name.textContent = file.name;
    container.appendChild(name);
  } else if (type === 'video') {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.controls = true;
    video.className = 'file-preview-video';
    container.appendChild(video);
    const name = document.createElement('span');
    name.className = 'file-preview-name';
    name.textContent = file.name;
    container.appendChild(name);
  } else if (type === 'audio') {
    const audio = document.createElement('audio');
    audio.src = URL.createObjectURL(file);
    audio.controls = true;
    audio.className = 'file-preview-audio';
    container.appendChild(audio);
    const name = document.createElement('span');
    name.className = 'file-preview-name';
    name.textContent = file.name;
    container.appendChild(name);
  } else {
    const name = document.createElement('span');
    name.className = 'file-preview-name';
    name.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    container.appendChild(name);
  }
}

// ─────────────────────────────────────────────────────────────
// Toast (reemplazo de alert)
// ─────────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const container = $('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  // Auto-eliminar después de 3 segundos
  setTimeout(() => {
    if (toast.parentNode) toast.remove();
  }, 3000);
}

// ─────────────────────────────────────────────────────────────
// Calendario .ics (corregido para el año actual)
// ─────────────────────────────────────────────────────────────
function addAllEventsToCalendar() {
  const year = today.getFullYear();
  const events = eventsForYear(year).sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);
    return byDate || a.title.localeCompare(b.title);
  });
  downloadEventsCalendar(events, `cronograma-ipuc-villa-del-rio-${year}.ics`);
}

// ─────────────────────────────────────────────────────────────
// Funciones auxiliares (mantenidas de la versión original)
// ─────────────────────────────────────────────────────────────

function closestEvent(type) {
  const key = dateKey(active);
  const list = eventsForYear(active.getFullYear())
    .filter(e => e.type === type)
    .sort((a, b) => a.date.localeCompare(b.date));
  return list.find(e => e.date >= key) || list[0];
}

function findOpeningDate(date) {
  if (eventsFor(date).length) return new Date(date);
  const key = dateKey(date);
  const upcoming = eventsForYear(date.getFullYear())
    .filter(e => e.date >= key)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  return upcoming ? parseDate(upcoming.date) : new Date(date);
}

function eventsFor(date) {
  const key = dateKey(date);
  return eventsForYear(date.getFullYear()).filter(e => e.date === key);
}

function eventsForYear(year) {
  const generated = [];
  const programmedCultoDates = new Set(
    PROGRAMMED_EVENTS.filter(e => e.type === 'culto').map(e => e.date)
  );
  const date = new Date(year, 0, 1);
  while (date.getFullYear() === year) {
    const key = dateKey(date);
    if (date.getDay() === 0 && !programmedCultoDates.has(key)) {
      generated.push({ date: key, type: 'culto', title: 'Culto dominical', time: '10:00 a. m.' });
    }
    if (date.getDay() === 4 && !programmedCultoDates.has(key)) {
      generated.push({ date: key, type: 'culto', title: 'Culto de oración y enseñanza', time: '7:00 p. m.' });
    }
    date.setDate(date.getDate() + 1);
  }

  const customEvents = Object.values(APP_STATE.events || {})
    .filter(e => e.custom && e.date && parseDate(e.date).getFullYear() === year);

  return mergeEvents([...generated, ...PROGRAMMED_EVENTS], customEvents)
    .map(enrichEvent)
    .filter(e => !e.deleted);
}

function mergeEvents(base, special) {
  const bySignature = new Map();
  [...base, ...special].forEach(e => {
    bySignature.set(`${e.date}|${e.title}`, e);
  });
  return [...bySignature.values()];
}

function eventIdFor(event) {
  return `${event.date}-${slugify(event.title)}`;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function enrichEvent(event) {
  const id = event.id || eventIdFor(event);
  const saved = (APP_STATE.events || {})[id] || {};
  const base = {
    id,
    title: event.title,
    date: event.date,
    time: event.time || '7:00 p. m.',
    type: event.type || 'culto',
    place: 'IPUC Villa del Río',
    organizer: inferOrganizer(event.title),
    responsible: 'Por definir',
    description: 'Actividad programada dentro del cronograma anual de IPUC Villa del Río.',
    status: inferStatus(event.date),
    observations: '',
    featured: isDefaultFeatured(event),
    tags: inferTags(event.title, event.type),
    invitations: {},
    attachments: [],
    gallery: [],
    custom: Boolean(event.custom),
    deleted: false
  };

  return {
    ...base,
    ...saved,
    id,
    invitations: { ...base.invitations, ...(saved.invitations || {}) },
    attachments: saved.attachments || base.attachments,
    gallery: saved.gallery || base.gallery,
    tags: saved.tags || base.tags
  };
}

function inferStatus(date) {
  return parseDate(date) < today ? 'Finalizado' : 'Confirmado';
}

function inferOrganizer(title) {
  const lower = title.toLowerCase();
  if (lower.includes('dorcas') || lower.includes('damas'))    return 'Damas Dorcas';
  if (lower.includes('joven'))                               return 'Jóvenes';
  if (lower.includes('caballero'))                           return 'Caballeros';
  if (lower.includes('escuela'))                             return 'Escuela Dominical';
  if (lower.includes('evangelismo'))                         return 'Evangelismo';
  if (lower.includes('alabanza'))                            return 'Música';
  if (lower.includes('misiones'))                            return 'Misiones';
  if (lower.includes('red de familia'))                      return 'Red de Familia';
  if (lower.includes('obra social'))                         return 'Obra Social';
  if (lower.includes('edad dorada'))                         return 'Edad Dorada';
  return 'IPUC Villa del Río';
}

function inferTags(title, type) {
  const lower = title.toLowerCase();
  const tags = [];
  if (lower.includes('joven'))                          tags.push('Jóvenes');
  if (lower.includes('dorcas') || lower.includes('damas')) tags.push('Damas');
  if (lower.includes('caballero'))                     tags.push('Caballeros');
  if (lower.includes('escuela'))                       tags.push('Escuela Dominical');
  if (lower.includes('evangelismo'))                   tags.push('Evangelismo');
  if (lower.includes('alabanza'))                      tags.push('Música');
  if (lower.includes('multimedia'))                    tags.push('Multimedia');
  if (lower.includes('distrital'))                     tags.push('Distrital');
  if (lower.includes('nacional'))                      tags.push('Nacional');
  if (type === 'vigilia' || type === 'ayuno' || lower.includes('especial')) tags.push('Especial');
  return tags.length ? [...new Set(tags)] : ['Pastoral'];
}

function isDefaultFeatured(event) {
  return ['vigilia', 'ayuno', 'especial'].includes(event.type);
}

function eventMatchesTags(event) {
  if (!activeTags.size) return true;
  return event.tags.some(t => activeTags.has(t));
}

function visibleEventsForDate(date) {
  return eventsFor(date).filter(eventMatchesTags);
}

function allEvents2026() {
  return eventsForYear(2026).sort((a, b) =>
    a.date.localeCompare(b.date) || a.title.localeCompare(b.title)
  );
}

function eventById(id) {
  return allEvents2026().find(e => e.id === id);
}

// ─────────────────────────────────────────────────────────────
// Reflexión diaria
// ─────────────────────────────────────────────────────────────
function dailyReflection(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayNumber = Math.floor((date - start) / 86400000);
  return DAILY_REFLECTIONS[dayNumber % DAILY_REFLECTIONS.length];
}

// ─────────────────────────────────────────────────────────────
// Resumen del hero
// ─────────────────────────────────────────────────────────────
function buildHeroSummary(list, date, isToday) {
  const reflection = dailyReflection(date);
  if (!list.length) {
    return `${reflection.text} (${reflection.ref})`;
  }
  const names = list.map(e => e.title);
  const extra = names.length > 1
    ? ` También hay: ${names.slice(1).join(', ')}.`
    : '';
  return `${isToday ? 'Hoy' : 'Este día'} hay ${list.length} evento${list.length > 1 ? 's' : ''} programado${list.length > 1 ? 's' : ''}.${extra}`;
}

// ─────────────────────────────────────────────────────────────
// Formateo de fechas
// ─────────────────────────────────────────────────────────────
function formatDateShort(key) {
  if (!key) return 'Fecha por confirmar';
  const date = parseDate(key);
  if (Number.isNaN(date.getTime())) return key;
  return `${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
}

function longDate(date) {
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
}

// ─────────────────────────────────────────────────────────────
// Escape HTML
// ─────────────────────────────────────────────────────────────
function escapeHtml(value) {
  const span = document.createElement('span');
  span.textContent = value ?? '';
  return span.innerHTML;
}

// ─────────────────────────────────────────────────────────────
// File to asset (FileReader → dataURL)
// ─────────────────────────────────────────────────────────────
function fileToAsset(file, label) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({
      id: `asset-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      label,
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
      uploadedAt: dateKey(new Date()),
      dataUrl: reader.result
    });
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// ─────────────────────────────────────────────────────────────
// Botón de acción (para modales)
// ─────────────────────────────────────────────────────────────
function actionButton(label, handler, primary = false) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `small-action ${primary ? 'primary' : ''}`;
  btn.textContent = label;
  btn.onclick = handler;
  return btn;
}

// ─────────────────────────────────────────────────────────────
// Descargar asset
// ─────────────────────────────────────────────────────────────
function downloadAsset(asset) {
  const source = assetSource(asset);
  if (!source) return showToast('Este archivo no tiene URL disponible', 'error');
  const link = document.createElement('a');
  link.href = source;
  link.download = asset.name || 'archivo';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function assetSource(asset) {
  return asset?.url || asset?.dataUrl || '';
}

// ─────────────────────────────────────────────────────────────
// Type detectors
// ─────────────────────────────────────────────────────────────
function isImage(asset) { return asset.type && asset.type.startsWith('image/'); }
function isVideo(asset) { return asset.type && asset.type.startsWith('video/'); }
function isAudio(asset) { return asset.type && asset.type.startsWith('audio/'); }
function isPdf(asset)   { return asset.type === 'application/pdf' || (asset.name && asset.name.toLowerCase().endsWith('.pdf')); }

function assetTypeLabel(asset) {
  if (isImage(asset)) return 'Imagen';
  if (isVideo(asset)) return 'Video';
  if (isAudio(asset)) return 'Audio';
  if (isPdf(asset))   return 'PDF';
  return asset.type || 'Archivo';
}

function humanFileSize(size = 0) {
  if (!size) return 'tamaño no disponible';
  if (size < 1024)           return `${size} B`;
  if (size < 1024 * 1024)    return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

// ─────────────────────────────────────────────────────────────
// Fecha helpers
// ─────────────────────────────────────────────────────────────
function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function cleanDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a, b) {
  return dateKey(a) === dateKey(b);
}

// ─────────────────────────────────────────────────────────────
// ICS Calendar Builder
// ─────────────────────────────────────────────────────────────
function buildIcs(events) {
  const stamp = formatUtcIcsDate(new Date());
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//IPUC Villa del Río//Cronograma Anual//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Cronograma IPUC Villa del Río',
    'X-WR-TIMEZONE:America/Bogota'
  ];

  events.forEach((ev, i) => {
    const start = eventStartDate(ev);
    const end   = new Date(start.getTime() + eventDurationHours(ev) * 60 * 60 * 1000);
    lines.push(
      'BEGIN:VEVENT',
      `UID:${ev.date}-${slugify(ev.title)}-${i}@ipuc-villa-del-rio`,
      `DTSTAMP:${stamp}`,
      `DTSTART;TZID=America/Bogota:${formatLocalIcsDate(start)}`,
      `DTEND;TZID=America/Bogota:${formatLocalIcsDate(end)}`,
      `SUMMARY:${escapeIcs(ev.title)}`,
      `DESCRIPTION:${escapeIcs(`${TYPES[ev.type]?.label || ev.type} - ${ev.time}`)}`,
      `LOCATION:${escapeIcs(ev.place || 'IPUC Villa del Río')}`,
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}

function eventStartDate(ev) {
  const date = parseDate(ev.date);
  const time = parseTime(ev.time);
  date.setHours(time.hours, time.minutes, 0, 0);
  return date;
}

function parseTime(time) {
  const match = time.match(/(\d{1,2}):(\d{2})\s*([ap])\.\s*m\./i);
  if (!match) return { hours: 19, minutes: 0 };
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toLowerCase();
  if (period === 'p' && hours < 12) hours += 12;
  if (period === 'a' && hours === 12) hours = 0;
  return { hours, minutes };
}

function eventDurationHours(ev) {
  if (ev.type === 'vigilia') return 5;
  if (ev.type === 'ayuno')   return 4;
  return 2;
}

function formatLocalIcsDate(date) {
  return `${date.getFullYear()}${pad2(date.getMonth()+1)}${pad2(date.getDate())}T${pad2(date.getHours())}${pad2(date.getMinutes())}00`;
}

function formatUtcIcsDate(date) {
  return `${date.getUTCFullYear()}${pad2(date.getUTCMonth()+1)}${pad2(date.getUTCDate())}T${pad2(date.getUTCHours())}${pad2(date.getUTCMinutes())}${pad2(date.getUTCSeconds())}Z`;
}

function escapeIcs(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function downloadEventsCalendar(events, filename) {
  const ics = buildIcs(events);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'cronograma-ipuc-villa-del-rio.ics';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(`Calendario ${filename} descargado`, 'success');
}

// ─────────────────────────────────────────────────────────────
// Iniciar
// ─────────────────────────────────────────────────────────────
init();
