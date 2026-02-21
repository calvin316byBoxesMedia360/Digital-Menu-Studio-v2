-- TABLA DE PROYECTOS
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL DEFAULT 'Nuevo Proyecto',
    canvas_state JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FUNCIÓN PARA ACTUALIZAR EL TIMESTAMP
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- TABLA DE ASSETS
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    storage_url TEXT NOT NULL,
    asset_type TEXT CHECK (asset_type IN ('image', 'video')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONFIGURACIÓN DE STORAGE
INSERT INTO storage.buckets (id, name, public) 
VALUES ('menu-assets', 'menu-assets', true)
ON CONFLICT (id) DO NOTHING;

-- POLÍTICAS DE STORAGE (Permitir subidas públicas para pruebas)
CREATE POLICY "Acceso Público" ON storage.objects FOR ALL USING (bucket_id = 'menu-assets');
