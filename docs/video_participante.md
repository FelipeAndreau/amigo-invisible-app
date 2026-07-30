# Guión Personal - Video Demo E3 (Backend / Lead Técnico)

**Rol sugerido:** Felipe / Backend + API + Infraestructura  
**Tiempo de tu parte en el video:** ~1 minuto 30 segundos  
**Mostrar en pantalla mientras hablás:** backend, Docker, endpoints en Postman o terminal, código resaltado si da el tiempo.

---

## 1. Qué hiciste en el proyecto (40 seg)

> "Yo me encargué principalmente del backend, la infraestructura y la integración de la Entrega 3. En el backend trabajé con Go y Gin, donde armé toda la API REST: autenticación con JWT, gestión de eventos, el sistema de invitaciones, las preferencias de regalo, la galería de fotos y el historial.
>
> Para la Entrega 3, lo más importante fue el **módulo de grupos**: creé los endpoints para crear grupos, unirse con código, ver miembros y vincular eventos a un grupo. También conecté el **chat real** del frontend con los endpoints de mensajes del backend, usando polling.
>
> Además, armé toda la infraestructura con Docker Compose: el backend en Go, la base PostgreSQL, y los scripts de Expo para que cada uno pueda levantar la app localmente en LAN o túnel."

---

## 2. Tu parte en la demo del video (30 seg)

> "En la demo se va a ver el backend corriendo, por ejemplo levantando `docker compose up -d database backend` y el health check respondiendo en `localhost:8080/health`. También se va a mostrar el flujo de grupos: crear un grupo, copiar el código, unirse desde otra cuenta y crear un evento adentro."

---

## 3. Reflexión personal sobre uso de IA (20 seg)

> "Usé IA para acelerar el desarrollo, sobre todo en la estructura de handlers de Go, en la configuración de Docker, en la integración del chat y en la documentación final. Lo que más me sirvió fue tener una base rápida para después pulir y asegurarme de que todo funcione correctamente. También me ayudó a revisar el estado del repo y armar los entregables finales. Lo importante fue no copiar sin entender: siempre validé lo que generaba la IA antes de subirlo."

---

## Tips para leerlo natural

- No lo memorices de memoria. Leelo 2-3 veces y contalo con tus palabras.
- Mirá a la cámara cuando estés hablando.
- Si algo sale mal en la demo, repetí la frase sin preocuparte.
- Si te da tiempo, mostrá el `docker compose ps` o el `curl` al health check en vivo.

---

## Si no sos Felipe

Reemplazá:
- "Yo me encargué del backend..." por tu área real (frontend, diseño, documentación, alcance, etc.).
- Los ejemplos técnicos por lo que vos hiciste realmente.
- La reflexión mantenela honesta: qué usaste de IA, qué te funcionó y qué tuviste que corregir.
