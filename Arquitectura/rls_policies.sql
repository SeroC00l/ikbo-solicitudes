-- Row Level Security Policies for FlorFutures
-- Run this after creating the schema

-- Enable RLS on all tables
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE flores ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contrato_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ofertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contraofertas ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "usuarios_select_own" ON usuarios;
  DROP POLICY IF EXISTS "usuarios_select_public" ON usuarios;
  DROP POLICY IF EXISTS "usuarios_insert_own" ON usuarios;
  DROP POLICY IF EXISTS "usuarios_update_own" ON usuarios;
  DROP POLICY IF EXISTS "flores_select_public" ON flores;
  DROP POLICY IF EXISTS "flores_insert_authenticated" ON flores;
  DROP POLICY IF EXISTS "contratos_select_involved" ON contratos;
  DROP POLICY IF EXISTS "contratos_insert_comprador" ON contratos;
  DROP POLICY IF EXISTS "contratos_update_owner" ON contratos;
  DROP POLICY IF EXISTS "contrato_items_select_contrato" ON contrato_items;
  DROP POLICY IF EXISTS "contrato_items_insert_comprador" ON contrato_items;
  DROP POLICY IF EXISTS "ofertas_select_involved" ON ofertas;
  DROP POLICY IF EXISTS "ofertas_insert_vendedor" ON ofertas;
  DROP POLICY IF EXISTS "ofertas_update_vendedor" ON ofertas;
  DROP POLICY IF EXISTS "ofertas_update_comprador" ON ofertas;
  DROP POLICY IF EXISTS "contraofertas_select_involved" ON contraofertas;
  DROP POLICY IF EXISTS "contraofertas_insert_comprador" ON contraofertas;
  DROP POLICY IF EXISTS "contraofertas_update_vendedor" ON contraofertas;
EXCEPTION WHEN undefined_object THEN null;
END $$;

-- Usuarios policies
CREATE POLICY "usuarios_select_own" ON usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "usuarios_select_public" ON usuarios
  FOR SELECT USING (true);

CREATE POLICY "usuarios_insert_own" ON usuarios
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "usuarios_update_own" ON usuarios
  FOR UPDATE USING (auth.uid() = id);

-- Flores policies (public read)
CREATE POLICY "flores_select_public" ON flores
  FOR SELECT USING (true);

CREATE POLICY "flores_insert_authenticated" ON flores
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Contratos policies
CREATE POLICY "contratos_select_involved" ON contratos
  FOR SELECT USING (
    comprador_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('vendedor', 'ambos')
    )
  );

CREATE POLICY "contratos_insert_comprador" ON contratos
  FOR INSERT WITH CHECK (
    comprador_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('comprador', 'ambos')
    )
  );

CREATE POLICY "contratos_update_owner" ON contratos
  FOR UPDATE USING (
    comprador_id = auth.uid()
  );

-- Contrato Items policies
CREATE POLICY "contrato_items_select_contrato" ON contrato_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM contratos
      WHERE id = contrato_items.contrato_id
      AND (
        comprador_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM usuarios
          WHERE id = auth.uid() AND rol IN ('vendedor', 'ambos')
        )
      )
    )
  );

CREATE POLICY "contrato_items_insert_comprador" ON contrato_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM contratos
      WHERE id = contrato_items.contrato_id
      AND comprador_id = auth.uid()
    )
  );

-- Ofertas policies
CREATE POLICY "ofertas_select_involved" ON ofertas
  FOR SELECT USING (
    vendedor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM contrato_items ci
      JOIN contratos c ON c.id = ci.contrato_id
      WHERE ci.id = ofertas.contrato_item_id
      AND c.comprador_id = auth.uid()
    )
  );

CREATE POLICY "ofertas_insert_vendedor" ON ofertas
  FOR INSERT WITH CHECK (
    vendedor_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('vendedor', 'ambos')
    )
  );

CREATE POLICY "ofertas_update_vendedor" ON ofertas
  FOR UPDATE USING (
    vendedor_id = auth.uid()
  );

CREATE POLICY "ofertas_update_comprador" ON ofertas
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM contrato_items ci
      JOIN contratos c ON c.id = ci.contrato_id
      WHERE ci.id = ofertas.contrato_item_id
      AND c.comprador_id = auth.uid()
    )
  );

-- Contraofertas policies
CREATE POLICY "contraofertas_select_involved" ON contraofertas
  FOR SELECT USING (
    comprador_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM ofertas
      WHERE id = contraofertas.oferta_id
      AND vendedor_id = auth.uid()
    )
  );

CREATE POLICY "contraofertas_insert_comprador" ON contraofertas
  FOR INSERT WITH CHECK (
    comprador_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('comprador', 'ambos')
    )
  );

CREATE POLICY "contraofertas_update_vendedor" ON contraofertas
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM ofertas
      WHERE id = contraofertas.oferta_id
      AND vendedor_id = auth.uid()
    )
  );
