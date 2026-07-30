# Documentación Técnica - Entrega 2 (E2)

## 1. Autenticación y Autorización
Se ha implementado un sistema de autenticación basado en **JWT (JSON Web Tokens)** para proteger los datos de los organizadores.

- **Mecanismo:** El servidor genera un token JWT (HS256) tras un login exitoso.
- **Seguridad:** Las contraseñas se hashean usando **Bcrypt**.
- **Roles:**
  - `Organizador`: Acceso total a sus sorteos.
  - `Invitado`: Acceso vía Magic Link (Token temporal).

## 2. Integración con Backend (API REST)

### 2.1 Endpoints de Autenticación
| Método | Ruta | Descripción | Request | Auth |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Registro de usuario | `{email, password}` | No |
| `POST` | `/api/v1/auth/login` | Login de usuario | `{email, password}` | No |

### 2.2 Endpoints de Eventos (Organizador)
| Método | Ruta | Descripción | Request | Auth |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/events` | Listar eventos creados | - | Sí (JWT) |
| `POST` | `/api/v1/events` | Crear evento | `{name, organizer_display_name}` | Sí (JWT) |
| `DELETE` | `/api/v1/events/:id` | Eliminar evento | - | Sí (JWT) |
| `POST` | `/api/v1/events/:id/shuffle` | Ejecutar sorteo | - | Sí (JWT) |
| `DELETE` | `/api/v1/events/:id/participants/:pid` | Eliminar participante | - | Sí (JWT) |
| `PATCH` | `/api/v1/events/:id/date` | Setear fecha del evento | `{event_date}` | Sí (JWT) |

### 2.3 Endpoints de Participantes
| Método | Ruta | Descripción | Request | Auth |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/events/join` | Unirse a evento con código | `{code, name}` | Sí (JWT) |
| `GET` | `/api/v1/events/participating` | Listar eventos donde participo | - | Sí (JWT) |
| `GET` | `/api/v1/events/:id/participants` | Listar participantes del evento | - | Sí (JWT) |
| `GET` | `/api/v1/events/:id/my-assignment` | Ver mi asignación | - | Sí (JWT) |
| `GET` | `/api/v1/events/:id/my-assignment/preferences` | Ver preferencias de mi asignado | - | Sí (JWT) |

### 2.4 Endpoints de Preferencias y Regalo
| Método | Ruta | Descripción | Request | Auth |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/events/:id/preferences` | Guardar mis preferencias | `{favorite_color, clothing_size, ...}` | Sí (JWT) |
| `POST` | `/api/v1/events/:id/gift-progress` | Guardar progreso de regalo | `{purchased, wrapped, delivered}` | Sí (JWT) |
| `GET` | `/api/v1/events/:id/gift-progress` | Ver mi progreso de regalo | - | Sí (JWT) |
| `GET` | `/api/v1/events/:id/date` | Obtener fecha del evento | - | Sí (JWT) |

### 2.5 Endpoints de Galería y Mensajes
| Método | Ruta | Descripción | Request | Auth |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/events/:id/gallery` | Subir foto a la galería | `{photo_data, caption}` | Sí (JWT) |
| `GET` | `/api/v1/events/:id/gallery` | Listar fotos del evento | - | Sí (JWT) |
| `GET` | `/api/v1/events/:id/messages` | Listar mensajes del chat | - | Sí (JWT) |
| `POST` | `/api/v1/events/:id/messages` | Enviar mensaje al chat | `{content}` | Sí (JWT) |
| `GET` | `/api/v1/events/history` | Historial de eventos pasados | - | Sí (JWT) |

### 2.6 Endpoints de Amigos
| Método | Ruta | Descripción | Request | Auth |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/friends` | Listar amigos | - | Sí (JWT) |
| `POST` | `/api/v1/friends` | Agregar amigo | `{name, email}` | Sí (JWT) |
| `DELETE` | `/api/v1/friends/:id` | Eliminar amigo | - | Sí (JWT) |

### 2.7 Endpoints de Salud
| Método | Ruta | Descripción | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Health check del servidor | No |

## 3. Estructura de Base de Datos (PostgreSQL)
Se ha definido el esquema final en `server/internal/platform/db/schema.sql`:
- **Users**: Almacena credenciales (hashing Bcrypt) de organizadores.
- **Events**: Cabecera con estados `draft` y `shuffled`.
- **Participants**: Incluye `revealed_at` para control de un solo uso.

## 4. Decisiones de Refactoring
1. **Lógica de Sorteo al Servidor:** Originalmente en `client/src/features/event/logic/shuffle.ts`, el algoritmo se ha migrado al backend en Go. Esto evita que un usuario curioso pueda ver los resultados inspeccionando el estado de la app antes de tiempo.
2. **Persistencia Híbrida:** Se mantiene un caché mínimo en `AsyncStorage` para mejorar la velocidad de carga (Optimistic UI), pero la "verdad" reside ahora en la base de datos remota.
3. **Deuda Técnica:** Se identifica la necesidad de implementar un sistema de colas (ej. Redis) en la E3 si el envío de correos/links crece exponencialmente.
