# IPUC Vision

Suite profesional de proyección para iglesias pentecostales, diseñada para la Iglesia Pentecostal Unida de Colombia (IPUC).

## Stack
- Electron + React + TailwindCSS
- Node.js
- SQLite (better-sqlite3)
- Integración OpenAI API

## Módulos incluidos (MVP profesional)
- Dashboard premium estilo futurista
- Biblioteca de canciones (estructura litúrgica)
- Biblia integrada (base preparada)
- Sistema de anuncios
- Escenas y automatizaciones
- Panel asistente IA
- Base para multiusuario, plugins y actualizaciones

## Ejecutar en desarrollo
```bash
npm install
npm run dev
```

## Compilar para producción (.exe)
```bash
npm run dist
```

Genera instalador Windows NSIS en `release/`.

## Instalación en Windows 11 (usuario final)
1. Abrir la carpeta `release/`.
2. Ejecutar `IPUC-Vision-<version>-Setup.exe`.
3. Seguir el asistente e instalar.
4. Abrir IPUC Vision desde el acceso directo.

## Servidor automático al abrir la app
- El backend local de IPUC Vision arranca automáticamente al iniciar la aplicación de escritorio.
- Endpoint local de salud: `http://127.0.0.1:47821/health`.
- Endpoint de canciones: `http://127.0.0.1:47821/api/songs`.

## Arquitectura
Revisar `docs/architecture.md` para el diseño modular y roadmap empresarial.
