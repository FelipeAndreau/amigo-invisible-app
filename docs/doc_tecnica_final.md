# Documentación Técnica Final - Amigo Invisible

## 1. Resumen del Stack Tecnológico

| Capa | Tecnología | Versión / Detalle |
|------|------------|-------------------|
| Frontend móvil | React Native + Expo | Expo SDK ~54.0.35, React 19.1.0, React Native 0.81.5 |
| Navegación | React Navigation | Stack navigator nativo |
| Backend | Go (Golang) | 1.25.0 |
| Router HTTP | Gin | v1.12.0 |
| Base de datos | PostgreSQL | 16-alpine |
| Driver DB | lib/pq | v1.12.3 |
| Autenticación | JWT + Bcrypt | golang-jwt/jwt/v5, golang.org/x/crypto |
| Almacenamiento local | Secure Store / Async Storage | expo-secure-store v15.0.8 |
| DevOps | Docker Compose V2 | Servicios `backend`, `frontend`, `database` |
| Hot reload backend | Air | v1.61.7 |
| Tests | Jest + ts-jest | Validaciones del cliente y lógica de shuffle en Go |

---

## 2. Arquitectura General

La aplicación sigue una arquitectura **cliente-servidor** con comunicación REST/JSON.

```
┌─────────────────┐      HTTP/REST      ┌─────────────────┐
│   Expo Client   │ ◄──────────────────► │  Backend (Go)   │
│  React Native   │    Bearer JWT       │   Gin + lib/pq  │
└─────────────────┘                     └────────┬────────┘
                                                  │
                                                  ▼
                                          ┌─────────────────┐
                                          │   PostgreSQL    │
                                          │   (Docker)      │
                                          └─────────────────┘
```

### Organización del Backend
- **`internal/auth`**: registro, login y middleware JWT.
- **`internal/event`**: lógica de eventos, sorteo, preferencias, progreso de regalo, galería.
- **`internal/friends`**: gestión de contactos/amigos.
- **`internal/messages`**: chat de eventos.
- **`internal/groups`**: **nuevo en E3**, gestión de grupos/círculos.
- **`internal/platform`**: utilidades compartidas (JWT, DB).

### Organización del Frontend
- **`src/features/auth`**: login/registro.
- **`src/features/event`**: dashboard, creación de eventos, detalle, sorteo, preferencias, etc.
- **`src/features/chat`**: chat real.
- **`src/features/friends`**: contactos.
- **`src/features/groups`**: **nuevo en E3**, pantallas de grupos.
- **`src/shared`**: componentes, tema, utilidades, hooks.

---

## 3. Autenticación y Autorización

- **JWT**: tokens HS256 con expiración de 72 horas.
- **Bcrypt**: contraseñas hasheadas antes de persistir.
- **Middleware `AuthMiddleware`**: protege rutas inyectando `userID` en el contexto de Gin.
- **Autorización por recurso**: cada endpoint verifica que el usuario autenticado sea organizador o participante del recurso solicitado.

---

## 4. API REST Completa

### 4.1 Autenticación
| Método | Ruta | Descripción | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Registro de usuario | No |
| `POST` | `/api/v1/auth/login` | Login de usuario | No |

### 4.2 Eventos
| Método | Ruta | Descripción | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/events` | Listar eventos creados | Sí |
| `POST` | `/api/v1/events` | Crear evento (opcional `group_id`) | Sí |
| `DELETE` | `/api/v1/events/:id` | Eliminar evento | Sí |
| `POST` | `/api/v1/events/:id/shuffle` | Ejecutar sorteo | Sí |
| `DELETE` | `/api/v1/events/:id/participants/:pid` | Eliminar participante | Sí |
| `GET` | `/api/v1/events/participating` | Listar eventos donde participo | Sí |
| `GET` | `/api/v1/events/:id/my-assignment` | Ver mi asignación | Sí |
| `POST` | `/api/v1/events/join` | Unirse a evento con código | Sí |
| `POST` | `/api/v1/events/:id/preferences` | Guardar preferencias | Sí |
| `GET` | `/api/v1/events/:id/my-assignment/preferences` | Ver preferencias de mi asignado | Sí |
| `POST` | `/api/v1/events/:id/gift-progress` | Guardar progreso de regalo | Sí |
| `GET` | `/api/v1/events/:id/gift-progress` | Ver progreso de regalo | Sí |
| `PATCH` | `/api/v1/events/:id/date` | Setear fecha del evento | Sí |
| `GET` | `/api/v1/events/:id/date` | Obtener fecha del evento | Sí |
| `POST` | `/api/v1/events/:id/gallery` | Subir foto | Sí |
| `GET` | `/api/v1/events/:id/gallery` | Listar fotos | Sí |
| `GET` | `/api/v1/events/history` | Historial de eventos | Sí |

### 4.3 Chat
| Método | Ruta | Descripción | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/events/:id/messages` | Listar mensajes | Sí |
| `POST` | `/api/v1/events/:id/messages` | Enviar mensaje | Sí |

### 4.4 Amigos
| Método | Ruta | Descripción | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/friends` | Listar amigos | Sí |
| `POST` | `/api/v1/friends` | Agregar amigo | Sí |
| `DELETE` | `/api/v1/friends/:id` | Eliminar amigo | Sí |

### 4.5 Grupos (E3)
| Método | Ruta | Descripción | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/groups` | Crear grupo | Sí |
| `GET` | `/api/v1/groups` | Listar mis grupos | Sí |
| `GET` | `/api/v1/groups/:id` | Detalle de grupo | Sí |
| `POST` | `/api/v1/groups/join` | Unirse a grupo por código | Sí |
| `GET` | `/api/v1/groups/:id/members` | Miembros del grupo | Sí |
| `DELETE` | `/api/v1/groups/:id/members/:user_id` | Expulsar miembro | Sí |
| `GET` | `/api/v1/groups/:id/events` | Eventos del grupo | Sí |

### 4.6 Salud
| Método | Ruta | Descripción | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Health check | No |

---

## 5. Seguridad y Manejo de Datos

### Datos almacenados
- **Usuarios**: email y hash de contraseña (bcrypt).
- **Eventos**: nombre, estado, código de invitación, fecha, `group_id` opcional.
- **Participantes**: nombre, `user_id` opcional, `assigned_to`, token de acceso.
- **Mensajes**: contenido, tipo (`user` o `system`), `event_id`, `user_id`.
- **Grupos**: nombre, creador, código de invitación.

### Medidas de seguridad
- Contraseñas nunca se almacenan en texto plano.
- Validación de fortaleza de contraseña en cliente y servidor.
- JWT con secreto por variable de entorno (`JWT_SECRET`).
- CORS configurado para desarrollo (se recomienda restringir en producción).
- Verificación de autorización en cada endpoint protegido.
- Sorteo ejecutado en el servidor para evitar inspección del cliente.

---

## 6. Performance y Optimizaciones

- **Índices** en campos de búsqueda frecuente: `users.email`, `events.user_id`, `events.group_id`, `events.invite_code`, `participants.event_id`, `messages.event_id`, `groups.invite_code`.
- **Timeout de red** de 5 segundos en el cliente para evitar bloqueos.
- **Polling controlado** en chat: 3 segundos entre actualizaciones.
- **Lazy loading** potencial mediante React Navigation (las pantallas se montan bajo demanda).
- **Docker con hot-reload** acelera el desarrollo backend.

---

## 7. Diagramas de Secuencia

### 7.1 Crear grupo y evento dentro del grupo

```
Usuario                     Frontend         Backend              DB
  |                            |                |                  |
  |--> Crear grupo             |                |                  |
  |         POST /groups ----->|                |                  |
  |                            |---- POST /groups ---------------> INSERT groups, group_members
  |                            |<--- {group_id, invite_code} -----|
  |<-- Mostrar código          |                |                  |
  |                            |                |                  |
  |--> Crear evento en grupo   |                |                  |
  |   POST /events {group_id}->|                |                  |
  |                            |--- POST /events ----------------> INSERT events
  |                            |<-- {event_id, invite_code} -----|
  |<-- Evento creado           |                |                  |
```

### 7.2 Flujo de chat

```
Usuario A                   Frontend         Backend              DB
  |                            |                |                  |
  |--> Enviar mensaje          |                |                  |
  |  POST /events/:id/messages>|                |                  |
  |                            |--- POST /events/:id/messages --> INSERT messages
  |                            |<-- {id, message} ---------------|
  |<-- Mensaje enviado         |                |                  |
  |                            |                |                  |
  |                            |<--- Polling cada 3s ------------ SELECT messages
  |<-- Mensajes actualizados   |                |                  |
```

---

## 8. Decisiones de Refactoring

1. **Sorteo en servidor**: se migró desde el cliente al backend para garantizar confidencialidad.
2. **Persistencia de `user_id` en el cliente**: se agregó a `SecureStore` para personalizar la UI (chat, permisos).
3. **Nueva entidad `groups`**: expansión vertical del dominio sin romper eventos existentes (`group_id` nullable).
4. **Sistema de migraciones incremental**: todas las nuevas tablas y columnas se aplican mediante migraciones numeradas, evitando destruir datos en entornos existentes.
5. **Pin de versiones en Docker**: `Go 1.25-alpine` y `Air v1.61.7` para builds reproducibles.

---

## 9. Deuda Técnica y Trabajo Futuro

- Implementar WebSocket para chat en tiempo real y reducir polling.
- Agregar paginación a listados grandes (mensajes, eventos, grupos).
- Notificaciones push para sorteos, nuevos participantes y mensajes.
- Tests de integración end-to-end.
- Subir imágenes a servicio de almacenamiento externo en lugar de base64 en la base de datos.