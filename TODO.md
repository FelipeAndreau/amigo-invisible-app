# Plan de Trabajo - Entrega 2 (E2)

## Estado Actual
El repo privado tiene `entrega-2` con backend Go (Gin, PostgreSQL, JWT), frontend React Native (Expo) y documentación base. 

## Faltantes Críticos para la Entrega

### 1. Seguridad & Backend (Felipe)
- [ ] JWT secret hardcodeado (`your-secret-key`) → mover a variable de entorno
- [ ] Agregar validaciones robustas de entrada (email, password strength)
- [ ] Manejo de errores de DB con mensajes claros
- [ ] Health check y graceful shutdown

### 2. Sistema de Invitación (Santiago)
- [ ] Nuevo endpoint: `POST /api/v1/events/:id/invite` (generar código de invitación)
- [ ] Nuevo endpoint: `POST /api/v1/events/join` (unirse con código)
- [ ] Nuevo rol: `participant` (se une con código, no crea eventos)
- [ ] Actualizar DB schema: `invite_code` en events, `role` en participants

### 3. Revelación Pública (Melissa)
- [ ] Implementar `RevealPublicScreen.tsx` completo
- [ ] Consumir API `/api/v1/reveal/:token` para mostrar resultado
- [ ] Manejar estados: loading, error, link usado, resultado válido
- [ ] Efecto visual de confeti/celebración

### 4. UX Frontend & Accesibilidad (Pilar)
- [ ] IP hardcodeada en `api.ts` → usar `.env` o configuración dinámica
- [ ] Validaciones de cliente (email regex, password strength, duplicados)
- [ ] Estados de error en todas las pantallas (network error, 401, 500)
- [ ] Estados de lista vacía con mensajes amigables
- [ ] Áreas táctiles mínimo 48x48dp
- [ ] Contraste WCAG AA

### 5. Design System & Documentación (Pia)
- [ ] Agregar RNF a `alcance_e2.md` (seguridad, mantenibilidad, escalabilidad)
- [ ] Actualizar `doc_tecnica_e2.md` con API de invitaciones
- [ ] Crear `/ia/entrega-2/` con `.cm` acumulado e índice de skills
- [ ] Consolidar `Theme` tokens (espaciado, colores, tipografía)
- [ ] Pre-delivery checklist de accesibilidad

## Estructura de Branches

```
entrega-2 (base)
├── feature/felipe-backend-security
├── feature/santiago-invitation-system
├── feature/melissa-reveal-polish
├── feature/pilar-frontend-ux
└── feature/pia-design-system
```

## Flujo de Merge
1. Cada integrante trabaja en su branch
2. PR/Merge a `entrega-2` cuando la feature está lista
3. Testing integrado en `entrega-2`
4. Tag final `v0.2.0` para entrega

## Fecha Límite
20 de junio 2026
