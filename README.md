# DECOM Villa del Río · Plataforma Web Ministerial

Proyecto full-stack frontend listo para ejecutarse con React + Firebase para gestionar cronogramas, eventos, galería tipo Instagram e invitaciones interactivas del ministerio **DECOM Villa del Río** de la IPUC.

## Requisitos previos

- Node.js 18+
- Cuenta de Firebase
- Visual Studio Code

## Cómo ejecutar

```bash
npm install
npm start
```

La app se abrirá en `http://localhost:3000`.

## Arquitectura del proyecto

```text
src/
├── components/
│   ├── Navbar.jsx
│   ├── EventCard.jsx
│   ├── Stories.jsx
│   ├── UploadModal.jsx
├── hooks/
│   └── useEvents.js
├── pages/
│   ├── Home.jsx
│   ├── Gallery.jsx
│   ├── Admin.jsx
├── services/
│   ├── firebase.js
│   ├── eventService.js
├── styles/
│   └── global.css
├── App.jsx
└── index.js
```

## Qué hace la plataforma

- **Home inteligente:** detecta la semana actual y muestra los eventos de esa semana automáticamente.
- **Cronograma 2026 precargado:** incluye la programación completa de marzo a diciembre compartida por DECOM para operar incluso antes de conectar Firestore.
- **Cronogramas mensuales:** permite subir PDF o imágenes por mes y muestra el mes actual como prioridad.
- **Stories tipo Instagram:** presenta eventos recientes en carrusel horizontal.
- **Galería social:** grid responsive con vista detallada por evento, fotos y video opcional.
- **Panel administrativo:** login con Firebase Authentication y formularios para crear eventos y cronogramas.
- **Escalabilidad:** separación por componentes, hooks y services para crecer hacia app móvil o paneles adicionales.

## Configuración de Firebase paso a paso

### 1. Crear proyecto
1. Entra a [Firebase Console](https://console.firebase.google.com/).
2. Haz clic en **Crear proyecto**.
3. Asigna el nombre del proyecto, por ejemplo: `decom-villa-rio`.

### 2. Registrar app web
1. Dentro del proyecto, selecciona **Agregar app** > **Web**.
2. Copia el bloque de configuración de Firebase.

### 3. Activar Authentication
1. Ve a **Authentication** > **Get started**.
2. Activa el proveedor **Email/Password**.
3. Crea el primer usuario administrador.

### 4. Activar Firestore
1. Ve a **Firestore Database** > **Create database**.
2. Elige modo producción o pruebas.
3. Crea las colecciones:
   - `eventos`
   - `media`
   - `cronogramas`

### 5. Activar Storage
1. Ve a **Storage** > **Get started**.
2. Selecciona una ubicación.
3. Permite subir imágenes, PDF y videos.

### 6. Pegar credenciales
Tienes dos opciones:

#### Opción A: Variables de entorno recomendadas
Crea un archivo `.env.local` en la raíz:

```env
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

#### Opción B: Directamente en el archivo
Edita `src/services/firebase.js` y reemplaza los valores demo.

## Modelo de datos sugerido

### Colección `eventos`
```json
{
  "titulo": "Culto unido de jóvenes",
  "fecha": "timestamp",
  "tipo": "Culto especial",
  "descripcion": "Noche de alabanza, palabra y ministración.",
  "imagen_portada": "https://...",
  "invitacion_link": "https://...",
  "invitacion_tipo": "link"
}
```

### Colección `media`
```json
{
  "evento_id": "abc123",
  "tipo": "imagen",
  "url": "https://..."
}
```

### Colección `cronogramas`
```json
{
  "monthKey": "2026-03",
  "monthLabel": "Marzo 2026",
  "fileUrl": "https://..."
}
```

## Despliegue en Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

Durante `firebase init hosting`:
- Selecciona el proyecto correcto.
- Usa `build` como carpeta pública.
- Configura como SPA: **Yes**.

## Escalabilidad futura

- Integración de roles y permisos más granulares.
- Notificaciones push con Firebase Cloud Messaging.
- API adicional para analítica o integraciones externas.
- Reutilización de services/hooks en React Native.


## Solución de problemas

- **Safari dice “dirección no válida” al abrir programación del mes:**
  en modo seed (sin archivo PDF/imagen en Firebase) el botón ahora navega a la sección interna del mes. Si deseas abrir un archivo externo, sube un cronograma desde Admin para que exista `fileUrl` real.

- **GitHub móvil muestra error 500 al actualizar la solicitud de extracción:**
  este error pertenece a la plataforma de GitHub (backend de PR/extracción) y no a este código. Reintenta desde navegador de escritorio, recarga sesión o intenta más tarde.

