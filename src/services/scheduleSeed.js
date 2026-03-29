const YEAR = 2026;

const monthMap = {
  marzo: 2,
  abril: 3,
  mayo: 4,
  junio: 5,
  julio: 6,
  agosto: 7,
  septiembre: 8,
  octubre: 9,
  noviembre: 10,
  diciembre: 11,
};

const rawSchedule = {
  marzo: [
    ['1', 'AYUNO', 'Todos los comités'],
    ['3', 'CULTO', 'Dorcas'],
    ['7', 'CULTO', 'Jóvenes'],
    ['9', 'ORACIÓN', 'Escuela Dominical, Caballeros, Alabanza'],
    ['10', 'CULTO', 'Caballeros'],
    ['12', 'CULTO', 'Evangelismo'],
    ['14', 'CULTO', 'Escuela Dominical'],
    ['17', 'CULTO', 'Dorcas'],
    ['21', 'CULTO', 'Jóvenes'],
    ['24', 'CULTO', 'Obra Social'],
    ['26', 'CULTO', 'Evangelismo'],
    ['28', 'CULTO', 'Red de Familia'],
    ['29', 'CULTO', 'Misiones'],
    ['31', 'CULTO', 'Edad Dorada'],
  ],
  abril: [
    ['4', 'CULTO', 'Jóvenes'], ['6', 'ORACIÓN', 'Edad dorada, Evangelismo, Red de familia'],
    ['7', 'CULTO', 'Dorcas'], ['9', 'CULTO', 'Evangelismo'], ['11', 'CULTO', 'Escuela Dominical'],
    ['14', 'CULTO', 'Caballeros'], ['17', 'VIGILIA', 'Evangelismo, Red de familia, Edad dorada'],
    ['18', 'CULTO', 'Jóvenes'], ['21', 'CULTO', 'Dorcas'], ['23', 'CULTO', 'Evangelismo'],
    ['25', 'CULTO', 'Red de Familia'], ['26', 'CULTO', 'Misiones'], ['28', 'CULTO', 'Obra Social'],
  ],
  mayo: [
    ['2', 'CULTO', 'Jóvenes'], ['3', 'AYUNO', 'Obra social, Misiones, Recepción'], ['5', 'CULTO', 'Dorcas'],
    ['9', 'CULTO', 'Escuela Dominical'], ['11', 'ORACIÓN', 'Obra social, Misiones, Recepción'],
    ['12', 'CULTO', 'Caballeros'], ['14', 'CULTO', 'Evangelismo'], ['16', 'CULTO', 'Jóvenes'],
    ['19', 'CULTO', 'Dorcas'], ['23', 'CULTO', 'Red de Familia'], ['26', 'CULTO', 'Obra Social'],
    ['28', 'CULTO', 'Evangelismo'], ['30', 'CULTO', 'Alabanza'], ['31', 'CULTO', 'Misiones'],
  ],
  junio: [
    ['1', 'ORACIÓN', 'Junta local, Dorcas, Jóvenes'], ['2', 'CULTO', 'Dorcas'], ['6', 'CULTO', 'Jóvenes'],
    ['9', 'CULTO', 'Caballeros'], ['11', 'CULTO', 'Evangelismo'], ['13', 'CULTO', 'Jóvenes / Escuela Dominical'],
    ['16', 'CULTO', 'Dorcas'], ['19', 'VIGILIA', 'Escuela dominical, Caballeros, Alabanza'],
    ['23', 'CULTO', 'Obra Social'], ['25', 'CULTO', 'Evangelismo'], ['27', 'CULTO', 'Red de Familia'],
    ['28', 'CULTO', 'Misiones'], ['30', 'CULTO', 'Edad dorada'],
  ],
  julio: [
    ['4', 'CULTO', 'Jóvenes'], ['5', 'AYUNO', 'Edad dorada, Evangelismo, Red de familias'],
    ['7', 'CULTO', 'Dorcas'], ['9', 'CULTO', 'Evangelismo'], ['11', 'CULTO', 'Escuela Dominical'],
    ['13', 'ORACIÓN', 'Escuela dominical, Caballeros, Alabanza'], ['14', 'CULTO', 'Caballeros'],
    ['18', 'CULTO', 'Jóvenes'], ['21', 'CULTO', 'Dorcas'], ['23', 'CULTO', 'Evangelismo'],
    ['25', 'CULTO', 'Red de Familia'], ['26', 'CULTO', 'Misiones'], ['28', 'CULTO', 'Obra Social'],
  ],
  agosto: [
    ['1', 'CULTO', 'Jóvenes'], ['4', 'CULTO', 'Dorcas'], ['8', 'CULTO', 'Escuela Dominical'],
    ['10', 'ORACIÓN', 'Edad dorada, Evangelismo, Red de familia'], ['11', 'CULTO', 'Caballeros'],
    ['13', 'CULTO', 'Evangelismo'], ['15', 'CULTO', 'Jóvenes'], ['18', 'CULTO', 'Dorcas'],
    ['21', 'VIGILIA', 'Obra social, Misiones, Recepción'], ['22', 'CULTO', 'Red de Familia'],
    ['25', 'CULTO', 'Obra Social'], ['27', 'CULTO', 'Evangelismo'], ['29', 'CULTO', 'Alabanza'],
    ['30', 'CULTO', 'Misiones'],
  ],
  septiembre: [
    ['1', 'CULTO', 'Dorcas'], ['5', 'CULTO', 'Jóvenes'], ['6', 'AYUNO', 'Escuela dominical, Caballeros, Alabanza'],
    ['8', 'CULTO', 'Caballeros'], ['10', 'CULTO', 'Evangelismo'], ['12', 'CULTO', 'Escuela Dominical'],
    ['14', 'ORACIÓN', 'Obra social, Misiones, Recepción'], ['15', 'CULTO', 'Dorcas'], ['19', 'CULTO', 'Jóvenes'],
    ['22', 'CULTO', 'Obra Social'], ['24', 'CULTO', 'Evangelismo'], ['26', 'CULTO', 'Red de Familia'],
    ['27', 'CULTO', 'Misiones'], ['29', 'CULTO', 'Edad dorada'],
  ],
  octubre: [
    ['3', 'CULTO', 'Jóvenes'], ['5', 'ORACIÓN', 'Junta local, Dorcas, Jóvenes'], ['6', 'CULTO', 'Dorcas'],
    ['8', 'CULTO', 'Evangelismo'], ['10', 'CULTO', 'Escuela Dominical'], ['13', 'CULTO', 'Caballeros'],
    ['17', 'CULTO', 'Jóvenes'], ['20', 'CULTO', 'Dorcas'], ['22', 'CULTO', 'Evangelismo'],
    ['23', 'VIGILIA', 'Junta local, Dorcas, Jóvenes'], ['24', 'CULTO', 'Red de Familia'],
    ['25', 'CULTO', 'Misiones'], ['27', 'CULTO', 'Obra Social'], ['31', 'CULTO', 'Alabanza'],
  ],
  noviembre: [
    ['1', 'AYUNO', 'Junta local, Dorcas, Jóvenes'], ['3', 'CULTO', 'Dorcas'], ['7', 'CULTO', 'Jóvenes'],
    ['9', 'ORACIÓN', 'Escuela dominical, Caballeros, Alabanza'], ['10', 'CULTO', 'Caballeros'],
    ['12', 'CULTO', 'Evangelismo'], ['14', 'CULTO', 'Escuela Dominical'], ['17', 'CULTO', 'Dorcas'],
    ['21', 'CULTO', 'Jóvenes'], ['24', 'CULTO', 'Obra Social'], ['26', 'CULTO', 'Evangelismo'],
    ['28', 'CULTO', 'Red de Familia'], ['29', 'CULTO', 'Misiones'],
  ],
  diciembre: [
    ['1', 'CULTO', 'Dorcas'], ['5', 'CULTO', 'Jóvenes'], ['7', 'ORACIÓN', 'Edad dorada, Evangelismo, Red de familia'],
    ['8', 'CULTO', 'Caballeros'], ['10', 'CULTO', 'Evangelismo'], ['12', 'CULTO', 'Escuela Dominical'],
    ['15', 'CULTO', 'Dorcas'], ['18', 'VIGILIA', 'Evangelismo, Red de familias, Edad dorada'],
    ['19', 'CULTO', 'Jóvenes'], ['22', 'CULTO', 'Obra Social'], ['24', 'CULTO', 'Evangelismo'],
    ['26', 'CULTO', 'Red de Familia'], ['27', 'CULTO', 'Misiones'], ['29', 'CULTO', 'Edad dorada'],
  ],
};

const monthLabelFormatter = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' });

const getCoverByType = (type) => {
  if (type === 'VIGILIA') return 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=1200&q=80';
  if (type === 'AYUNO') return 'https://images.unsplash.com/photo-1452802447250-470a88ac82bc?auto=format&fit=crop&w=1200&q=80';
  if (type === 'ORACIÓN') return 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80';
  return 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80';
};

export const annualSchedule = Object.entries(rawSchedule).flatMap(([monthName, rows]) => {
  const monthIndex = monthMap[monthName];
  return rows.map(([day, activityType, committee], index) => {
    const dateValue = new Date(YEAR, monthIndex, Number(day), 19, 0, 0, 0);
    return {
      id: `seed-${monthName}-${day}-${index}`,
      day: Number(day),
      monthName,
      monthKey: `${YEAR}-${String(monthIndex + 1).padStart(2, '0')}`,
      monthLabel: monthLabelFormatter.format(dateValue),
      dateValue,
      activityType,
      committee,
      title: `${activityType} · ${committee}`,
      type: activityType,
      description: `${activityType} programado con responsabilidad de ${committee}.`,
      coverImage: getCoverByType(activityType),
      invitationLink: '',
      invitationType: 'link',
    };
  });
});

export const buildSeedSchedules = () => {
  const grouped = annualSchedule.reduce((acc, item) => {
    if (!acc[item.monthKey]) {
      acc[item.monthKey] = {
        id: `schedule-${item.monthKey}`,
        monthKey: item.monthKey,
        monthLabel: item.monthLabel.charAt(0).toUpperCase() + item.monthLabel.slice(1),
        fileUrl: `cronograma://${item.monthKey}`,
      };
    }
    return acc;
  }, {});
  return Object.values(grouped);
};
