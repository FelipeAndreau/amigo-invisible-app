# Amigo Invisible - Proyecto Integrador 2026

Este proyecto es una aplicación móvil para organizar sorteos de "Amigo Invisible" de forma secreta, segura y divertida. Desarrollada con **React Native (Expo)** y **Golang**.

## 🐳 Desarrollo con Docker (Recomendado para el equipo)

Para asegurar que todos usemos el mismo entorno, puedes usar Docker Compose:

1. Levanta todos los servicios:
   ```bash
   docker-compose up --build
   ```
2. El backend estará en `http://localhost:8080`.
3. El frontend de Metro estará en el puerto `8081`. 

*Nota: Para conectar el celular físico al contenedor de Docker, asegúrate de estar en la misma red WiFi y que el puerto 8081 esté abierto en tu firewall.*

---

## 🚀 Guía de Inicio Rápido (Local)

### Requisitos Previos
- **Node.js**: v18 o superior.
- **npm**: v9 o superior.
- **Expo Go**: Instalado en tu dispositivo móvil (Android/iOS).

### Configuración del Cliente (Frontend)

1. Entra en la carpeta del cliente:
   ```bash
   cd amigo-invisible-app/client
   ```
2. Instala las dependencias (usando `--legacy-peer-deps` para asegurar compatibilidad con React 19):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Inicia el servidor de desarrollo de Metro:
   ```bash
   npx expo start -c
   ```
4. Escanea el código QR con la app **Expo Go** en tu celular.

### Configuración del Servidor (Backend)

1. Entra en la carpeta del servidor:
   ```bash
   cd amigo-invisible-app/server
   ```
2. Descarga los módulos de Go:
   ```bash
   go mod tidy
   ```
3. Ejecuta el servidor en modo desarrollo:
   ```bash
   go run cmd/api/main.go
   ```
4. El servidor estará escuchando en `http://localhost:8080/health`.

---

## 🧪 Cómo Probar la App (Flujo E1)

1. **Crear Evento**: Al abrir la app, ingresa un nombre para tu evento (ej: "Oficina 2026").
2. **Agregar Amigos**: Escribe nombres y presiona el botón (+). Intenta agregar el mismo nombre dos veces para ver la validación.
3. **Persistencia**: Cierra la app completamente y vuelve a abrirla. Verás que tus amigos siguen ahí.
4. **Realizar Sorteo**: Agrega al menos 3 personas y presiona "Realizar Sorteo".
5. **Revelación Secreta**: 
   - Verás el nombre del primer participante.
   - **Mantén presionado** el botón "REVELAR" para ver quién le tocó. Sentirás una vibración (haptic feedback).
   - Suelta el botón y presiona "Siguiente" para pasar el celular al siguiente amigo.
6. **Reinicio**: Al terminar con el último, presiona "Finalizar Sorteo" para limpiar los datos y empezar un nuevo evento.

---

## 👥 Equipo
- **Felipe Andreau**: Infraestructura & Backend.
- **Melissa Braunstein**: Diseño UI/UX.
- **Santiago Dangelo**: Lógica & Estado.
- **Pilar Wagner**: Gestión de Eventos.
- **Pia Porzio**: Revelación & Persistencia.
