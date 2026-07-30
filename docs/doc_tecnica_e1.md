# Documentación Técnica - Entrega 1: Amigo Invisible

**Materia:** Desarrollo de Aplicaciones Móviles  
**Ciclo Lectivo:** 2026  
**Tecnología:** React Native (Expo) + Golang

## 1. Decisión de Tecnología

### Framework: React Native (Expo SDK 54)
Se seleccionó **React Native con Expo** por las siguientes razones:
*   **Desarrollo Multiplataforma**: Permite un único codebase para iOS y Android, optimizando los tiempos de entrega.
*   **Expo SDK 54**: Se utiliza la versión más reciente (2026) para garantizar compatibilidad con las últimas APIs de sistema y mejorar el rendimiento del bundling (Metro).
*   **Soporte de la Cátedra**: Alineación con el soporte avanzado brindado por los docentes.

### Backend: Golang (Gin Gonic)
Aunque la E1 es *Offline First*, se preparó el entorno con **Go**:
*   **Eficiencia**: Ideal para la alta concurrencia esperada en las fases de sorteos globales (E2/E3).
*   **Estructura Profesional**: Uso de `Gin` para un ruteo rápido y escalable.

## 2. Gestión de Estado y Arquitectura

### Gestión de Estado: Hooks Personalizados (useEvent)
Para la Entrega 1, se optó por **Hooks personalizados (`useState`, `useEffect`, `useCallback`)** en lugar de Redux o Context API.
*   **Justificación**: El flujo de datos es lineal y contenido dentro de un solo dominio (el Evento). El uso de Hooks reduce la complejidad y el boilerplate, manteniendo una alta performance en la actualización de la lista de participantes.

### Arquitectura: Package-by-Feature
Se implementó la convención **Package-by-Feature Flat**:
*   Los archivos se agrupan por funcionalidad (`event/`) y no por tipo técnico.
*   **Beneficio**: Alta cohesión y bajo acoplamiento. Si se desea extraer el feature del sorteo a otra app, se puede hacer moviendo la carpeta `features/event`.

## 3. Librerías y Dependencias Principales

| Librería | Versión | Propósito |
|---|---|---|
| `expo` | ~54.0.0 | Core del Framework |
| `react-native` | 0.81.5 | Renderizado Nativo |
| `@react-native-async-storage/async-storage` | 2.2.0 | Persistencia local (RF-05) |
| `lucide-react-native` | ^15.0.3 | Iconografía profesional (lucide.dev) |
| `expo-font` | ~14.0.11 | Carga de tipografía personalizada |
| `expo-haptics` | ~14.0.0 | Feedback táctil en interacciones |

## 4. Algoritmo de Sorteo (Derangement)
El núcleo de la aplicación reside en `shuffle.ts`. Implementa una variante del algoritmo de **Fisher-Yates**:
1.  Recibe una lista de `Participant` (ID + Nombre).
2.  Genera una permutación aleatoria.
3.  Valida la condición de **Derangement**: `shuffled[i] != original[i]` para todo `i`.
4.  Garantiza por diseño que nadie se asigne a sí mismo.

## 5. Versión Mínima Soportada
*   **Android**: API 28 (Android 9) - Para asegurar compatibilidad con el motor Hermes y AsyncStorage v2.
*   **iOS**: 15.0 - Requerido por las últimas librerías de Expo SDK 54.
