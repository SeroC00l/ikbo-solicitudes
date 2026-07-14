# Gestión de Equipo - Liderazgo Técnico

## 1. ¿Cómo organizaría los sprints y la asignación de tareas?

### Metodología: Scrum con sprints de 1 semana

Para un equipo pequeño de 2-3 desarrolladores, usaría **Scrum** con adaptaciones:

#### Estructura de Sprint

| Día | Actividad |
|-----|-----------|
| Lunes | Planning (1 hora): Definir objetivos del sprint |
| Martes-Viernes | Desarrollo + Daily standups (15 min) |
| Viernes | Review + Retrospectiva (1 hora) |

#### Asignación de Tareas

Usaría un tablero **Kanban** con columnas:

```
| Backlog | To Do | In Progress | Review | Done |
|---------|-------|-------------|--------|------|
```

**Criterios de asignación:**

1. **Por funcionalidad**: Cada tarea entrega valor completo
2. **Por complejidad**: Distribuir tareas difíciles entre todos
3. **Por experiencia**: Asignar según fortalezas de cada uno

#### Ejemplo de Sprint para este proyecto

**Sprint 1: Fundamentos (1 semana)**

| Tarea | Asignada a | Tiempo estimado |
|-------|------------|-----------------|
| Setup proyecto + configuración | Dev 1 | 2 horas |
| Schema de base de datos + RLS | Dev 2 | 3 horas |
| Autenticación (Login/Registro) | Dev 1 | 4 horas |
| UI Components (Button, Input, Card) | Dev 3 | 4 horas |
| Layouts y navegación | Dev 2 | 3 horas |

**Sprint 2: Funcionalidad Core (1 semana)**

| Tarea | Asignada a | Tiempo estimado |
|-------|------------|-----------------|
| CRUD Solicitudes | Dev 1 | 6 horas |
| CRUD Ofertas | Dev 2 | 6 horas |
| Contraofertas | Dev 3 | 4 horas |
| Dashboard principal | Dev 1 | 3 horas |

**Sprint 3: Pulido y Deploy (1 semana)**

| Tarea | Asignada a | Tiempo estimado |
|-------|------------|-----------------|
| Tests unitarios | Dev 1 | 4 horas |
| Tests de integración | Dev 2 | 4 horas |
| Documentación | Dev 3 | 3 horas |
| Deploy a producción | Dev 1 | 2 horas |

## 2. ¿Qué metodologías y herramientas de revisión de código recomendaría?

### Metodología: Code Review obligatorio

**Reglas:**

1. **Todo PR debe tener al menos 1 aprobación** antes de merge
2. **PRs pequeños** (máximo 300 líneas) para facilitar la revisión
3. **Descripción clara** del cambio y por qué se hizo
4. **Tests incluidos** para cambios en lógica de negocio

### Herramientas

1. **GitHub/GitLab Pull Requests**: Para revisiones
2. **ESLint + Prettier**: Para consistencia de código
3. **Husky + lint-staged**: Para pre-commit hooks

### Checklist de Revisión

```markdown
## Code Review Checklist

### Funcionalidad
- [ ] El código funciona como se esperaba
- [ ] Se cubrieron casos edge
- [ ] No hay errores en consola

### Código
- [ ] El código es legible y mantenible
- [ ] No hay código duplicado
- [ ] Los nombres son descriptivos
- [ ] No hay comentarios innecesarios

### Seguridad
- [ ] No hay datos sensibles expuestos
- [ ] Se validan inputs del usuario
- [ ] Se usan las políticas RLS correctamente

### Performance
- [ ] No hay consultas N+1
- [ ] Se usan índices correctamente
- [ ] No hay renders innecesarios

### Testing
- [ ] Hay tests para la nueva funcionalidad
- [ ] Los tests existentes pasan
```

## 3. ¿Qué procesos de CI/CD implementaría?

### Pipeline de CI/CD

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Push/PR   │ ──► │    CI       │ ──► │    CD       │
│             │     │  (Test)     │     │  (Deploy)   │
└─────────────┘     └─────────────┘     └─────────────┘
```

### GitHub Actions

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: bun install
      - run: bun run lint
      - run: bun run typecheck
      - run: bun run test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Calidad del Código

1. **Linting**: ESLint con reglas estrictas
2. **Formatting**: Prettier para consistencia
3. **Type Checking**: TypeScript estricto
4. **Tests**: Mínimo 80% cobertura

### Ambientes

| Ambiente | Rama | Deploy automático |
|----------|------|-------------------|
| Desarrollo | develop | Sí |
| Staging | staging | Sí |
| Producción | main | Sí (con aprobación) |

## 4. Otros temas adicionales

### Comunicación del Equipo

**Herramientas:**
- **Slack/Discord**: Comunicación diaria
- **GitHub Issues**: Tracking de tareas
- **Notion/Confluence**: Documentación

**Ceremonias:**
- **Daily standup** (15 min): Qué hice, qué haré, bloqueos
- **Sprint review** (1 hora): Demo del incremento
- **Retrospectiva** (1 hora): Qué mejorar

### Gestión de Conocimiento

1. **Documentación inline**: Comentarios en código complejo
2. **README actualizado**: Instrucciones claras
3. **Arquitectura documentada**: Diagramas y decisiones
4. **Onboarding guide**: Para nuevos miembros

### Métricas de Equipo

| Métrica | Objetivo |
|---------|----------|
| Lead time | < 3 días |
| Cycle time | < 2 días |
| PR review time | < 24 horas |
| Bug escape rate | < 5% |
| Test coverage | > 80% |

### Mejora Continua

1. **Retrospectivas mensuales**: Identificar patrones
2. **Tech talks internas**: Compartir conocimiento
3. **Pair programming**: Para tareas complejas
4. **Mob programming**: Para diseño de arquitectura

### Escalabilidad del Equipo

Si el equipo crece a 5+ personas:

1. **Dividir en squads**: Por dominio (solicitudes, ofertas, auth)
2. **Tech leads por squad**: Liderazgo técnico distribuido
3. **Archivos de ownership**: Responsables por componente
4. **RFCs para decisiones grandes**: Documentar y debatir

## Conclusión

El liderazgo técnico para un equipo pequeño implica:

1. **Simplicidad**: Procesos ligeros que no frenen al equipo
2. **Comunicación**: Transparencia y feedback constante
3. **Calidad**: Estándares claros sin burocracia
4. **Mejora continua**: Aprender y adaptarse

El objetivo es maximizar la **velocidad** manteniendo la **calidad**, creando un equipo **auto-organizado** y **motivado**.
