# Amigo Invisible - Proyecto Integrador 2026

Este proyecto es una aplicación móvil para organizar sorteos de "Amigo Invisible" de forma secreta, segura y multi-dispositivo. Desarrollada con **React Native (Expo)** y **Golang**.

## 🚀 Stack Tecnológico

- **Frontend**: React Native + Expo SDK 54
- **Backend**: Go 1.25.0 + Gin
- **Base de datos**: PostgreSQL 16
- **Autenticación**: JWT + Bcrypt
- **DevOps**: Docker Compose V2

## 🐳 Desarrollo con Docker (Recomendado)

### Requisitos
- Docker Engine 24+ y Docker Compose V2.
- Puerto 5433 libre para PostgreSQL.
- Puerto 8080 libre para el backend.

### Pasos
1. **Clonar el repo y entrar a la rama `entrega-3`**:
   ```bash
   git clone https://github.com/FelipeAndreau/PrivateAmigoInvisible.git
   cd PrivateAmigoInvisible
   git checkout entrega-3
   ```

2. **Levantar base de datos + backend**:
   ```bash
   docker compose up -d database backend
   ```
   - PostgreSQL estará en `localhost:5433`.
   - El backend estará en `http://localhost:8080`.
   - El backend se auto-compila con `air` al detectar cambios.

3. **Verificar que esté todo OK**:
   ```bash
   curl http://localhost:8080/health
   # Debería responder: {"status":"up","version":"1.0.0"}
   ```

4. **Levantar el frontend**:
   ```bash
   cd client
   npm install
   npm run start:lan
   ```
   - Escaneá el QR con **Expo Go** en tu celular.
   - Si usás emulador: `i` (iOS) o `a` (Android).

> El comando `npm run start:lan` detecta automáticamente la IP de tu PC y configura el backend. Si preferís no depender de la red local, usá `npm run start:tunnel`.

---

## 🚀 Guía de Inicio Rápido (Local sin Docker)

### Requisitos Previos
- **Node.js**: v18 o superior.
- **npm**: v9 o superior.
- **Go**: v1.25.0 o superior.
- **Expo Go**: Instalado en tu dispositivo móvil (Android/iOS).

### Configuración del Servidor (Backend)
1. Asegurate de tener PostgreSQL corriendo (puerto 5433 o el que configures).
2. `cd server`
3. `go mod tidy`
4. Crear archivo `.env` basado en `.env.example`.
5. `go run cmd/api/main.go`

### Configuración del Cliente (Frontend)
1. `cd client`
2. `npm install`
3. `npm run start:lan`

---

## 🧪 Flujo de Prueba (Entrega 3)

### Features finales:
- **Autenticación**: registro/login con JWT.
- **Dashboard dual**: eventos como organizador y como participante.
- **Grupos / Círculos**: crear grupos, unirse con código, ver miembros y eventos del grupo.
- **Eventos en grupos**: crear sorteos vinculados a un grupo.
- **Chat real**: mensajes reales con polling entre participantes.
- **Sistema de invitaciones**: códigos para eventos y grupos.
- **Preferencias y progreso de regalo**.
- **Galería de fotos** y **historial de eventos**.

### Flujo sugerido:
1. Registrate como usuario.
2. Creá un grupo (p. ej. "Familia") y copiá el código de invitación.
3. Desde otra cuenta, unite al grupo con el código.
4. Dentro del grupo, creá un evento de Amigo Invisible.
5. Compartí el código del evento con los participantes para que se unan.
6. Cuando haya al menos 3 participantes, realizá el sorteo.
7. Utilizá el chat para coordinar detalles.
8. Cada participante podrá visualizar su asignación privada.

---

## 📁 Estructura del Proyecto

```
.
├── client/          # Aplicación React Native con Expo
│   ├── src/
│   │   ├── features/  # Pantallas por funcionalidad
│   │   └── shared/    # Componentes, tema, utilidades, hooks
├── server/          # Backend en Go
│   ├── cmd/api/
│   └── internal/      # auth, event, friends, messages, groups, platform
├── docs/            # Documentación de entregas
├── docker-compose.yml
└── README.md
```

---

## 📄 Documentación

- `docs/alcance_final.md` — Alcance final del proyecto.
- `docs/doc_tecnica_final.md` — Documentación técnica completa.
- `docs/CHANGELOG.md` — Historial de cambios por entrega.

---

## 👥 Equipo
- Felipe Andreau
- Melissa Braunstein
- Santiago Dangelo
- Pilar Wagner
- Pia Porzio
