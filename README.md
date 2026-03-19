# Programacionipuc

Aplicación full stack para gestionar y visualizar el cronograma semanal de **IPUC Villa del Río**.

## Stack

- **Frontend:** React + Vite + TailwindCSS + Framer Motion
- **Backend:** Node.js + Express
- **Persistencia:** JSON local (`server/data/db.json`) con estructura lista para migrar a MongoDB/Firebase
- **Extras:** html2canvas, subida de archivos con Multer, importación Excel con xlsx

## Requisitos

- Node.js 20+
- npm 10+

## Instalación

```bash
npm install
npm run seed
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:3001`

> Si el backend aún no está disponible, el frontend muestra un cronograma local de respaldo para evitar una pantalla en blanco mientras se conecta la API.
> También puedes abrir la experiencia principal directamente desde `http://localhost:3001/`, porque el servidor Express ahora entrega una versión visual lista para usar sin depender del build de Vite.

## Credenciales admin simuladas

- Usuario: `IPUCVILLADELRIO`
- Clave: `99061408327`

## Formato de cronograma JSON

```json
[
  {
    "fecha_inicio_semana": "2026-03-16",
    "fecha_fin_semana": "2026-03-22",
    "etiqueta": "Semana 3 de marzo",
    "eventos": [
      {
        "dia": "Martes",
        "titulo": "Culto de Caballeros",
        "hora": "7:00 PM",
        "descripcion": "...",
        "tipo": "culto",
        "mensaje": "...",
        "media": ""
      }
    ]
  }
]
```

## Formato Excel

Cada fila representa un evento y debe incluir columnas como:

- `fecha_inicio_semana`
- `fecha_fin_semana`
- `etiqueta`
- `dia`
- `titulo`
- `hora`
- `descripcion`
- `tipo`
- `mensaje`
- `media`

## Scripts

- `npm run dev`: frontend + backend en paralelo
- `npm run dev:client`: frontend Vite
- `npm run dev:server`: backend Express con watch
- `npm run build`: build de producción del frontend
- `npm run seed`: genera datos semilla
