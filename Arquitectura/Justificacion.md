# Justificación de Decisiones Técnicas - FlorFutures

## 1. ¿Por qué elegí la estructura arquitectónica propuesta?

### Arquitectura JAMstack/Serverless

Elegí una arquitectura **JAMstack** (JavaScript, APIs, Markup) con **Serverless** para el sistema de contratos de futuros de flores por las siguientes razones:

1. **Rendimiento**: Astro genera HTML estático que se carga rápidamente, mientras que React maneja las partes interactivas (Islands Architecture).

2. **Escalabilidad**: Supabase maneja automáticamente el escalado de la base de datos y la autenticación, sin necesidad de gestionar servidores.

3. **Costo-efectividad**: Vercel y Supabase tienen planes gratuitos generosos para proyectos en etapa de desarrollo.

4. **Mantenibilidad**: La separación clara entre frontend (Astro) y backend (Supabase) facilita el desarrollo y debugging.

### Modularidad del Backend

Diseñé el backend con una arquitectura modular que permite migrar fácilmente a NestJS si se necesita:

- **Capa de datos**: Supabase PostgreSQL con RLS
- **Capa de autenticación**: Supabase Auth
- **Capa de API**: Auto-generada por Supabase

Esta separación permite reemplazar Supabase por NestJS sin modificar el frontend significativamente.

### Alias de Importación con `@`

Configuré alias de importación con `@` para mejorar la mantenibilidad:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**Ventajas:**

1. **Imports limpios**: `import { supabase } from '@/lib/supabase'` vs `import { supabase } from '../../../lib/supabase'`
2. **Refactoring seguro**: Mover archivos no rompe imports relativos
3. **Legibilidad**: Rutas absolutas más fáciles de entender
4. **Consistencia**: Estándar en proyectos TypeScript modernos

**Ejemplo:**

```typescript
// Antes (relativo)
import { supabase } from '../../lib/supabase';
import type { User } from '../../types';

// Después (alias @)
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';
```

## 2. ¿Cómo maneja el sistema la seguridad de las transacciones?

### Autenticación

- **JWT (JSON Web Tokens)**: Supabase genera tokens JWT que se usan para autenticar cada petición.
- **Session Management**: La sesión se mantiene en el cliente con localStorage y se valida en cada petición.
- **Protección de rutas**: Las páginas del dashboard verifican la existencia del usuario antes de cargar datos.

### Roles de Usuario

Implementé un sistema de roles-flexible:

```typescript
type UserRole = 'cliente' | 'proveedor' | 'ambos';
```

- **Cliente**: Puede crear solicitudes y responder ofertas
- **Proveedor**: Puede crear ofertas y responder contraofertas
- **Ambos**: Puede realizar acciones de ambos roles

### Row Level Security (RLS)

Las políticas RLS garantizan que:

1. **Los usuarios solo ven sus propios datos** (excepto información pública)
2. **Los clientes solo pueden modificar sus solicitudes**
3. **Los proveedores solo pueden crear ofertas en solicitudes abiertas**
4. **Las contraofertas solo son visibles para las partes involucradas**

Ejemplo de política:

```sql
CREATE POLICY "solicitudes_insert_cliente" ON solicitudes
  FOR INSERT WITH CHECK (
    cliente_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('cliente', 'ambos')
    )
  );
```

## 3. ¿Cómo manejaría el crecimiento del sistema si tuviera que escalar?

### Escalado Horizontal

1. **Frontend**: Astro permite generar sites estáticos que CDN's como Vercel distribuyen globalmente.

2. **Backend**: Supabase escala automáticamente con la carga. Para cargas extremas, se puede migrar a:
   - **NestJS** con PostgreSQL dedicado
   - **Microservicios** para dominios específicos

3. **Base de datos**: 
   - Índices optimizados para consultas frecuentes
   - Particionamiento por fecha para tablas grandes
   - Read replicas para distribuir carga de lectura

### Migración a NestJS

El diseño modular permite migrar gradualmente:

1. **Fase 1**: Mantener Supabase para auth y base de datos
2. **Fase 2**: Crear NestJS API para lógica de negocio compleja
3. **Fase 3**: Migrar completamente a NestJS si es necesario

### Monitoreo y Observabilidad

- **Logs estructurados** para debugging
- **Métricas de rendimiento** con herramientas como Datadog
- **Alertas** para errores críticos
- **Health checks** para monitoreo de servicios

## 4. Otras Consideraciones

### Tipo Seguro

Usé TypeScript estricto con tipos definidos para toda la aplicación:

- Tipos para entidades de negocio
- Tipos para respuestas de API
- Tipos para eventos de UI

### Testing

La arquitectura facilita:
- **Unit tests** para stores de Zustand
- **Integration tests** para componentes
- **E2E tests** con Playwright o Cypress

### Accesibilidad

- Componentes semánticos de HTML
- Soporte para lectores de pantalla
- Navegación por teclado
- Contraste de colores adecuado

### Performance

- **Code splitting** automático con Astro
- **Lazy loading** de componentes React
- **Optimización de imágenes** con Astro
- **Minimización de bundle** con tree-shaking

## Conclusión

Esta arquitectura equilibra:
- **Rapidez de desarrollo** (1-2 horas para MVP)
- **Calidad de código** (tipos, testing, seguridad)
- **Escalabilidad** (preparado para crecimiento)
- **Mantenibilidad** (código limpio y documentado)

Es ideal para una prueba técnica donde se demostran buenas prácticas sin sobrecomplicar la solución.
