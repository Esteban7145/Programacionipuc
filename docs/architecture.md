# Arquitectura IPUC Vision (v0.1)

## Capas
1. **Presentation (React):** vistas de operador, preview/live, diseño glassmorphism.
2. **Application:** orquestación de escenas, colas de reproducción, reglas de culto.
3. **Infrastructure (Electron/Node):** IPC seguro, acceso a SQLite, archivos multimedia.
4. **Domain:** entidades Song, Verse, Scene, Announcement, ServicePlan, UserRole.

## Principios
- Clean Architecture modular.
- Feature folders por dominio.
- Persistencia desacoplada para migrar de SQLite a PostgreSQL.
- Motor de render optimizado con aceleración por GPU.
- Observabilidad: logs, diagnósticos, telemetría opcional.

## Roadmap empresarial
- **Fase 1:** MVP visual + canciones + escenas + Biblia base.
- **Fase 2:** diseñador de anuncios drag & drop + playlist multimedia avanzada.
- **Fase 3:** multiusuario + sincronización nube + control remoto web.
- **Fase 4:** marketplace de plantillas IPUC y plugins ministeriales.
