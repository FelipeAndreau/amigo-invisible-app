# Guión - Video Demo Final (E3)

**Duración sugerida:** 4 minutos  
**Formato:** Zoom con pantalla compartida + cámaras encendidas  
**Plataforma:** YouTube unlisted o Google Drive  

---

## Introducción (30 segundos)

**Pia:**
> "Buenas, somos el equipo de Amigo Invisible. Les presentamos la versión final de nuestra aplicación móvil para organizar sorteos de regalos de forma remota, segura y divertida. La app está desarrollada con React Native y Expo en el frontend, Go con Gin en el backend, y PostgreSQL como base de datos."

**Melissa:**
> "En esta demo vamos a mostrarles el flujo completo: registro, creación de grupos, organización de sorteos, chat entre participantes y la revelación privada de asignaciones."

---

## Sección 1: Registro y login (30 segundos)

**Felipe:**
> "Primero, el usuario se registra con email y contraseña. Usamos JWT para autenticación y bcrypt para el hash de contraseñas. El token se guarda de forma segura en el dispositivo con expo-secure-store."

*Mostrar en pantalla:*
- Pantalla de login/registro.
- Completar registro.
- Entrada al Dashboard.

---

## Sección 2: Grupos / Círculos (1 minuto)

**Santi:**
> "Una de las novedades de esta entrega es el sistema de grupos. Un usuario puede crear un grupo, por ejemplo 'Familia' o 'Trabajo', y obtener un código de invitación para que otros se unan."

*Mostrar en pantalla:*
- Dashboard.
- Tocar ícono de grupos.
- Crear un nuevo grupo.
- Copiar o mostrar el código de invitación.

**Pilar:**
> "Desde otra cuenta, la persona ingresa el código y se une al grupo. Todos los miembros pueden ver quiénes forman parte y los eventos del grupo."

*Mostrar en pantalla:*
- Login con otro usuario (o logout/login).
- Unirse al grupo con el código.
- Ver detalle del grupo con miembros.

---

## Sección 3: Crear evento y sortear (1 minuto)

**Felipe:**
> "Dentro de un grupo, el creador puede crear un evento de Amigo Invisible. El sistema genera un código de invitación para ese evento."

*Mostrar en pantalla:*
- Crear evento dentro del grupo.
- Agregar participantes.

**Santi:**
> "Una vez que hay al menos tres participantes, el organizador realiza el sorteo. El algoritmo corre en el backend con Fisher-Yates y derangement, garantizando que nadie se asigne a sí mismo."

*Mostrar en pantalla:*
- Realizar sorteo.
- Mensaje de confirmación.

**Pilar:**
> "Cada participante ve únicamente su propia asignación. El backend nunca expone las asignaciones de los demás."

*Mostrar en pantalla:*
- Entrar al evento como participante.
- Ver "Tu amigo invisible es: ...".

---

## Sección 4: Chat real (45 segundos)

**Melissa:**
> "Otra mejora importante es el chat real. Antes era un placeholder, pero ahora los participantes pueden enviarse mensajes dentro del evento para coordinar detalles sin revelar la asignación."

*Mostrar en pantalla:*
- Abrir chat desde el evento.
- Enviar mensajes entre dos usuarios.
- Mostrar que los mensajes propios se distinguen de los ajenos.

---

## Sección 5: Documentación y arquitectura (30 segundos)

**Pia:**
> "Como parte del trabajo final, documentamos todo el proyecto: alcance, requerimientos, user stories, arquitectura, API completa, seguridad y optimizaciones. También registramos todo el uso de IA generativa a lo largo de las tres entregas."

*Mostrar en pantalla (opcional):*
- README.md.
- docs/alcance_final.md.
- docs/doc_tecnica_final.md.
- Carpeta /ia/.

---

## Cierre (15 segundos)

**Pia:**
> "Eso es todo. Gracias por ver la demo. El código y la documentación están disponibles en el repositorio."

**Todos:**
> "¡Gracias!"

---

## Notas para la grabación

- Usar dos dispositivos o dos cuentas para mostrar interacción entre usuarios.
- Asegurar que el backend esté levantado antes de empezar.
- Tener listos los usuarios de prueba.
- Evitar mostrar datos personales reales.
- Si algo falla durante la grabación, repetir la sección; no editar demasiado.
