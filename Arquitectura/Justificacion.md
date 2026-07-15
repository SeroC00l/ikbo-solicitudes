# Justificación de Decisiones Técnicas - FlorFutures

## 1. Arquitectura del Sistema

### Arquitectura General

FlorFutures sigue una arquitectura **frontend-first** con separación clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │   Astro SSG  │  │ React Islands│  │     Zustand Store     │ │
│  │  (Shell HTML)│  │ (Interactive)│  │   (Client State)      │ │
│  └──────────────┘  └──────────────┘  └───────────────────────┘ │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTPS
┌─────────────────────────────┴───────────────────────────────────┐
│                     AWS Cloud (EKS Cluster)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │  Astro/React │  │  NestJS API  │  │  Notification Service │ │
│  │  (Ingress)   │  │  (Deployment)│  │  (Event-driven)       │ │
│  └──────────────┘  └──────┬───────┘  └───────────┬───────────┘ │
│                           │                      │              │
│  ┌────────────────────────┴──────────────────────┴───────────┐ │
│  │                    Service Mesh (Istio)                    │ │
│  └────────────────────────┬──────────────────────┬───────────┘ │
│                           │                      │              │
│  ┌────────────────────────┴──────┐  ┌────────────┴───────────┐ │
│  │    PostgreSQL (RDS)           │  │    Redis (ElastiCache) │ │
│  │    + Supabase Auth            │  │    (Session/Cache)     │ │
│  └───────────────────────────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Justificación de Astro + React

**Astro** como framework principal:

1. **Islands Architecture**: Solo las partes interactivas cargan JavaScript (formularios, modales, dashboards)
2. **Performance**: HTML estático servido desde CDN, First Contentful Paint < 1s
3. **SEO**: Rendering del lado del servidor para contenido indexable
4. **Bundle mínimo**: 0kb de JavaScript por defecto, solo lo necesario se hidrata

**React** para componentes interactivos:
- Formularios dinámicos (contract creation, offer modals)
- Estados reactivos (listas filtradas, counts en tiempo real)
- Componentes reutilizables con composición

**Zustand** para estado del cliente:
- Store ligero (~1kb) comparado con Redux (~11kb)
- Sin boilerplate, sin providers
- Persistencia opcional con localStorage

## 2. Seguridad

### Autenticación y Autorización

**Capa 1 - JWT (Supabase Auth)**:
- Tokens firmados con HMAC-SHA256
- Expiración configurable (default 1 hora)
- Refresh tokens para sesiones largas

**Capa 2 - Row Level Security (RLS)**:
```sql
-- Cada consulta pasa por estas políticas
-- SELECT: Solo ven datos que les pertenecen
-- INSERT: Solo crean con su propio ID
-- UPDATE: Solo modifican sus propios registros
-- DELETE: Solo eliminan en estado pendiente
```

**Capa 3 - Frontend Guards**:
- Verificación de sesión en cada navegación
- Redirección automática a login si no hay sesión
- Creación automática de perfil si falta (safety net)

### Flujos de Seguridad

```
Login → JWT → Supabase Client → RLS Check → Data
              ↓
         localStorage (perfil cache)
              ↓
         Session Validate (on each page)
              ↓
         getCurrentUser() → Supabase Auth Session
```

### Por qué `getCurrentUser()` en vez de localStorage puro

El sistema valida la sesión **siempre** contra Supabase Auth, no solo contra localStorage:

```typescript
// Antes (inseguro - localStorage puede tener datos obsoletos)
const user = JSON.parse(localStorage.getItem('user'));

// Después (seguro - siempre valida contra la sesión activa)
const user = await getCurrentUser(); // → supabase.auth.getSession() → usuarios table
```

Esto previene:
- UUIDs obsoletos después de recrear usuarios
- Sesiones expiradas que parecen válidas
- Datos de cache desincronizados

## 3. Escalabilidad con Kubernetes + AWS

### Por qué Kubernetes

1. **Auto-escalado**: HPA (Horizontal Pod Autoscaler) escala pods según CPU/memory
2. **Disponibilidad**: Múltiples répicas toleran fallos de nodos
3. **Rolling updates**: Deployments sin downtime
4. **Service discovery**: Comunicación interna entre microservicios
5. **Secrets management**: Variables sensibles en K8s Secrets

### Por qué AWS

1. **EKS**: Managed Kubernetes, sin gestionar masters
2. **RDS**: PostgreSQL managed con backups automáticos y Multi-AZ
3. **ElastiCache**: Redis para caché de sesiones y rate limiting
4. **ALB**: Load balancer con SSL termination
5. **ECR**: Container registry privado
6. **CloudWatch**: Monitoreo y alertas integradas

### Arquitectura de Deploy

```
                    ┌──────────────────┐
                    │   Route 53 DNS   │
                    └────────┬─────────┘
                             │
                    ┌────────┴─────────┐
                    │  AWS ALB (HTTPS) │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │      EKS Cluster            │
              │  ┌───────────────────────┐  │
              │  │     Ingress Controller│  │
              │  │     (nginx-ingress)   │  │
              │  └───────────┬───────────┘  │
              │              │              │
              │  ┌───────────┴───────────┐  │
              │  │    Service Mesh       │  │
              │  │    (Istio)            │  │
              │  └───┬───────┬───────┬───┘  │
              │      │       │       │      │
              │  ┌───┴──┐ ┌──┴───┐ ┌─┴────┐ │
              │  │Web   │ │API   │ │Notif.│ │
              │  │(Astro│ │(Nest │ │Svc   │ │
              │  │React)│ │JS)   │ │      │ │
              │  └──────┘ └──────┘ └──────┘ │
              └─────────────────────────────┘
```

### Kubernetes Resources

```yaml
# Deployment - Web (Astro/React)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: flor-futures-web
spec:
  replicas: 2
  selector:
    matchLabels:
      app: flor-futures-web
  template:
    spec:
      containers:
      - name: web
        image: <account>.dkr.ecr.us-east-1.amazonaws.com/flor-futures-web:latest
        ports:
        - containerPort: 4321
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "250m"

---
# Deployment - API (NestJS)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: flor-futures-api
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: api
        image: <account>.dkr.ecr.us-east-1.amazonaws.com/flor-futures-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: flor-futures-secrets
              key: database-url

---
# Horizontal Pod Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: flor-futures-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: flor-futures-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### CI/CD Pipeline

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Push to  │───►│  Build   │───►│  Push to │───►│  Deploy  │
│  main     │    │  Docker  │    │  ECR     │    │  EKS     │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │
     │          Run tests       Scan image     Rolling update
     │          Lint/Type       Tag latest      Health check
     │                                                 │
     └──────────── Preview deploy (PRs) ◄──────────────┘
```

## 4. Migración Gradual a NestJS

El diseño actual permite migrar de Supabase a NestJS **sin romper el frontend**:

### Fase 1: Supabase (Actual)
- Frontend → Supabase JS Client → Supabase DB
- Auth: Supabase Auth
- API: Auto-generada por Supabase

### Fase 2: Hybrid
- Frontend → NestJS API → Supabase DB
- Auth: NestJS JWT (validado contra Supabase)
- API: NestJS controllers

### Fase 3: Full NestJS
- Frontend → NestJS API → PostgreSQL (RDS)
- Auth: NestJS Passport.js
- API: NestJS microservicios

**Por qué funciona**: El frontend solo conoce los tipos y las respuestas de API. Si la API cambia de Supabase a NestJS pero mantiene los mismos contratos de datos, el frontend no necesita cambios.

## 5. Microservicios

### Servicios del Sistema

| Servicio | Responsabilidad | Stack |
|----------|-----------------|-------|
| **Web** | UI/UX, routing, rendering | Astro + React |
| **API** | CRUD, validación, lógica negocio | NestJS + TypeORM |
| **Auth** | Registro, login, tokens, roles | NestJS + Passport.js + JWT |
| **Notifications** | Email, alerts, real-time | NestJS + Nodemailer + WebSocket |
| **Gateway** | API routing, rate limiting, CORS | NestJS Gateway |

### Comunicación entre Servicios

```
Web ──HTTP──► API Gateway ──► API Service
                                  │
                                  ├──► PostgreSQL (RDS)
                                  │
                                  └──► Redis (ElastiCache)
                                       │
                                  Notification Service
                                       │
                                  └──► Email (SES)
```

- **Síncrono**: HTTP/REST para CRUD operations
- **Asíncrono**: Redis pub/sub para eventos (nueva oferta, contraoferta)
- **WebSocket**: Notificaciones en tiempo real al frontend

## 6. Monitoreo y Observabilidad

### Stack de Monitoreo

| Capa | Herramienta | Propósito |
|------|-------------|-----------|
| Logs | CloudWatch Logs | Logs estructurados de todos los servicios |
| Métricas | Prometheus + Grafana | Métricas de negocio y sistema |
| Tracing | Jaeger (via Istio) | Distributed tracing |
| Alertas | CloudWatch Alarms | PagerDuty integration |

### Métricas Clave

- **Latencia P95** de API: < 200ms
- **Error rate**: < 0.1%
- **Disponibilidad**: > 99.9%
- **Throughput**: > 1000 req/s

## 7. Decisiones Técnicas Adicionales

### TypeScript Estricto

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

### Testing Strategy

| Tipo | Herramienta | Cobertura objetivo |
|------|-------------|-------------------|
| Unit | Vitest | > 80% |
| Integration | Vitest + MSW | > 70% |
| E2E | Playwright | Flujos críticos |
| Load | k6 | > 1000 concurrent users |

### Performance

- **Astro**: HTML estático, 0kb JS por página estática
- **React Islands**: Solo componentes interactivos cargan JS
- **Code splitting**: Automático por ruta
- **Lazy loading**: Imágenes y componentes pesados

## Conclusión

Esta arquitectura equilibra:

| Aspecto | Valoración |
|---------|-----------|
| Rapidez de desarrollo | ★★★★★ MVP en 1-2 semanas |
| Calidad de código | ★★★★★ TypeScript + tests + review |
| Escalabilidad | ★★★★★ K8s + microservicios |
| Seguridad | ★★★★★ JWT + RLS + guards |
| Mantenibilidad | ★★★★☆ Modular, documentado |
| Costo | ★★★☆☆ AWS tiene costo, pero escalable |

Es ideal para una prueba técnica que demuestra buenas prácticas de desarrollo fullstack con visión de escalabilidad real.
