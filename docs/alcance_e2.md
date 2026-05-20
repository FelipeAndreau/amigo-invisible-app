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
- **RF-08: Revelación Segura de Participante.** El sistema debe permitir visualizar el nombre asignado solo si se accede mediante el Magic Link válido y no expirado.

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

## 4. Gestión de Excepciones y Validaciones

1. **Excepción de Duplicados:** No se puede agregar dos participantes con el mismo email en un mismo sorteo.
2. **Excepción de Autenticación:** Si el token JWT expira, el usuario es redirigido automáticamente al Login.
3. **Regla de Negocio:** El organizador puede participar en su propio sorteo, pero el sistema debe garantizar mediante el algoritmo de *derangement* que nadie se asigne a sí mismo.
4. **Validación de Link:** Si un Magic Link ya fue utilizado y la configuración del sorteo es de "un solo uso", el sistema mostrará un mensaje de "Acceso ya realizado".
