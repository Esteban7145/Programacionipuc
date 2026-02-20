# IPUC Proyección

Plataforma SaaS de proyección profesional para la IPUC (Iglesia Pentecostal Unida de Colombia), inspirada en flujos de ProPresenter/Holyrics, pero totalmente personalizable por iglesia y comité DECOM.

## Características implementadas (base profesional)

- Arquitectura Next.js + React + API Routes (backend integrado).
- MongoDB + Mongoose con modelos multi-tenant (`Tenant`, `User`, `Song`, `Verse`, `Presentation`).
- Autenticación con JWT y roles (`ADMIN_GENERAL`, `LIDER_DECOM`, `OPERADOR`).
- Panel de administración inicial para:
  - Canciones por estrofas.
  - División automática en diapositivas.
  - Personalización visual por iglesia.
- Modo proyección con animaciones suaves (Framer Motion), glow de texto y control con teclado.
- Endpoints base para canciones, versículos y presentaciones.
- Preparado para escalar a SaaS multi-iglesia.

## Arquitectura

```txt
Next.js App Router
├─ UI Operador/Admin (React)
├─ Modo Proyección Externa
├─ API Routes (auth, songs, verses, presentations)
├─ Capa Auth JWT
├─ Multi-tenant isolation por tenantId
└─ MongoDB
```

## Variables de entorno

Crear `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/ipuc-proyeccion
JWT_SECRET=coloca_un_secreto_seguro
```

## Ejecutar

```bash
npm install
npm run dev
```

## Roadmap sugerido (siguientes fases)

1. Control remoto móvil vía WebSocket real + QR de emparejamiento.
2. Biblioteca nacional IPUC con plantillas oficiales descargables.
3. Importador completo Biblia RVR1960 indexada y búsqueda semántica.
4. Integración OBS (WebSocket plugin).
5. Métricas de uso por iglesia y comité.
6. Proyección dual monitor 4K con renderer dedicado.

## Identidad visual

- Estética: elegante, minimalista, futurista.
- Paleta: negro profundo, azul eléctrico, blanco limpio, dorado suave.
- Glassmorphism ligero y transiciones cinematográficas.
