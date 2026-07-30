# Documento de Alcance Final - Amigo Invisible

## 1. Descripción del Producto

**Amigo Invisible** es una aplicación móvil para organizar sorteos de regalos de forma remota, segura y multi-dispositivo.

### Problema que resuelve
Organizar un sorteo de Amigo Invisible de forma presencial o manual es difícil cuando los participantes no están físicamente juntos. La app permite crear sorteos, invitar participantes mediante códigos, realizar el sorteo de forma secreta en el servidor y que cada persona vea privadamente a quién le debe regalar.

### Usuarios principales
- **Organizadores**: crean eventos, invitan personas y gestionan el sorteo.
- **Participantes**: se unen a eventos con un código, completan sus preferencias y descubren a su amigo invisible.

### ¿Por qué una app móvil?
Los participantes necesitan acceder al resultado de forma privada desde su propio dispositivo, recibir notificaciones y chatear dentro del contexto del evento.

---

## 2. Requisitos Funcionales (RF) - Estado Final

| ID | Requisito | Estado | Entrega |
| :--- | :--- | :--- | :--- |
| RF-01 | Crear un evento de Amigo Invisible | Completado | E1 |
| RF-02 | Agregar/eliminar participantes (mínimo 3) | Completado | E1/E2 |
| RF-03 | Realizar sorteo aleatorio sin auto-regalo | Completado | E1/E2 |
| RF-04 | Revelar asignación de forma privada | Completado | E2 |
| RF-05 | Registro y autenticación con JWT | Completado | E2 |
| RF-06 | Dashboard de eventos (organizador y participante) | Completado | E2 |
| RF-07 | Generar códigos de invitación para eventos | Completado | E2 |
| RF-08 | Unirse a un evento con código de invitación | Completado | E2 |
| RF-09 | Guardar preferencias de regalo | Completado | E2 |
| RF-10 | Registrar progreso del regalo (comprado, envuelto, entregado) | Completado | E2 |
| RF-11 | Chat dentro del evento | Completado | E3 |
| RF-12 | Galería de fotos del evento | Completado | E2 |
| RF-13 | Gestión de contactos/amigos | Completado | E2 |
| RF-14 | Historial de eventos | Completado | E2 |
| RF-15 | **Crear grupos/círculos de usuarios** | Completado | **E3** |
| RF-16 | **Unirse a un grupo con código de invitación** | Completado | **E3** |
| RF-17 | **Crear eventos vinculados a un grupo** | Completado | **E3** |
| RF-18 | **Ver miembros y eventos de un grupo** | Completado | **E3** |

---

## 3. User Stories Finales

### US-01: Crear un sorteo
**Como** organizador, **quiero** crear un evento, **para** iniciar un intercambio de regalos.
- **Given**: estoy logueado.
- **When**: ingreso el nombre del sorteo y mi nombre de participante.
- **Then**: el sistema crea el evento y me muestra el código de invitación.

### US-02: Unirse a un sorteo
**Como** invitado, **quiero** unirme con un código, **para** participar.
- **Given**: tengo una cuenta y un código de invitación.
- **When**: ingreso el código y mi nombre.
- **Then**: el sistema me agrega al evento y puedo verlo en mi dashboard.

### US-03: Ver mi asignación
**Como** participante, **quiero** saber a quién le toca regalar, **para** comprar el regalo.
- **Given**: el evento ya fue sorteado.
- **When**: ingreso al detalle del evento.
- **Then**: veo el nombre de mi amigo invisible.

### US-04: Crear un grupo
**Como** usuario frecuente, **quiero** crear grupos (familia, trabajo, amigos), **para** organizar múltiples sorteos con las mismas personas.
- **Given**: estoy logueado.
- **When**: creo un grupo con nombre.
- **Then**: el sistema genera un código de invitación para el grupo.

### US-05: Unirse a un grupo
**Como** usuario, **quiero** unirme a un grupo con un código, **para** compartir eventos con ese círculo.
- **Given**: tengo un código de grupo.
- **When**: ingreso el código.
- **Then**: el sistema me agrega al grupo y veo sus eventos.

### US-06: Chatear en un evento
**Como** participante, **quiero** enviar mensajes en el evento, **para** coordinar detalles sin revelar la asignación.
- **Given**: soy participante de un evento.
- **When**: escribo un mensaje.
- **Then**: el mensaje aparece en el chat para todos los participantes.

---

## 4. Requerimientos No Funcionales (RNF)

### Seguridad
- **RNF-Seg-01**: Contraseñas hasheadas con bcrypt.
- **RNF-Seg-02**: Autenticación JWT con expiración de 72 horas.
- **RNF-Seg-03**: Secreto JWT por variable de entorno.
- **RNF-Seg-04**: Cada usuario solo ve su propia asignación.
- **RNF-Seg-05**: Solo participantes de un evento pueden acceder al chat.

### Mantenibilidad
- **RNF-Mant-01**: Backend modular por dominios (auth, event, friends, messages, groups).
- **RNF-Mant-02**: Frontend organizado por features con componentes compartidos.
- **RNF-Mant-03**: Documentación completa y CHANGELOG actualizado.

### Escalabilidad
- **RNF-Esc-01**: Índices en campos de búsqueda frecuente.
- **RNF-Esc-02**: Sistema de migraciones incremental sin destruir datos.
- **RNF-Esc-03**: Timeout de 5 segundos en peticiones del cliente.

### UX/UI
- **RNF-UX-01**: Estados de carga, error y vacío en todas las pantallas.
- **RNF-UX-02**: Áreas táctiles mínimas de 48x48 dp.
- **RNF-UX-03**: Tipografía legible (mínimo 14sp para cuerpo).

---

## 5. Mapa de Funcionalidades (Feature Map)

```
Amigo Invisible
├── Autenticación
│   ├── Registro
│   ├── Login
│   └── Logout
├── Eventos
│   ├── Crear evento
│   ├── Eliminar evento
│   ├── Unirse a evento
│   ├── Realizar sorteo
│   ├── Ver asignación
│   ├── Preferencias de regalo
│   ├── Progreso de regalo
│   ├── Galería de fotos
│   ├── Chat
│   └── Historial
├── Grupos (E3)
│   ├── Crear grupo
│   ├── Unirse a grupo
│   ├── Ver miembros
│   └── Ver eventos del grupo
├── Contactos
│   ├── Agregar amigo
│   └── Eliminar amigo
└── Perfil
    └── Ver eventos organizados / participando
```

---

## 6. Funcionalidades Out-of-Scope

| Funcionalidad | Motivo |
| :--- | :--- |
| Notificaciones push | Requiere servicio externo (Firebase/APNs) y configuración adicional; se deja para futura versión. |
| WebSocket para chat | El chat actual usa polling REST; WebSocket mejora la experiencia pero aumenta la complejidad infraestructural. |
| Envío de emails/SMS | Los códigos de invitación se comparten manualmente por ahora. |
| Pago o e-commerce | Fuera del alcance del proyecto académico. |
| App nativa publicada en stores | El alcance se limita a desarrollo con Expo Go; build de producción opcional. |

---

## 7. Gestión de Excepciones y Reglas de Negocio

1. **Mínimo de participantes**: un sorteo requiere al menos 3 participantes.
2. **No auto-regalo**: el algoritmo de sorteo garantiza que nadie se asigne a sí mismo (derangement).
3. **Eventos sorteados**: no se pueden agregar ni eliminar participantes después del sorteo.
4. **Unión a grupos**: solo usuarios autenticados pueden unirse con un código válido.
5. **Expulsión de miembros**: solo el creador del grupo puede expulsar miembros, y nunca puede expulsarse a sí mismo.
6. **Chat privado**: solo participantes del evento pueden leer y escribir mensajes.

---

## 8. Changelog del Alcance (E2 -> E3)

| ID | Cambio | Razón |
| :--- | :--- | :--- |
| RF-15 a RF-18 | Nuevo módulo de Grupos | Expandir verticalmente el dominio: grupos contienen múltiples eventos. |
| RF-11 | Chat real conectado | Reemplazar placeholder/mock por funcionalidad real vía API. |
| RNF-UX | Pulido de UX/UI | Estados de carga/error/vacío, design system final y testing de usabilidad. |
