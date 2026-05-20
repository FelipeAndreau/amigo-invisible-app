# Guía de Cumplimiento: Entrega 2 (E2)

Este documento detalla cómo la aplicación **Amigo Invisible** cumple con los requisitos de la segunda entrega (E2) enfocada en el escalado funcional y la dimensión "online".

## 1. Escalado Funcional y Dimensión Online
- **Horizontalidad:** La app ya no es un solo sorteo local. Ahora, un **Organizador** puede gestionar múltiples eventos (Sorteos) de forma simultánea.
- **Backend Online:** Se ha migrado de una lógica puramente local (`AsyncStorage`) a una arquitectura cliente-servidor usando el backend en **Go** y persistencia en **PostgreSQL**.

## 2. Documento de Alcance (E2) - Cumplimiento
| Requisito | Estado | Descripción |
| :--- | :---: | :--- |
| Changelog del alcance | ✅ | Sección añadida en `alcance_e2.md` detallando la transición de E1 a E2. |
| Nuevos RFs (RF-05 a RF-08) | ✅ | Registro, Login, Gestión de múltiples eventos y Links Mágicos. |
| User Stories (Given/When/Then) | ✅ | 4 nuevas historias enfocadas en el Organizador y la Privacidad del Invitado. |
| Gestión de Excepciones | ✅ | Reglas de negocio: Min 3 personas, Link Mágico de un solo uso, token expirado. |

## 3. Diseño UX/UI (E2) - Cumplimiento
| Requisito | Estado | Descripción |
| :--- | :---: | :--- |
| Nuevas Pantallas | ✅ | Se han diseñado pantallas de Auth, Dashboard de eventos y Detalle de Sorteo. |
| Estados de Interacción | ✅ | Implementación de Skeleton Loaders para la carga de eventos y estados de error de red. |
| Accesibilidad | ✅ | Contraste WCAG AA verificado en el tema central y áreas táctiles de 48dp. |

## 4. Documentación Técnica (E2) - Cumplimiento
| Requisito | Estado | Descripción |
| :--- | :---: | :--- |
| Autenticación | ✅ | Implementación de **JWT (JSON Web Tokens)** y Registro/Login en Go + PostgreSQL. |
| Integración Backend | ✅ | Endpoints REST documentados para sincronización de datos en tiempo real. |
| Refactoring | ✅ | Migración del algoritmo de sorteo al servidor para evitar manipulación en el cliente. |

## 5. Aplicación Funcional E2
- **Repositorio:** Rama `entrega-2` activa y sincronizada.
- **IA:** Carpeta `/ia/entrega-2/` creada con el índice de temas y el log `.cm` actualizado.

---
**Nota:** Este documento actúa como hoja de ruta para la implementación técnica inmediata en esta rama.
