-- Row Level Security Policies for IKBO Solicitudes System
-- Run this after creating the schema

-- Enable RLS on all tables
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitud_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ofertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contraofertas ENABLE ROW LEVEL SECURITY;

-- Usuarios policies
CREATE POLICY "usuarios_select_own" ON usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "usuarios_select_public" ON usuarios
  FOR SELECT USING (true);

CREATE POLICY "usuarios_insert_own" ON usuarios
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "usuarios_update_own" ON usuarios
  FOR UPDATE USING (auth.uid() = id);

-- Productos policies (public read)
CREATE POLICY "productos_select_public" ON productos
  FOR SELECT USING (true);

CREATE POLICY "productos_insert_authenticated" ON productos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Solicitudes policies
CREATE POLICY "solicitudes_select_owner" ON solicitudes
  FOR SELECT USING (
    cliente_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('proveedor', 'ambos')
    )
  );

CREATE POLICY "solicitudes_insert_cliente" ON solicitudes
  FOR INSERT WITH CHECK (
    cliente_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('cliente', 'ambos')
    )
  );

CREATE POLICY "solicitudes_update_owner" ON solicitudes
  FOR UPDATE USING (
    cliente_id = auth.uid()
  );

-- Solicitud Items policies
CREATE POLICY "solicitud_items_select_solicitud" ON solicitud_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM solicitudes
      WHERE id = solicitud_items.solicitud_id
      AND (
        cliente_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM usuarios
          WHERE id = auth.uid() AND rol IN ('proveedor', 'ambos')
        )
      )
    )
  );

CREATE POLICY "solicitud_items_insert_solicitud_owner" ON solicitud_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM solicitudes
      WHERE id = solicitud_items.solicitud_id
      AND cliente_id = auth.uid()
    )
  );

-- Ofertas policies
CREATE POLICY "ofertas_select_involved" ON ofertas
  FOR SELECT USING (
    proveedor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM solicitud_items si
      JOIN solicitudes s ON s.id = si.solicitud_id
      WHERE si.id = ofertas.solicitud_item_id
      AND s.cliente_id = auth.uid()
    )
  );

CREATE POLICY "ofertas_insert_proveedor" ON ofertas
  FOR INSERT WITH CHECK (
    proveedor_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('proveedor', 'ambos')
    )
  );

CREATE POLICY "ofertas_updateProveedor" ON ofertas
  FOR UPDATE USING (
    proveedor_id = auth.uid()
  );

CREATE POLICY "ofertas_updateCliente" ON ofertas
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM solicitud_items si
      JOIN solicitudes s ON s.id = si.solicitud_id
      WHERE si.id = ofertas.solicitud_item_id
      AND s.cliente_id = auth.uid()
    )
  );

-- Contraofertas policies
CREATE POLICY "contraofertas_select_involved" ON contraofertas
  FOR SELECT USING (
    cliente_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM ofertas
      WHERE id = contraofertas.oferta_id
      AND proveedor_id = auth.uid()
    )
  );

CREATE POLICY "contraofertas_insert_cliente" ON contraofertas
  FOR INSERT WITH CHECK (
    cliente_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE id = auth.uid() AND rol IN ('cliente', 'ambos')
    )
  );

CREATE POLICY "contraofertas_update_proveedor" ON contraofertas
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM ofertas
      WHERE id = contraofertas.oferta_id
      AND proveedor_id = auth.uid()
    )
  );
