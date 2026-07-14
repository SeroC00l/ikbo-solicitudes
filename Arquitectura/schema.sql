-- Schema for IKBO Solicitudes System
-- Run this in Supabase SQL Editor

-- Create custom types (with IF NOT EXISTS)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('cliente', 'proveedor', 'ambos');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE solicitud_estado AS ENUM ('pendiente', 'en_proceso', 'completada', 'cancelada');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE oferta_estado AS ENUM ('pendiente', 'aceptada', 'rechazada', 'contraoferta');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE contraoferta_estado AS ENUM ('pendiente', 'aceptada', 'rechazada');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Usuarios table
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  rol user_role NOT NULL DEFAULT 'cliente',
  empresa TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Productos table
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  unidad TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Solicitudes table
CREATE TABLE IF NOT EXISTS solicitudes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  estado solicitud_estado NOT NULL DEFAULT 'pendiente',
  fecha_limite TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Solicitud Items table
CREATE TABLE IF NOT EXISTS solicitud_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_id UUID NOT NULL REFERENCES solicitudes(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  cantidad NUMERIC NOT NULL CHECK (cantidad > 0),
  especificaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ofertas table
CREATE TABLE IF NOT EXISTS ofertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_item_id UUID NOT NULL REFERENCES solicitud_items(id) ON DELETE CASCADE,
  proveedor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  precio_unitario NUMERIC NOT NULL CHECK (precio_unitario > 0),
  precio_total NUMERIC NOT NULL CHECK (precio_total > 0),
  tiempo_entrega_dias INTEGER NOT NULL CHECK (tiempo_entrega_dias > 0),
  condiciones TEXT,
  estado oferta_estado NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contraofertas table
CREATE TABLE IF NOT EXISTS contraofertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oferta_id UUID NOT NULL REFERENCES ofertas(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  precio_unitario NUMERIC NOT NULL CHECK (precio_unitario > 0),
  mensaje TEXT,
  estado contraoferta_estado NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_solicitudes_cliente ON solicitudes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes(estado);
CREATE INDEX IF NOT EXISTS idx_solicitud_items_solicitud ON solicitud_items(solicitud_id);
CREATE INDEX IF NOT EXISTS idx_ofertas_proveedor ON ofertas(proveedor_id);
CREATE INDEX IF NOT EXISTS idx_ofertas_solicitud_item ON ofertas(solicitud_item_id);
CREATE INDEX IF NOT EXISTS idx_ofertas_estado ON ofertas(estado);
CREATE INDEX IF NOT EXISTS idx_contraofertas_oferta ON contraofertas(oferta_id);
CREATE INDEX IF NOT EXISTS idx_contraofertas_cliente ON contraofertas(cliente_id);

-- Insert some sample products (skip if already exists)
INSERT INTO productos (nombre, descripcion, unidad) VALUES
('Laptop Dell', 'Laptop Dell Inspiron 15 pulgadas', 'unidad'),
('Monitor LG', 'Monitor LG 24 pulgadas Full HD', 'unidad'),
('Teclado Mecánico', 'Teclado mecánico RGB', 'unidad'),
('Mouse Inalámbrico', 'Mouse inalámbrico ergonómico', 'unidad'),
('Disco Duro SSD', 'Disco duro SSD 1TB', 'unidad'),
('Memoria RAM', 'Memoria RAM DDR4 16GB', 'unidad'),
('Impresora HP', 'Impresora HP LaserJet', 'unidad'),
('Router WiFi', 'Router WiFi 6', 'unidad'),
('Cable HDMI', 'Cable HDMI 2 metros', 'unidad'),
('Regleta Eléctrica', 'Regleta eléctrica 6 tomas', 'unidad')
ON CONFLICT (id) DO NOTHING;
