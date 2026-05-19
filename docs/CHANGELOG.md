# Changelog - Amigo Invisible

## [0.1.0] - 2026-05-12
### Entrega 1: MVP Local (Offline First)

### Añadido
- Inicialización del proyecto con Expo SDK 54.
- Implementación de la arquitectura **Package-by-Feature**.
- Algoritmo de sorteo Fisher-Yates con validación de derangement (no auto-regalo).
- Hook `useEvent` para manejo de estado global del evento.
- Persistencia local mediante `AsyncStorage`.
- Sistema de diseño vibrante basado en `Fredoka` y `Nunito`.
- Pantalla de Revelación Privada con feedback háptico.
- Componentes modulares: `EventHeader`, `ParticipantInput`, `ParticipantList`, `RevealCard`.
- Estructura base del servidor en Go con framework Gin.

### Corregido
- Bug de bucle infinito en el algoritmo de sorteo ante duplicados.
- Condición de carrera en el reinicio del evento (`AsyncStorage.removeItem`).
- Error de resolución de assets (iconos y splash screen).
- Error de tipos en `useEvent` para manejar IDs únicos en lugar de nombres.
