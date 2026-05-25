# Documento de Alcance - Entrega 1: MVP Básico

**Proyecto:** Mi Amigo Invisible
**Plataforma:** React Native (Expo)

## 1. Descripción del problema

**¿Qué problema resuelve la app?**
La organización tradicional del juego "Amigo Invisible" suele ser desordenada: los papeles físicos se pierden, ocurre con frecuencia que un integrante se sortea a sí mismo (obligando a reiniciar todo el proceso), y resulta complejo coordinar las reglas o mantener el anonimato. La aplicación digitaliza y centraliza este proceso, automatizando el sorteo para garantizar una aleatoriedad perfecta (sin auto-asignaciones) y facilitando una gestión segura de la información de los participantes desde la palma de la mano.

**¿A quién está dirigida?**
A grupos de amigos, familiares, compañeros de oficina o estudiantes universitarios que deseen organizar intercambios de regalos de forma ágil, transparente y sin fricciones.

**¿Por qué una app móvil y no otra solución?**
El sorteo presencial mediante la modalidad "pasa el dispositivo" requiere accesibilidad inmediata y una experiencia táctil intuitiva. Además, el smartphone es un dispositivo personal por excelencia, lo que resulta fundamental para asegurar la privacidad en el momento en que cada usuario revela en la pantalla a quién debe hacerle el regalo.

## 2. Requerimientos Funcionales (RF)

### Alcance E1 (MVP Local):

*   **RF-01:** El sistema debe permitir al usuario crear un evento de "Amigo Invisible" asignándole un nombre identificatorio.
*   **RF-02:** El sistema debe permitir agregar nombres de participantes a la lista del evento actual.
*   **RF-03:** El sistema debe ejecutar un algoritmo de asignación aleatoria, garantizando de forma lógica que ningún participante se sortee a sí mismo.
*   **RF-04:** El sistema debe presentar una interfaz de revelación privada, donde el nombre asignado permanezca oculto hasta que el usuario correspondiente presione un botón en la pantalla.
*   **RF-05:** El sistema debe persistir los datos de los participantes y el resultado del sorteo de forma local (utilizando AsyncStorage) para evitar la pérdida de progreso si la aplicación se cierra inesperadamente.

### Backlog (Para implementarse en E2 y E3):

*   **E2 (Expansión horizontal):** Registro y autenticación de usuarios en la nube, integración con base de datos externa para crear grupos online de múltiples dispositivos, y envío de mensajes/pistas unidireccionales (del regalador al receptor).
*   **E3 (Expansión vertical):** Gestión completa del ciclo de vida de múltiples partidas, notificaciones push (fechas límite, nuevos mensajes) y sistema de chat privado bidireccional completamente anónimo.

## 3. Requerimientos No Funcionales (RNF)

*   **Plataforma objetivo:** Aplicación desarrollada en React Native (mediante Expo), garantizando compatibilidad multiplataforma nativa para Android e iOS.
*   **Rendimiento esperado:** Las transiciones de interfaz, la carga de pantalla y la ejecución del algoritmo de sorteo deben completarse en menos de 2 segundos.
*   **Requisitos de conectividad:** Para este MVP (Entrega 1), la aplicación debe operar bajo un esquema offline first, ejecutando toda su lógica y almacenamiento sin requerir conexión a internet.
*   **Idioma y Accesibilidad:** La interfaz gráfica estará íntegramente en español. Contará con tipografía legible (mínimo 14sp), alto contraste de colores y áreas táctiles de botones no menores a 48x48dp para asegurar una correcta usabilidad en pantallas móviles.

## 4. User Stories y Criterios de Aceptación (Bonus Interdisciplinar)

### US-01: Creación de partida
**Como** organizador, **quiero** crear un evento de Amigo Invisible para empezar a cargar a los participantes.
**Prioridad:** Alta
**Criterios de Aceptación:**
*   **Given** que estoy en la pantalla de inicio, **When** ingreso un nombre para el evento y presiono "Crear", **Then** el sistema guarda el nombre y me redirige a la vista de gestión de participantes.
*   **Given** que el campo de nombre está vacío, **When** presiono "Crear", **Then** el sistema me muestra un error solicitando un nombre válido.

### US-02: Gestión de participantes
**Como** organizador, **quiero** agregar los nombres de mis amigos a la lista para que formen parte del sorteo.
**Prioridad:** Alta
**Criterios de Aceptación:**
*   **Given** que estoy en la vista del evento, **When** escribo un nombre en el input y toco "Agregar", **Then** el nombre se renderiza en la lista inferior de forma inmediata.
*   **Given** que intento agregar un nombre que ya existe en la lista actual, **When** toco "Agregar", **Then** el sistema rechaza la acción e informa visualmente "El participante ya existe".

### US-03: Ejecución del Sorteo
**Como** organizador, **quiero** iniciar el sorteo automático para que el sistema asigne a quién le regala cada persona de manera justa.
**Prioridad:** Alta
**Criterios de Aceptación:**
*   **Given** que la lista tiene 3 o más participantes cargados, **When** presiono "Realizar Sorteo", **Then** el algoritmo calcula las parejas sin auto-asignaciones y avanza a la pantalla de resultados.
*   **Given** que la lista tiene menos de 3 participantes, **When** intento sortear, **Then** el botón se encuentra inhabilitado o muestra un aviso de cantidad mínima requerida.

### US-04: Revelación Privada
**Como** participante, **quiero** ver el resultado de mi asignación de forma protegida para asegurar que nadie más vea a quién me toca regalarle.
**Prioridad:** Alta
**Criterios de Aceptación:**
*   **Given** que la pantalla muestra mi nombre como el turno actual, **When** mantengo presionado el botón "Revelar mi amigo", **Then** el sistema me muestra el nombre objetivo.
*   **Given** que estoy viendo mi resultado, **When** suelto el botón o presiono "Ocultar y seguir", **Then** el nombre se esconde y la interfaz se prepara para el siguiente participante.

### US-05: Persistencia de Sesión Local
**Como** usuario, **quiero** que la app guarde los datos localmente para no perder el progreso de la partida si cierro la aplicación por error.
**Prioridad:** Media
**Criterios de Aceptación:**
*   **Given** que agregué 4 participantes y cerré la app, **When** vuelvo a iniciarla, **Then** la lista de esos 4 participantes sigue disponible.
*   **Given** que el sorteo ya se realizó y se cerró la app en medio de las revelaciones, **When** vuelvo a abrirla, **Then** el estado del sorteo se recupera permitiendo continuar por donde se dejó.