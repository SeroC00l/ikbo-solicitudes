# FlorFutures - Sistema de Contratos de Futuros de Flores

## Descripción

Plataforma web para gestionar contratos de futuros de flores premium, conectando compradores y vendedores para acordar precios y cantidades de toneladas de flores frescas.
NOTA: El pryecto esta desplegado y puedes probarlo directamente en https://ikbo-solicitudes.vercel.app/

## Características

- **Autenticación segura** con Supabase Auth (JWT)
- **Roles de usuario**: Comprador, Vendedor, Ambos
- **Gestión de contratos** de futuros con items de flores
- **Sistema de ofertas** por tonelada con precios y condiciones
- **Contraofertas** para negociación
- **RLS (Row Level Security)** para seguridad a nivel de base de datos
- **Flores premium**: Rosa, Clavel, Lirio, Gerbera, Crisantemo, Tulipán, Orquídea, Girasol

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | Astro + React |
| Estado | Zustand |
| Backend | Supabase (PostgreSQL + Auth + API) |
| Deploy | Vercel |

### Alias de Importación

Se utiliza el alias `@` para imports limpios y mantenibles:

```typescript
// En lugar de rutas relativas
import { supabase } from '../../../lib/supabase';

// Se usa el alias @
import { supabase } from '@/lib/supabase';
```

## Requisitos

- Node.js >= 22.12.0
- Bun (recomendado) o npm
- Cuenta en Supabase

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/SeroC00l/ikbo-solicitudes
cd ikbo-solicitudes
```

### 2. Instalar dependencias

```bash
bun install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y completa las variables:

```bash
cp .env.example .env
```

Edita `.env`:

```
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 4. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve a SQL Editor
3. Ejecuta el script `Arquitectura/schema.sql`
4. Ejecuta el script `Arquitectura/rls_policies.sql`

### 5. Ejecutar en desarrollo

```bash
bun run dev
```

La aplicación estará disponible en `http://localhost:4321`

## Estructura del Proyecto

```
ikbo-solicitudes/
├── src/
│   ├── components/      # Componentes UI y lógica
│   ├── layouts/         # Layouts de páginas
│   ├── pages/           # Rutas y páginas
│   ├── stores/          # Estado con Zustand
│   ├── lib/             # Utilidades y configuración
│   └── types/           # Tipos TypeScript
├── Arquitectura/        # Documentación técnica
│   ├── schema.sql       # Schema de base de datos
│   ├── rls_policies.sql # Políticas de seguridad
│   ├── Justificacion.md # Decisiones técnicas
│   └── Gestión de equipo.md
└── public/              # Assets estáticos
```

## Despliegue

### Vercel

1. Push el código a GitHub/GitLab
2. Importa el proyecto en Vercel
3. Configura las variables de entorno
4. Deploy automático

### Variables de entorno para Vercel

```
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

## Funcionalidades

### Compradores
- Crear contratos de futuros con flores
- Ver ofertas recibidas
- Aceptar, rechazar o contraofertar

### Vendedores
- Ver contratos disponibles
- Crear ofertas por tonelada
- Responder a contraofertas

## Seguridad

- Autenticación JWT con Supabase
- Row Level Security (RLS) en todas las tablas
- Roles de usuario verificados
- Sin exposición de datos sensibles

## License

Proyecto de prueba técnica para IKBO SAS
