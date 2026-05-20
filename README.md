# Amigo Invisible - Proyecto Integrador 2026

Este proyecto es una aplicación móvil para organizar sorteos de "Amigo Invisible" de forma secreta, segura y divertida. Desarrollada con **React Native (Expo)** y **Golang**.

## 🐳 Desarrollo con Docker (Recomendado para el equipo)

Para asegurar que todos usemos el mismo entorno, puedes usar Docker Compose:

1. Levanta todos los servicios:
   ```bash
   docker-compose up -d --build
   ```
2. El backend estará en `http://localhost:8080`.
3. El frontend de Metro estará en el puerto `8081`. 

---

## 🚀 Guía de Inicio Rápido (Local)

### Requisitos Previos
- **Node.js**: v18 o superior.
- **npm**: v9 o superior.
- **Expo Go**: Instalado en tu dispositivo móvil (Android/iOS).

### Configuración del Cliente (Frontend)
1. `cd client`
2. `npm install --legacy-peer-deps`
3. `npx expo start -c`

### Configuración del Servidor (Backend)
1. `cd server`
2. `go mod tidy`
3. `go run cmd/api/main.go`

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
