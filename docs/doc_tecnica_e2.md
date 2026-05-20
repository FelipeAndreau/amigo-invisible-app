# Documentación Técnica - Entrega 2 (E2)

## 1. Autenticación y Autorización
Se ha implementado un sistema de autenticación basado en **JWT (JSON Web Tokens)** para proteger los datos de los organizadores.

- **Mecanismo:** El servidor genera un token JWT (HS256) tras un login exitoso.
- **Seguridad:** Las contraseñas se hashean usando **Bcrypt**.
- **Roles:**
  - `Organizador`: Acceso total a sus sorteos.
  - `Invitado`: Acceso vía Magic Link (Token temporal).

## 2. Integración con Backend (API REST)

| Método | Ruta | Descripción | Request |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Registro de organizador | `{email, password}` |
| `POST` | `/api/v1/auth/login` | Login de organizador | `{email, password}` |
| `GET` | `/api/v1/events` | Listado (Protegido) | - |

## 3. Estructura de Base de Datos (PostgreSQL)
Se ha definido el esquema inicial en `server/internal/platform/db/schema.sql`:
- **Users**: Registro de organizadores.
- **Events**: Cabecera de los sorteos.
- **Participants**: Detalle y asignaciones de amigos invisibles.

## 4. Decisiones de Refactoring
1. **Lógica de Sorteo al Servidor:** Originalmente en `client/src/features/event/logic/shuffle.ts`, el algoritmo se ha migrado al backend en Go. Esto evita que un usuario curioso pueda ver los resultados inspeccionando el estado de la app antes de tiempo.
2. **Persistencia Híbrida:** Se mantiene un caché mínimo en `AsyncStorage` para mejorar la velocidad de carga (Optimistic UI), pero la "verdad" reside ahora en la base de datos remota.
3. **Deuda Técnica:** Se identifica la necesidad de implementar un sistema de colas (ej. Redis) en la E3 si el envío de correos/links crece exponencialmente.
