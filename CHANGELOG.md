# Changelog

## [E3] - 2026-07-18
### Added
- Sistema de grupos y círculos.
- API para gestión de grupos.
- Chat en tiempo real.
- Integración de eventos con grupos.
- Documentación técnica final.

### Changed
- Mejoras en autenticación.
- Optimización de infraestructura Docker.
- Actualización del README y documentación.

### Fixed
- Correcciones en eventos asociados a grupos.
- Correcciones de migraciones y mensajes del chat.

## [E2] - 2026-06-12
### Added
- **Flujo de Autenticación:** Login y registro con JWT + Bcrypt.
- **Código de Invitación:** Auto-generado al crear evento, compartible por WhatsApp.
- **Sistema de Amigos:** CRUD de contactos personales.
- **Chat Anónimo:** Mensajería en tiempo real con polling (3s) para eventos sorteados.
- **Preferencias de Regalo:** Perfil del participante con color, talle, hobbies, alergias.
- **Seguimiento de Regalo:** Estados "Comprado", "Envuelto", "Entregado" con mensajes del sistema.
- **Galería de Fotos:** Subida de fotos post-evento con base64.
- **Historial de Eventos:** Vista consolidada de todos los sorteos (organizador y participante).
- **Countdown:** Cuenta regresiva hasta la fecha del intercambio.
- **DatePicker:** Modal nativo para setear fecha/hora del evento.
- **Toast System:** Notificaciones globales (success, error, warning, info) reemplazando Alert.alert.
- **Mensajes del Sistema:** Notificaciones automáticas en chat cuando ocurren acciones (sorteo, progreso de regalo).

### Changed
- **Rediseño de Flujo:** El organizador ya no agrega participantes manualmente. Crea evento → obtiene código → comparte → participantes se unen solos.
- **Shuffle:** Migrado completamente al backend con algoritmo Fisher-Yates + derangement.
- **Revelación:** Eliminado one-shot, ahora es persistente y accesible en la app.
- **API:** 26 endpoints REST documentados.

### Fixed
- **Versión Go:** Corregida de 1.26.2 (inexistente) a 1.24.
- **Transacciones:** Agregado manejo de errores en tx.Commit() y tx.Rollback().
- **CORS:** Middleware configurado para desarrollo con credenciales.
- **Seguridad:** Validación de contraseñas (8+ chars, mayúscula, minúscula, número) en cliente y servidor.
- **Estructura:** Eliminado código legacy (shuffle.ts, useEvent.ts) y repositorio anidado.

## [E2] - 2026-05-19
### Added
- Nueva rama `entrega-2` para escalado funcional.
- Documentación inicial de E2: `alcance_e2.md`, `doc_tecnica_e2.md`, `diseno_ux_ui_e2.md`.
- Planificación de arquitectura Online con Go + PostgreSQL.
- Definición de "Enfoque Organizador" con Magic Links.

## [E1] - 2026-05-18
### Added
- Estructura base del proyecto (Monorepo).
- Cliente Expo con lógica de sorteo local.
- Servidor Go base con Health Check.
- Dockerización de todo el entorno.
