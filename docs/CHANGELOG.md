# Changelog - Amigo Invisible

## [0.2.0] - 2026-06-11
### Entrega 2: Escalado Funcional (Online + Multi-Evento)

### Añadido
- **Autenticación JWT**: Sistema de registro/login con tokens JWT (72h expiración) y contraseñas hasheadas con bcrypt.
- **Dashboard de Eventos**: Pantalla de listado con estados (Borrador, Sorteado), fechas y conteo de participantes.
- **Gestión Multi-Evento**: Crear, listar y eliminar múltiples eventos de Amigo Invisible.
- **Sistema de Invitaciones**: Generar códigos de invitación para eventos y permitir que participantes se unan con código.
- **Magic Links**: Links únicos de revelación para cada participante, de un solo uso.
- **Revelación Web**: Pantalla pública `RevealPublicScreen` con animaciones y manejo de estados (loading, error, usado).
- **Validaciones de Cliente**: Utilidades de validación para email, contraseña, nombres de eventos y participantes.
- **Manejo de Errores de Red**: Timeouts de 5 segundos, reintentos automáticos y mensajes descriptivos en español.
- **Variables de Entorno**: `.env.example` para servidor (JWT_SECRET, DB) y cliente (API_URL).
- **RNF Documentados**: Seguridad (bcrypt, JWT, protección de datos), Mantenibilidad (arquitectura modular), Escalabilidad (índices DB, timeouts).
- **Entrega de IA**: `/ia/entrega-2/` con índice de skills y logs de conversaciones.

### Corregido
- JWT secret hardcodeado movido a variables de entorno.
- IP del backend hardcodeada documentada con instrucciones de configuración.
- Validación de fortaleza de contraseña (8+ chars, mayúscula, minúscula, número).
- Manejo de errores de fetch con JSON parsing seguro.

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
