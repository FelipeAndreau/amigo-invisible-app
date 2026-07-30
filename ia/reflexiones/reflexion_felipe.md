# Reflexión Individual - Uso de Inteligencia Artificial

**Nombre:** Felipe Andreau  
**Rol en el equipo:** Backend + API + Infraestructura  
**Fecha:** 30/07/2026

---

## 1. ¿Para qué usaste IA durante el proyecto?

Marcá las opciones que correspondan y describí brevemente:

- [x] Generación de código
- [x] Debugging
- [ ] Diseño UX/UI
- [x] Documentación
- [x] Planificación de tareas
- [x] Explicación de conceptos técnicos
- [x] Revisión de código
- [ ] Otros: ____________________

**Descripción:**

Durante el proyecto utilicé IA principalmente para el backend, la infraestructura y la integración final de la Entrega 3. Me ayudó a estructurar handlers de Go, migraciones de PostgreSQL, endpoints REST para grupos y chat, y la configuración de Docker Compose. También la usé para revisar el estado del repo, identificar entregables faltantes, armar documentación final y planificar la división de tareas del equipo. En debugging fue clave para encontrar rápidamente errores como el `user_id` faltante en el login o problemas de CORS.

---

## 2. ¿Qué funcionó bien?

La IA fue muy eficiente para tareas repetitivas y estructuradas: generar CRUDs, armar migraciones SQL, configurar Docker y escribir documentación. También me sirvió mucho para analizar el historial de git y entender rápidamente el estado de contribuciones del equipo. A la hora de integrar el frontend con el backend, pudo detectar inconsistencias entre la API y las llamadas del cliente.

---

## 3. ¿Qué respuestas tuviste que corregir o descartar?

En varias ocasiones la IA propuso estructuras de código más complejas de las necesarias o endpoints que no se ajustaban al modelo de datos real del proyecto. Por ejemplo, sugerencias de normalización extra en tablas que ya funcionaban bien, o manejo de errores en inglés cuando el producto está en español. También tuve que validar manualmente que las migraciones no rompieran datos existentes. Siempre revisé antes de commitear.

---

## 4. ¿Cómo cambió tu forma de trabajar respecto a proyectos anteriores?

La IA aceleró notablemente el desarrollo de código repetitivo y la documentación. En proyectos anteriores me tomaba más tiempo armar la estructura base del backend; acá pude enfocarme más en la lógica de negocio y en asegurar que todo funcione en conjunto. También me ayudó a mantener la consistencia entre el README, los scripts de Docker y la configuración de Expo.

---

## 5. ¿Qué aprendiste sobre el uso responsable de la IA?

Aprendí que la IA es una herramienta poderosa pero no infalible. Nunca hay que copiar y pegar sin entender: cada sugerencia debe validarse contra el código real, la arquitectura del proyecto y las consignas de la entrega. Ser específico en los prompts y dar contexto del repo mejora mucho la calidad de las respuestas. La responsabilidad final del código siempre es del desarrollador.

---

## 6. Skills/herramientas de IA utilizadas

- Claude / OpenCode
- GitHub Copilot
- ChatGPT

---

## 7. Conclusión

El uso de IA fue fundamental para cerrar la Entrega 3 a tiempo, sobre todo en la integración de grupos, el chat real y la documentación final. Sin embargo, el valor real vino de supervisar y ajustar cada entrega generada, no de aceptarla sin cuestionar. De cara a futuros proyectos, me llevo la práctica de usar la IA como acelerador, pero manteniendo el control técnico y la revisión manual como pasos obligatorios.

---

**Extensión sugerida:** 1 página.
