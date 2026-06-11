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

1. **Autenticación**: Regístrate como organizador con tu email y una contraseña.
2. **Dashboard**: Verás tu lista de sorteos (vacía al inicio). Pulsa el botón "+" para crear uno.
3. **Gestión de Evento**:
   - Ponle un nombre al sorteo.
   - Agrega a tus amigos uno por uno.
   - Puedes eliminar participantes si te equivocas (antes de sortear).
4. **Realizar Sorteo**: Pulsa "Realizar Sorteo" (mínimo 3 personas). El servidor asignará los resultados de forma segura.
5. **Compartir Links Mágicos**:
   - Pulsa sobre cada nombre de la lista.
   - Se abrirá el menú para compartir un link único por WhatsApp/Email.
6. **Revelación Web**: Al abrir el link en el navegador, el participante verá su resultado con un efecto de confeti. El link es de un solo uso para garantizar la privacidad.

---

## 👥 Equipo
- Felipe Andreau
- Melissa Braunstein
- Santiago Dangelo
- Pilar Wagner
- Pia Porzio
