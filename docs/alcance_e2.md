# Documento de Alcance - Entrega 2 (E2)

## 1. Changelog del Alcance (E1 -> E2)

| ID | Cambio | Razón |
| :--- | :--- | :--- |
| **RF-01** | Sorteo Local -> Sorteo Remoto | Permitir que el sorteo se guarde en la nube para persistencia multi-dispositivo. |
| **RF-03** | Revelación en pantalla -> Revelación vía Link | Mejorar la privacidad; cada participante ve su resultado en su propio dispositivo. |
| **RF-NEW** | Autenticación de Organizador | Necesario para que un usuario pueda recuperar sus sorteos anteriores. |
| **RF-NEW** | Gestión Multi-Entidad | Permitir que un usuario cree varios grupos (ej: Familia, Trabajo, Amigos). |

## 2. Requisitos Funcionales Nuevos (RF-XX)

- **RF-05: Registro y Autenticación del Organizador.** El sistema debe permitir al usuario crear una cuenta con email/contraseña y obtener un token JWT para sesiones seguras.
- **RF-06: Dashboard de Sorteos.** El usuario autenticado debe poder ver un listado de todos los sorteos creados por él, con su estado actual (Borrador, Sorteado, Finalizado).
- **RF-07: Generación de Magic Links.** Tras realizar el sorteo, el sistema debe generar una URL única y segura para cada participante.
- **RF-09: Gestión Dinámica de Participantes.** El sistema permite agregar o eliminar participantes de un evento existente siempre que este se encuentre en estado "Borrador".
- **RF-10: Persistencia de Revelación.** El sistema registra el momento de la primera revelación y bloquea accesos posteriores para garantizar la integridad del sorteo.

## 3. User Stories (E2)

### US-05: Creación de Cuenta de Organizador
**Como** usuario frecuente de la app,
**Quiero** registrarme con mi correo electrónico,
**Para** poder guardar mis grupos y no tener que reingresar los datos cada vez.
- **Given** que el usuario no tiene una sesión activa,
- **When** ingresa un email válido y una contraseña segura,
- **Then** el sistema crea el perfil y lo redirige al Dashboard principal.

### US-06: Gestión de Múltiples Grupos
**Como** organizador de varios eventos,
**Quiero** ver una lista de todos mis sorteos activos,
**Para** controlar quién ha recibido su link y quién falta por sortear.
- **Given** que el organizador está logueado,
- **When** accede a la sección "Mis Sorteos",
- **Then** visualiza tarjetas con el nombre del evento, fecha y cantidad de participantes.

### US-07: Seguridad en la Revelación
**Como** participante de un sorteo,
**Quiero** que mi resultado sea privado,
**Para** que nadie más pueda ver a quién me toca regalar.
- **Given** que recibí mi Magic Link único,
- **When** accedo al link desde mi navegador,
- **Then** el sistema me muestra el nombre de mi amigo invisible y marca el link como "visto".

### US-08: Validación de Sorteo Mínimo
**Como** sistema de gestión,
**Quiero** impedir que se realice un sorteo con menos de 3 personas,
**Para** evitar que el resultado sea obvio por descarte.
- **Given** un evento con 2 participantes,
- **When** el organizador pulsa "Realizar Sorteo",
- **Then** el sistema muestra un error indicando que se requieren al menos 3 personas.

## 5. Requerimientos No Funcionales (RNF) — E2

### Seguridad (RNF-Seg)
- **RNF-Seg-01:** Las contraseñas de usuario deben almacenarse hasheadas con bcrypt (cost factor 10+).
- **RNF-Seg-02:** La comunicación entre cliente y servidor debe usar tokens JWT con expiración de 72 horas.
- **RNF-Seg-03:** El secreto JWT debe configurarse mediante variables de entorno (no hardcodeado en código fuente).
- **RNF-Seg-04:** Un participante solo puede ver su propia asignación; nunca la de otro participante.
- **RNF-Seg-05:** Los Magic Links de revelación son de un solo uso; una vez visitados, quedan invalidados.

### Mantenibilidad (RNF-Mant)
- **RNF-Mant-01:** El código backend debe seguir una arquitectura modular: handlers, services, repositories y models separados.
- **RNF-Mant-02:** El frontend debe usar componentes reutilizables y un design system centralizado (Theme, tokens de espaciado/colores/tipografía).
- **RNF-Mant-03:** Todo el código debe estar documentado con CHANGELOG.md y README.md actualizados.
- **RNF-Mant-04:** Las validaciones de negocio deben existir tanto en cliente como en servidor (defensa en profundidad).

### Escalabilidad (RNF-Esc)
- **RNF-Esc-01:** La base de datos debe usar índices en campos de búsqueda frecuente (users.email, events.user_id, participants.event_id).
- **RNF-Esc-02:** El sistema debe soportar múltiples eventos por usuario sin degradación del rendimiento (prueba con 50+ eventos).
- **RNF-Esc-03:** El esquema de datos debe permitir la futura adición de notificaciones push y chat sin migraciones destructivas.
- **RNF-Esc-04:** El backend debe manejar timeouts de 5 segundos en todas las peticiones HTTP para evitar bloqueos.

## 4. Gestión de Excepciones y Validaciones

1. **Excepción de Duplicados:** No se puede agregar dos participantes con el mismo email en un mismo sorteo.
2. **Excepción de Autenticación:** Si el token JWT expira, el usuario es redirigido automáticamente al Login.
3. **Regla de Negocio:** El organizador puede participar en su propio sorteo, pero el sistema debe garantizar mediante el algoritmo de *derangement* que nadie se asigne a sí mismo.
4. **Validación de Link:** Si un Magic Link ya fue utilizado y la configuración del sorteo es de "un solo uso", el sistema mostrará un mensaje de "Acceso ya realizado".
5. **Validación de Invitación:** No se puede unir a un evento que ya fue sorteado.
