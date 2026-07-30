# Plan de Trabajo - Entrega 3

## Objetivo
Entregar el **producto final escalado** de **Amigo Invisible**, con foco en:

- **Expansión vertical del dominio**: introducción de **Grupos / Círculos** de usuarios.
- **Pulido profesional**: chat real, UX/UI final, performance, seguridad.
- **Documentación completa**: alcance final, técnica final, Figma final, evidencia de IA.
- **Video demo final** y testing de usabilidad.

---

## Estrategia de branches

Base: `entrega-2` (incluye fixes locales guardados).  
Rama de integración E3: `entrega-3`.  
Ramas individuales:

- `e3-felipe`
- `e3-melissa`
- `e3-santi`
- `e3-pilar`
- `e3-pia`

Cada integrante trabaja en su rama y mergea a `entrega-3`. Al final, `entrega-3` se mergea a `main`.

---

## Feature vertical: Grupos / Círculos

### Concepto
Un usuario puede crear **grupos** (familia, trabajo, amigos) y, dentro de cada grupo, crear múltiples eventos de Amigo Invisible a lo largo del tiempo.

**Jerarquía E3:**

```
Usuario
  └── Grupo
        └── Evento
              └── Participantes
              └── Mensajes
              └── Galería
              └── Regalo
```

### Modelo de datos propuesto

#### Tabla `groups`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador del grupo |
| `name` | TEXT | Nombre del grupo |
| `created_by` | UUID FK users | Creador del grupo |
| `invite_code` | TEXT UNIQUE | Código para unirse al grupo |
| `created_at` | TIMESTAMP | Fecha de creación |

#### Tabla `group_members`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador |
| `group_id` | UUID FK groups | Grupo al que pertenece |
| `user_id` | UUID FK users | Miembro |
| `joined_at` | TIMESTAMP | Fecha de unión |

#### Modificación `events`

Agregar columna `group_id UUID REFERENCES groups(id) ON DELETE SET NULL`.

### Endpoints backend propuestos

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/v1/groups` | Crear grupo |
| GET | `/api/v1/groups` | Listar mis grupos |
| GET | `/api/v1/groups/:id` | Detalle de grupo |
| POST | `/api/v1/groups/:id/join` | Unirse a grupo por código |
| GET | `/api/v1/groups/:id/members` | Miembros del grupo |
| DELETE | `/api/v1/groups/:id/members/:userId` | Expulsar miembro (solo creador) |
| GET | `/api/v1/groups/:id/events` | Eventos del grupo |

### Pantallas frontend propuestas

- `GroupsScreen`: lista de grupos del usuario.
- `CreateGroupScreen`: formulario para crear grupo.
- `GroupDetailScreen`: detalle del grupo, miembros, eventos del grupo.
- `JoinGroupScreen`: ingresar código de invitación al grupo.
- Modificar `CreateEventScreen`: permitir elegir grupo opcional.
- Modificar `DashboardScreen`: mostrar eventos por grupo o agrupados.

---

## Feature de pulido: Chat real

El backend ya soporta chat real:

- `GET /api/v1/events/:id/messages`
- `POST /api/v1/events/:id/messages`

### Tareas frontend

- Reemplazar el placeholder/mock del chat por llamadas reales a la API.
- Implementar polling cada 3 segundos para nuevos mensajes.
- Mostrar mensajes propios vs. mensajes de otros participantes.
- Renderizar mensajes de sistema (sorteo, regalo) centrados.
- Manejar estado de carga y error.
- Scroll automático al último mensaje.

### Posible mejora backend

- Agregar paginación a `GET /events/:id/messages` (opcional, no crítico para E3).

---

## División de tareas por integrante

| Integrante | Responsabilidad principal | Tareas |
|---|---|---|
| **Felipe** | Backend + API final | Migraciones de grupos, endpoints de grupos, ajustes de chat, Swagger/OpenAPI, tests de backend, refactor final. |
| **Melissa** | UX/UI + Figma final | Pantallas de grupos en Figma, design system final, pulido de componentes, testing de usabilidad, guía de estilo. |
| **Santi** | Frontend features | Implementar pantallas de grupos, integrar chat real, modificar dashboard, manejo de estados. |
| **Pilar** | Documentación técnica | `doc_tecnica_final.pdf`, Swagger, diagramas de secuencia, seguridad, performance, `README.md`, `CHANGELOG.md`. |
| **Pia** | Alcance + IA + video | `alcance_final.pdf`, feature map, User Stories finales, `.cm` final, reflexiones, guión y grabación del video demo. |

---

## Entregables de la guía E3

| Entregable | Responsable | Estado |
|---|---|---|
| `alcance_final.pdf` | Pia | Pendiente |
| Figma final (todas las pantallas) | Melissa | Pendiente |
| Evidencia testing de usabilidad | Melissa | Pendiente |
| `doc_tecnica_final.pdf` | Pilar | Pendiente |
| `README.md` completo | Pilar | Pendiente |
| `CHANGELOG.md` (historial E1+E2+E3) | Pia | Pendiente |
| Video demo final (3-5 min) | Pia + todos | Pendiente |
| `.cm` final completo | Todos | Pendiente |
| Lista de skills de IA | Pia | Pendiente |
| Reflexión individual (1 pág. por integrante) | Cada uno | Pendiente |
| Rama `main/master` final | Todos | Pendiente |

---

## Cronograma sugerido

| Semana | Tareas |
|---|---|
| **Semana 1** | Felipe: backend de grupos. Santi: estructura frontend de grupos. Melissa: Figma de grupos. Pilar/Pia: inicio de documentación. |
| **Semana 2** | Santi: integrar chat real + conectar grupos. Felipe: ajustes de API y Swagger. Melissa: pulido de UI y design system. Pilar: doc técnica. Pia: alcance final. |
| **Semana 3** | Testing de usabilidad, correcciones de UX, pruebas end-to-end. |
| **Semana 4** | Merge final a `main`, video demo, revisión de `.cm`, entrega de documentación. |

---

## Notas técnicas

- El backend ya usa JWT, bcrypt y PostgreSQL.
- El chat real ya existe en el backend; solo falta conectarlo en el frontend.
- La expansión vertical debe ser **grupos**, no historial ni notificaciones, para mantener el foco.
- Para evitar regresiones, todos los flujos de E2 deben seguir funcionando.
- El desarrollo se prueba con `npm run start:lan` en el cliente y `docker compose up -d database backend` en el servidor.

---

## Comandos de git para el equipo

```bash
# Antes de empezar a trabajar
git checkout e3-<nombre>
git pull origin entrega-3
git rebase entrega-3

# Cuando terminás una tarea
git add .
git commit -m "feat: descripción clara"
git push origin e3-<nombre>

# Merge a entrega-3 (una vez aprobado)
git checkout entrega-3
git pull origin entrega-3
git merge e3-<nombre>
git push origin entrega-3
```

---

## Definición de listo (Definition of Done)

- Código compila y la app levanta.
- Los flujos de E2 no se rompen.
- Los cambios están en la rama `e3-<nombre>` y pusheados.
- Se documentó lo nuevo en el archivo correspondiente si aplica.
