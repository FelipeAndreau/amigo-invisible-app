# Video Script - Entrega 2 - Felipe Andreau

## 🎬 Guía de Grabación (2-3 minutos)

### Introducción (30s)
"Hola, soy Felipe Andreau y mi responsabilidad en la Entrega 2 fue la **Gestión de Infraestructura, Git, Configuración, Tests y Documentación** del proyecto Amigo Invisible."

### 1. Docker & DevOps (45s)
- Abre `docker-compose.yml`
- Explica los 3 servicios:
  - **database**: PostgreSQL 16 con healthcheck y puerto 5433
  - **backend**: Go 1.24 con hot reload (air) en puerto 8080
  - **frontend**: Expo en puerto 8081 con ngrok para túneles
- Muestra `server/Dockerfile.dev` - imagen de desarrollo Go
- Muestra `server/.air.toml` - configuración de hot reload
- Muestra `client/Dockerfile.dev` - imagen de desarrollo Expo (si existe)
- Explica cómo levantar todo: `docker compose up -d database backend`

### 2. Configuración del Proyecto (30s)
- Abre `client/package.json`
  - Muestra dependencias: Expo SDK 54, React Native 0.81.5, React Navigation
  - Muestra scripts: start, android, ios, web, test
- Abre `client/tsconfig.json` - configuración TypeScript
- Abre `client/metro.config.js` - configuración de Metro bundler
- Abre `client/app.json` - manifest de Expo con deep linking
- Abre `server/.env.example` - variables de entorno para backend

### 3. Tests Unitarios (45s)
- Abre `server/internal/event/logic_test.go`
  - Explica: tests del algoritmo de derangement (sorteo)
  - Muestra casos de prueba: mínimo 3 participantes, validación de emails
- Abre `client/src/shared/utils/validation.test.ts`
  - Explica: tests de validaciones de frontend
  - Muestra: email, password, eventName, participantName, inviteCode
  - Ejecuta `npm test` para mostrar 19 tests pasando
- Menciona que usamos **Jest** con **ts-jest** para TypeScript
- Abre `client/jest.config.js` - configuración de Jest

### 4. Documentación (45s)
- Abre `README.md`
  - Explica: instrucciones de setup, requisitos, pasos para levantar
  - Muestra la sección de Docker y la sección de local
- Abre `CHANGELOG.md`
  - Muestra el registro de cambios desde E1 a E2
- Abre `docs/alcance_e2.md`
  - Explica: requisitos funcionales nuevos (RF-05 a RF-10)
  - Muestra user stories con Given/When/Then
- Abre `docs/doc_tecnica_e2.md`
  - Explica: autenticación JWT, API REST, estructura de DB
  - Muestra la tabla de endpoints
- Abre `docs/diseno_ux_ui_e2.md`
  - Muestra: decisiones de diseño, wireframes, sistema de navegación

### 5. Git Workflow (30s)
- Muestra el historial de git: `git log --graph --oneline`
- Explica: uso de feature branches (feature/pia-design-system, feature/pilar-frontend-ux, etc.)
- Muestra que todo se mergeó en `entrega-2`
- Menciona que cada integrante tiene su branch de E2 ahora

### Cierre (15s)
"Mi trabajo asegura que el proyecto sea reproducible, documentado, testeado y que cualquier miembro del equipo pueda levantarlo en minutos."

---

**Puntos clave para mencionar:**
- Docker Compose con 3 servicios (DB, backend, frontend)
- Hot reload con Air (Go) y Expo (React Native)
- Tests unitarios: Go (logic_test.go) + TS (validation.test.ts)
- Jest + ts-jest configurados
- README completo con setup paso a paso
- CHANGELOG con versiones
- Documentos de alcance, técnico, UX/UI
- Git workflow con feature branches
- Variables de entorno (.env.example)
- Configuración: package.json, tsconfig, metro.config, app.json

**Archivos a mostrar:**
- `docker-compose.yml`
- `server/Dockerfile.dev`
- `server/.air.toml`
- `client/package.json`
- `client/tsconfig.json`
- `client/metro.config.js`
- `server/internal/event/logic_test.go`
- `client/src/shared/utils/validation.test.ts`
- `client/jest.config.js`
- `README.md`
- `CHANGELOG.md`
- `docs/alcance_e2.md`
- `docs/doc_tecnica_e2.md`
- `docs/diseno_ux_ui_e2.md`
