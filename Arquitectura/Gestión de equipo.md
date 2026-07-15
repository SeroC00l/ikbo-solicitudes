# Gestión de Equipo - FlorFutures

## 1. Composición del Equipo

### Equipo de 3 Desarrolladores

| Rol | Perfil | Responsabilidades principales |
|-----|--------|-------------------------------|
| **Tech Lead / Fullstack Senior** | Experto en arquitectura, React, Node.js, DevOps | Arquitectura del sistema, code review, CI/CD, K8s deployment |
| **Fullstack Junior** | React, backend básico, aprendizaje rápido | Componentes UI, formularios, integraciones con API, tests |
| **Backend Developer** | NestJS, PostgreSQL, microservicios | API REST, lógica de negocio, microservicios, migración desde Supabase |

### Distribución de Conocimiento

```
Tech Lead:        ████████████████████████  Arquitectura + Frontend + DevOps
Fullstack Junior: ██████████░░░░░░░░░░░░░░  Frontend (React) + Backend básico
Backend Dev:      ████████████████████░░░░  Backend (NestJS) + DB + Microservicios
```

## 2. Organización de Sprints

### Metodología: Scrum con sprints de 1 semana

| Día | Actividad | Duración |
|-----|-----------|----------|
| Lunes | Sprint Planning | 1 hora |
| Martes-Viernes | Desarrollo + Daily standups | 15 min/día |
| Viernes | Sprint Review + Retrospectiva | 1 hora |

### Sprint Plan

#### Sprint 1: Fundamentos y Setup (Semana 1)

| Tarea | Asignada a | Tiempo est. | Dependencias |
|-------|------------|-------------|--------------|
| Setup proyecto monorepo + K8s config | Tech Lead | 4h | — |
| Schema DB + RLS + seed data | Backend Dev | 4h | — |
| Auth flow (login/registro) + guards | Tech Lead | 4h | Schema |
| UI Kit base (Button, Input, Card, Badge) | Fullstack Junior | 6h | — |
| Layouts (Dashboard, Auth) + Sidebar | Fullstack Junior | 4h | UI Kit |

#### Sprint 2: Funcionalidad Core (Semana 2)

| Tarea | Asignada a | Tiempo est. | Dependencias |
|-------|------------|-------------|--------------|
| NestJS API: contratos CRUD + validación | Backend Dev | 8h | Schema |
| NestJS API: ofertas CRUD + contraofertas | Backend Dev | 6h | Contratos |
| Frontend: Contracts list + detail page | Fullstack Junior | 6h | Auth |
| Frontend: New contract form (flower selector) | Fullstack Junior | 6h | UI Kit |
| Integración frontend ↔ NestJS API | Tech Lead | 4h | Ambos APIs |

#### Sprint 3: Negociación y Flujos (Semana 3)

| Tarea | Asignada a | Tiempo est. | Dependencias |
|-------|------------|-------------|--------------|
| Frontend: Offers list + detail + modals | Fullstack Junior | 8h | API |
| Lógica de aceptar/rechazar/counteroffer | Backend Dev | 6h | Ofertas |
| Microservicio de notificaciones (email) | Backend Dev | 4h | Ofertas |
| Estados del contrato (transiciones) | Backend Dev | 4h | Lógica |
| Tests unitarios backend | Backend Dev | 4h | APIs |

#### Sprint 4: Deploy, Testing y QA (Semana 4)

| Tarea | Asignada a | Tiempo est. | Dependencias |
|-------|------------|-------------|--------------|
| Dockerfile + docker-compose | Tech Lead | 3h | — |
| K8s manifests (Deployment, Service, Ingress) | Tech Lead | 6h | Docker |
| AWS setup (EKS, RDS, ALB) | Tech Lead | 4h | K8s |
| CI/CD pipeline (GitHub Actions → ECR → EKS) | Tech Lead | 4h | K8s |
| Tests E2E (Playwright) | Fullstack Junior | 6h | Feature complete |
| Tests de integración | Backend Dev | 4h | APIs |
| QA manual + bug fixes | Todos | 8h | — |
| Documentación final | Tech Lead | 3h | — |

## 3. Herramientas de Gestión

### Comunicación
- **Slack/Discord**: Comunicación diaria, canales por función (#frontend, #backend, #devops)
- **GitHub Issues**: Tracking de tareas con labels (bug, feature, chore)
- **GitHub Projects**: Tablero Kanban visual

### Code Review
- **Todo PR requiere 1 aprobación** antes de merge
- **PRs pequeños** (máximo 300 líneas)
- **Descripción clara** del cambio
- **Tests incluidos** para cambios en lógica de negocio

### Checklist de Revisión

```markdown
## Code Review

### Funcionalidad
- [ ] Funciona como se esperaba
- [ ] Casos edge cubiertos
- [ ] Sin errores en consola

### Código
- [ ] Legible y mantenible
- [ ] Sin código duplicado
- [ ] Nombres descriptivos

### Seguridad
- [ ] Sin datos sensibles expuestos
- [ ] Inputs validados
- [ ] RLS/permissions correctos

### Performance
- [ ] Sin consultas N+1
- [ ] Índices usados correctamente
- [ ] Sin renders innecesarios

### Testing
- [ ] Tests para nueva funcionalidad
- [ ] Tests existentes pasan
```

## 4. Asignación por Dominio

```
┌─────────────────────────────────────────────────────────────┐
│                      FlorFutures                            │
├──────────────────┬──────────────────┬───────────────────────┤
│   FRONTEND       │   BACKEND        │   DEVOPS              │
│   (Junior + TL)  │   (Backend Dev)  │   (Tech Lead)         │
├──────────────────┼──────────────────┼───────────────────────┤
│ • React/Astro    │ • NestJS API     │ • Docker/K8s          │
│ • Componentes UI │ • Microservicios │ • AWS (EKS, RDS)      │
│ • Formularios    │ • DB schema/RLS  │ • CI/CD pipeline      │
│ • Estados UI     │ • Lógica negocio │ • Monitoreo           │
│ • E2E tests      │ • Unit tests     │ • Infra as Code       │
└──────────────────┴──────────────────┴───────────────────────┘
```

## 5. Métricas de Equipo

| Métrica | Objetivo |
|---------|----------|
| Lead time | < 3 días |
| Cycle time | < 2 días |
| PR review time | < 24 horas |
| Bug escape rate | < 5% |
| Test coverage | > 80% |
| Deploy frequency | Diario |

## 6. Ceremonias

| Ceremonia | Frecuencia | Duración | Participantes |
|-----------|------------|----------|---------------|
| Daily Standup | Diaria | 15 min | Todos |
| Sprint Planning | Semanal | 1 hora | Todos |
| Sprint Review | Semanal | 1 hora | Todos + stakeholders |
| Retrospectiva | Semanal | 1 hora | Solo equipo |
| Tech Talk | Quincenal | 30 min | Rotativo |
