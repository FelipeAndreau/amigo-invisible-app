# Diseño UX/UI - Entrega 2 (E2)

## 1. Evolución del Diseño (v1 a v2)
En la E2, la aplicación evoluciona de una "herramienta de utilidad única" a una "plataforma de gestión de sorteos".

### Nuevas Pantallas y Flujos
1. **Flujo de Acceso:**
   - **Login / Register:** Pantallas minimalistas con validación de campos en tiempo real. Uso de `KeyboardAvoidingView` para mejorar la experiencia en dispositivos móviles.
2. **Gestión Horizontal:**
   - **Dashboard (Home):** Vista de listado con tarjetas (cards) que muestran un resumen de cada sorteo. Uso de estados vacíos (Empty States) con ilustraciones motivacionales para invitar a crear el primer sorteo.
   - **Detalle del Evento:** Desglose de participantes con acciones rápidas para editar o eliminar antes del sorteo.
3. **Flujo de Revelación:**
   - **Vista de Revelación (Webview/App):** Una pantalla enfocada únicamente en la sorpresa, utilizando animaciones de Confetti tras el "revelar".

## 2. Accesibilidad (WCAG)
- **Contraste:** Se ha verificado que la paleta de colores (Rose #E91E63 sobre blanco) cumple con el ratio **WCAG AA (4.5:1)** para texto normal.
- **Touch Targets:** Todos los botones de acción y elementos de lista tienen una altura mínima de **48dp** para facilitar el toque, incluso para personas con movilidad reducida.
- **Tipografía:** Se utiliza un tamaño base de **16sp** para el cuerpo de texto, garantizando legibilidad sin necesidad de zoom.

## 3. Estados del Sistema
- **Carga (Loading):** Implementación de **Skeleton Components** en el Dashboard para mitigar la percepción de espera durante la consulta al backend.
- **Error:** Pantallas de error con mensajes claros (ej: "Sin conexión") y botón de reintento (Retry).
- **Lista Vacía:** Mensaje amigable: "Aún no tienes sorteos. ¡Crea el primero para empezar la diversión!".
