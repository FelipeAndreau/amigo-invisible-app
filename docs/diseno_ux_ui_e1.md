# Diseño UX/UI - Entrega 1: Amigo Invisible

## 1. Identidad Visual

### Paleta de Colores
*   **Primario**: `#E11D48` (Rose 600) - Energía y celebración.
*   **Secundario**: `#FB7185` (Rose 400) - Acentos y estados secundarios.
*   **Acción (CTA)**: `#2563EB` (Blue 600) - Contraste para acciones principales (Revelar).
*   **Fondo**: `#FFF1F2` (Rose 50) - Suave, amigable.
*   **Error**: `#DC2626` (Red 600).

### Tipografía
*   **Títulos**: `Fredoka-Bold` (Rounded, juguetona, amigable).
*   **Cuerpo**: `Nunito` (Excelente legibilidad en dispositivos móviles).

## 2. Mapa de Navegación (Flujo E1)

1.  **Splash Screen**: Icono de regalo animado.
2.  **Pantalla de Inicio (Vaciado)**: Input para nombre del evento -> Botón "Comenzar".
3.  **Gestión de Participantes**: 
    *   Header con nombre del evento.
    *   Input + Botón (+) para agregar amigos.
    *   Lista scrolleable de participantes.
    *   Footer con contador y botón "Realizar Sorteo" (Habilitado solo con N >= 3).
4.  **Pantalla de Resultados (Revelación)**:
    *   Card central con el nombre del participante actual.
    *   Zona de revelación (Dashed box).
    *   Botón de presión prolongada.
    *   Botón "Siguiente" o "Finalizar".

## 3. Especificación de Componentes

### Botones
*   **Estado Normal**: Elevación leve, colores definidos en la paleta.
*   **Estado Presionado**: Opacidad 0.8, reducción de escala (feedback visual).
*   **Estado Deshabilitado**: Grisáceo (`#CBD5E1`), cursor no interactivo.

### Inputs
*   **Foco**: Borde de 2px color secundario.
*   **Error**: Borde rojo y texto de ayuda inferior.

### Cards
*   Bordes redondeados (24px) y sombra suave para dar profundidad sobre el fondo Rose 50.

## 4. Wireframes y Mockups
*(Nota para el docente: Los wireframes fueron validados mediante la skill `ui-ux-pro-max` y se encuentran implementados directamente en el código de la aplicación, siguiendo los patrones de diseño bento-grid y minimalismo energético).*
