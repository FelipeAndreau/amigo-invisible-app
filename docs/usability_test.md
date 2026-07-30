# Test de Usabilidad - Amigo Invisible (E3)

**Fecha**: 2026-07-28

**Facilitador**: Melissa Braunstein

**Participante**: Persona externa al equipo (usuario objetivo, 28 años, familiarizado con apps móviles).

**Entorno**: Expo Go en Android, backend levantado localmente (`docker compose up -d database backend`).

**Duración**: 25 minutos

---

## 1. Objetivo

Evaluar la facilidad de uso del flujo completo de E3:

1. Registro e inicio de sesión.
2. Creación de un grupo y generación de código de invitación.
3. Unión a un grupo desde otra cuenta.
4. Creación de un evento dentro del grupo.
5. Realización del sorteo.
6. Uso del chat entre participantes.

---

## 2. Tareas Asignadas

| # | Tarea | Criterio de éxito |
|---|---|---|
| 1 | Crear una cuenta e iniciar sesión. | Completa registro y ve el dashboard. |
| 2 | Crear un grupo llamado "Trabajo". | El grupo aparece en la lista con un código de invitación. |
| 3 | Copiar/compartir el código del grupo. | El código es visible y copiable. |
| 4 | Desde otra cuenta, unirse al grupo con el código. | Ve el grupo y los miembros correctamente. |
| 5 | Crear un evento "Intercambio de fin de año" dentro del grupo. | El evento aparece en el detalle del grupo. |
| 6 | Agregar al menos 3 participantes y sortear. | El sorteo se completa sin errores. |
| 7 | Enviar un mensaje en el chat del evento. | El mensaje aparece para todos los participantes. |

---

## 3. Observaciones

### Tarea 1 - Registro / Login
- ✅ Completó el registro en menos de 1 minuto.
- ⚠️ Sugirió que el mensaje de error de contraseña débil aparezca antes de tocar "Registrarse".

### Tarea 2 - Crear grupo
- ✅ Encontró el botón de grupos desde el dashboard sin ayuda.
- ✅ Completó el formulario en 30 segundos.
- ✅ El código de invitación fue visible inmediatamente.

### Tarea 3 - Compartir código
- ✅ Usó el botón de copiar sin problemas.
- 💡 Sugirió agregar un botón de "Compartir por WhatsApp" nativo.

### Tarea 4 - Unirse a grupo
- ✅ Ingresó el código correctamente a la primera.
- ⚠️ Dudó unos segundos porque no había feedback inmediato al tocar "Unirse" (falta spinner).

### Tarea 5 - Crear evento en grupo
- ✅ Llegó al formulario desde el detalle del grupo.
- ✅ Completó nombre y fecha.
- ⚠️ No entendió a primera vista que el evento quedaba vinculado automáticamente al grupo.

### Tarea 6 - Sorteo
- ✅ Agregó 3 participantes.
- ✅ Realizó el sorteo sin errores.
- ✅ Entendió que cada uno ve solo su asignación.

### Tarea 7 - Chat
- ✅ Envió y recibió mensajes entre dos dispositivos.
- ✅ Distinguió sus mensajes de los ajenos.
- ⚠️ El scroll no bajó automáticamente al enviar un mensaje; tuvo que desplazarse manualmente.

---

## 4. Problemas Encontrados

| # | Problema | Severidad | Pantalla afectada |
|---|---|---|---|
| 1 | Falta feedback de carga al unirse a grupo. | Media | `JoinGroupScreen` |
| 2 | Scroll automático del chat no funciona al enviar. | Alta | `ChatScreen` |
| 3 | No queda claro que el evento se crea dentro del grupo. | Media | `GroupDetailScreen` / `CreateEventScreen` |
| 4 | Validación de contraseña reactiva tardía. | Baja | `LoginScreen` |

---

## 5. Mejoras Aplicadas

- Se agregó un spinner en `JoinGroupScreen` mientras se valida el código.
- Se corrigió el scroll automático en `ChatScreen` para que baje al último mensaje.
- Se agregó un label "Evento del grupo: [nombre]" en `CreateEventScreen` cuando viene desde un grupo.
- Se mejoró el mensaje de error de validación de contraseña para que aparezca on-blur.

---

## 6. Conclusiones

- El flujo principal de E3 (grupos + eventos + sorteo + chat) es comprensible para un usuario externo.
- Las 7 tareas se completaron sin intervención del facilitador.
- Los principales puntos de fricción fueron micro-interacciones (feedback de carga, scroll, claridad de contexto), no el flujo en sí.
- La app está en condiciones de ser presentada como producto final.

---

## 7. Evidencia

- Grabación de pantalla de la sesión: disponible en Google Drive del equipo.
- Notas manuscritas del facilitador: adjuntas en Drive.