# Amigo Invisible - Proyecto Integrador 2026

Este proyecto es una aplicación móvil para organizar sorteos de "Amigo Invisible" de forma secreta, segura y divertida. Desarrollada con **React Native (Expo)** y **Golang**.

## 🐳 Desarrollo con Docker (Recomendado para el equipo)

**Nota:** Usamos Docker Compose V2 (`docker compose`, sin guion). Si tu sistema tiene `docker-compose` (v1), actualízalo o usa `docker compose`.

### Requisitos
- Docker Engine 24+ y Docker Compose V2.
- Puerto 5433 libre para PostgreSQL.

### Pasos
1. **Clonar el repo y entrar a la rama `entrega-2`**:
   ```bash
   git clone https://github.com/FelipeAndreau/PrivateAmigoInvisible.git
   cd PrivateAmigoInvisible
   git checkout entrega-2
   ```

2. **Levantar la base de datos**:
   ```bash
   docker compose up -d database
   ```
   PostgreSQL estará en `localhost:5433`.

3. **Compilar y levantar el backend** (Go 1.22+):
   ```bash
   cd server
   go mod tidy
   export DB_HOST=localhost
   export DB_PORT=5433
   export DB_USER=felipe
   export DB_PASSWORD=secret
   export DB_NAME=amigo_invisible
   export JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   export PORT=8080
   export ENV=development
   go run cmd/api/main.go
   ```
   El backend estará en `http://localhost:8080`.

4. **Levantar el frontend** (en otra terminal):
   ```bash
   cd client
   npm install
   npx expo start --lan
   ```
   **Importante:** Escanea el QR con **Expo Go** en tu celular. Si estás en emulador, presiona `i` (iOS) o `a` (Android).

5. **Cambiar la IP del backend** (si usas Expo Go en celular):
   En `client/src/shared/utils/api.ts`, reemplaza:
   ```typescript
   const LOCAL_IP = '192.168.100.94'; // ← pon la IP de tu PC en la red WiFi
   ```
   Ejemplo: `192.168.1.42`.

---

## 🚀 Guía de Inicio Rápido (Local sin Docker)

### Requisitos Previos
- **Node.js**: v18 o superior.
- **npm**: v9 o superior.
- **Go**: v1.22 o superior.
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
3. Cambiar la IP en `src/shared/utils/api.ts` (ver paso 5 arriba).
4. `npx expo start --lan`

---

## 🧪 Cómo Probar la App (Flujo Entrega 2)

### Features implementadas en E2:
- **Dashboard dual**: Eventos como organizador + eventos como participante
- **Unirse a sorteo**: Botón "🔗 Unirse" en el header del Dashboard, ingresás código de invitación
- **Chat placeholder**: Dentro de cada evento, botón "💬 Chat" con mensajes mock y input deshabilitado
- **Amigos/Contactos**: Botón "👥 Contactos" en el header, agregar/eliminar contactos
- **Deep linking**: Configurado scheme `amigoinvisible://` para abrir la app desde links (Expo Go)
- **Reveal API JSON**: La app ya no parsea HTML, consume JSON directamente

### Flujo completo:
1. **Autenticación**: Regístrate como organizador.
2. **Dashboard**: Verás dos secciones: "Organizador" (tus sorteos) y "Participando" (sorteos a los que te uniste).
3. **Crear sorteo**: Pulsa "+" FAB, agregá mínimo 3 participantes, sorteá.
4. **Compartir links**: En un evento sorteado, tocá un participante para compartir su link mágico.
5. **Unirse como invitado**: Usá el botón "🔗 Unirse" en el Dashboard, ingresá el código de invitación.
6. **Ver asignación**: Si sos participante y el sorteo ya se hizo, verás "¡Tu amigo invisible es: [nombre]!" en el detalle del evento.
7. **Chat**: Dentro de cualquier evento, tocá el ícono de chat para ver la UI placeholder.

---

## ⚡ Cómo levantar todo (paso a paso)

### 1. Bajar todo lo que esté corriendo
```bash
docker compose down
```

### 2. Levantar base de datos + backend (Docker)
```bash
docker compose up -d database backend
```
- Esperá 5 segundos a que PostgreSQL esté healthy.
- El backend se auto-compila con `air` y se reinicia solo si cambiás código.

### 3. Verificar que esté todo OK
```bash
curl http://localhost:8080/health
# Debería responder: {"status":"up","version":"1.0.0"}
```

### 4. Levantar frontend (Expo)
```bash
cd client
npm install   # si es primera vez
npx expo start --lan
```
- Escaneá el QR con **Expo Go** en tu celular.
- Si usás emulador: `i` (iOS) o `a` (Android).

### 5. Cambiar la IP del backend (si usás Expo Go en celular)
En `client/src/shared/utils/api.ts`, reemplazá:
```typescript
const LOCAL_IP = '192.168.100.94'; // ← pon la IP de tu PC en la red WiFi
```

### 6. Verificar features nuevas
- Registrate / logueate
- Creá un evento, agregá 3 participantes, sorteá
- Generá un código de invitación
- Desde otra cuenta (o logout/login), unite con el código
- Verificá que aparezca en "Participando" en el Dashboard
- Entrá al evento y verificá que se vea "¡Tu amigo invisible es: ...!"

## 👥 Equipo
- Felipe Andreau
- Melissa Braunstein
- Santiago Dangelo
- Pilar Wagner
- Pia Porzio
