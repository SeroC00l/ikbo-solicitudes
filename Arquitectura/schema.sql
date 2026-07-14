-- Schema for FlorFutures - Sistema de Contratos de Futuros de Flores
-- Run this in Supabase SQL Editor

-- Create custom types (with IF NOT EXISTS)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('comprador', 'vendedor', 'ambos');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE contrato_estado AS ENUM ('pendiente', 'aceptado', 'en_proceso', 'completado', 'cancelado', 'vencido');
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
  rol user_role NOT NULL DEFAULT 'comprador',
  empresa TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flores table
CREATE TABLE IF NOT EXISTS flores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL,
  color TEXT NOT NULL,
  origen TEXT NOT NULL,
  vida_util_dias INTEGER NOT NULL CHECK (vida_util_dias > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contratos table
CREATE TABLE IF NOT EXISTS contratos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comprador_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  estado contrato_estado NOT NULL DEFAULT 'pendiente',
  fecha_entrega TIMESTAMP WITH TIME ZONE NOT NULL,
  precio_total NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contrato Items table
CREATE TABLE IF NOT EXISTS contrato_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id UUID NOT NULL REFERENCES contratos(id) ON DELETE CASCADE,
  flor_id UUID NOT NULL REFERENCES flores(id) ON DELETE CASCADE,
  toneladas NUMERIC NOT NULL CHECK (toneladas > 0),
  precio_por_tonelada NUMERIC NOT NULL CHECK (precio_por_tonelada > 0),
  especificaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ofertas table
CREATE TABLE IF NOT EXISTS ofertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_item_id UUID NOT NULL REFERENCES contrato_items(id) ON DELETE CASCADE,
  vendedor_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  precio_por_tonelada NUMERIC NOT NULL CHECK (precio_por_tonelada > 0),
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
  comprador_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  precio_por_tonelada NUMERIC NOT NULL CHECK (precio_por_tonelada > 0),
  mensaje TEXT,
  estado contraoferta_estado NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contratos_comprador ON contratos(comprador_id);
CREATE INDEX IF NOT EXISTS idx_contratos_estado ON contratos(estado);
CREATE INDEX IF NOT EXISTS idx_contrato_items_contrato ON contrato_items(contrato_id);
CREATE INDEX IF NOT EXISTS idx_ofertas_vendedor ON ofertas(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_ofertas_contrato_item ON ofertas(contrato_item_id);
CREATE INDEX IF NOT EXISTS idx_ofertas_estado ON ofertas(estado);
CREATE INDEX IF NOT EXISTS idx_contraofertas_oferta ON contraofertas(oferta_id);
CREATE INDEX IF NOT EXISTS idx_contraofertas_comprador ON contraofertas(comprador_id);

-- Insert sample flowers
INSERT INTO flores (nombre, tipo, color, origen, vida_util_dias) VALUES
('Rosa Roja Premium', 'rosa', 'Rojo', 'Colombia', 12),
('Rosa Blanca importada', 'rosa', 'Blanco', 'Ecuador', 14),
('Clavel Rojo', 'clavel', 'Rojo', 'Colombia', 10),
('Clavel Bicolor', 'clavel', 'Rojo/Blanco', 'Colombia', 10),
('Lirio Blanco', 'lirio', 'Blanco', 'Holanda', 8),
('Lirio Rosa', 'lirio', 'Rosa', 'Holanda', 8),
('Gerbera Naranja', 'gerbera', 'Naranja', 'Colombia', 7),
('Gerbera Amarilla', 'gerbera', 'Amarillo', 'Colombia', 7),
('Crisantemo Blanco', 'crisantemo', 'Blanco', 'Colombia', 14),
('Crisantemo Amarillo', 'crisantemo', 'Amarillo', 'Colombia', 14),
('Tulipán Rojo', 'tulipán', 'Rojo', 'Holanda', 5),
('Tulipán Amarillo', 'tulipán', 'Amarillo', 'Holanda', 5),
('Orquídea Blanca', 'orquídea', 'Blanco', 'Tailandia', 21),
('Orquídea Rosa', 'orquídea', 'Rosa', 'Tailandia', 21),
('Girasol Premium', 'girasol', 'Amarillo', 'Argentina', 6)
ON CONFLICT (id) DO NOTHING;
