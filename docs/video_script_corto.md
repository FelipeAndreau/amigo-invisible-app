# Guión Corto - Video Demo Final (E3)

**Duración sugerida:** 3 minutos  
**Formato:** Zoom con pantalla compartida + cámaras encendidas  
**Plataforma:** YouTube unlisted o Google Drive  

---

## Introducción (20 seg)

**Pía:**
> "Buenas, somos el equipo de Amigo Invisible. Les mostramos la versión final de nuestra app móvil para organizar sorteos de regalos de forma remota, segura y divertida. Está hecha con React Native y Expo en el frontend, Go con Gin en el backend y PostgreSQL como base de datos."

**Melissa:**
> "En esta demo vamos a recorrer el flujo completo: registro, grupos, sorteo, chat y la revelación privada de asignaciones."

---

## 1. Registro y login (20 seg)

**Felipe:**
> "El usuario se registra con email y contraseña. Usamos JWT para autenticación, bcrypt para el hash y guardamos el token de forma segura en el dispositivo."

*Mostrar:* registro → login → dashboard.

---

## 2. Grupos / Círculos (40 seg)

**Santi:**
> "La novedad de esta entrega son los grupos. Acá el usuario crea un grupo, por ejemplo 'Familia', y obtiene un código de invitación."

*Mostrar:* crear grupo → copiar código.

**Pilar:**
> "Desde otra cuenta se ingresa el código y se une al grupo. Ahí se ven todos los miembros y los eventos del grupo."

*Mostrar:* unirse con código → ver detalle del grupo.

---

## 3. Evento y sorteo (40 seg)

**Felipe:**
> "Dentro del grupo se crea un evento de Amigo Invisible. Cuando hay al menos tres participantes, el organizador realiza el sorteo."

**Santi:**
> "El sorteo corre en el backend con Fisher-Yates y derangement, así nadie se asigna a sí mismo."

**Pilar:**
> "Cada participante ve solo su propia asignación. El backend nunca expone las de los demás."

*Mostrar:* crear evento → agregar participantes → sortear → ver asignación privada.

---

## 4. Chat real (30 seg)

**Melissa:**
> "Otra mejora importante es el chat real. Antes era un placeholder, pero ahora los participantes se mandan mensajes dentro del evento para coordinar detalles sin revelar la asignación."

*Mostrar:* abrir chat → enviar mensajes entre dos usuarios.

---

## 5. Cierre (10 seg)

**Pía:**
> "Eso es todo. El código y la documentación están en el repositorio. ¡Gracias por ver la demo!"

**Todos:**
> "¡Gracias!"

---

## Consejos para grabar

- Usar dos dispositivos o dos cuentas para mostrar interacción real.
- Tener el backend levantado antes de empezar: `docker compose up -d database backend`.
- Practicar una vez antes de grabar.
- Si algo falla, repetir la sección; no editar demasiado.
- Cámaras encendidas, lenguaje profesional.
