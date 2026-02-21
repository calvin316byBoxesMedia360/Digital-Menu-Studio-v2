import { create } from "zustand";

export type ElementType = 'text' | 'image' | 'video' | 'slideshow';

export interface CanvasElement {
    id: string;              // UUID único
    type: ElementType;       // Tipo de elemento
    name: string;            // Nombre para la capa en la línea de tiempo

    // Posicionamiento Absoluto (Lienzo)
    x: number;               // Posición X en píxeles
    y: number;               // Posición Y en píxeles
    width: number;           // Ancho
    height: number;          // Alto
    rotation: number;        // Rotación en grados
    zIndex: number;          // Orden de la capa (profundidad)

    // Contenido
    srcOrText: string;       // Texto o URL (single asset)
    images?: string[];       // Array de URLs para slideshow

    // Propiedades Visuales
    properties?: {
        fillColor?: string;    // Color HEX o RGB
        fontFamily?: string;   // Fuente tipográfica
        fontSize?: number;
        textAlign?: 'left' | 'center' | 'right';
        borderRadius?: number; // Para esquinas redondeadas (video/imágenes)
        boxShadow?: string;    // Sombra (ej. "0 10px 30px rgba(0,0,0,0.5)")
        slideshowDuration?: number; // Duración por imagen en frames
    };

    // Propiedades de Tiempo
    startFrame: number;      // Fotograma donde aparece (60fps)
    durationFrames: number;  // Cuánto dura en pantalla
}

export interface ProjectAsset {
    id: string;
    project_id: string;
    storage_url: string;
    asset_type: 'image' | 'video';
    created_at: string;
}

interface EditorState {
    projectId: string | null;
    projectName: string;
    elements: CanvasElement[];
    assets: ProjectAsset[];
    selectedElementId: string | null;
    lastSavedState: string;
    notification: { message: string, type: 'info' | 'success' | 'error' } | null;

    // Acciones
    setProjectId: (id: string | null) => void;
    setProjectName: (name: string) => void;
    setElements: (elements: CanvasElement[]) => void;
    setAssets: (assets: ProjectAsset[]) => void;
    addAsset: (asset: ProjectAsset) => void;
    addElement: (element: CanvasElement) => void;
    updateElementPosition: (id: string, x: number, y: number) => void;
    updateElementProperties: (id: string, properties: Partial<CanvasElement>) => void;
    removeElement: (id: string) => void;
    setSelectedElementId: (id: string | null) => void;
    saveToSupabase: () => Promise<void>;
    fetchAssets: () => Promise<void>;
    showNotification: (message: string, type?: 'info' | 'success' | 'error') => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
    projectId: null,
    projectName: 'Nuevo Proyecto',
    elements: [],
    assets: [],
    selectedElementId: null,
    lastSavedState: '[]',
    notification: null,

    showNotification: (message, type = 'info') => {
        set({ notification: { message, type } });
        setTimeout(() => set({ notification: null }), 3000);
    },

    setProjectId: (id) => set({ projectId: id }),
    setProjectName: (name) => set({ projectName: name }),
    setElements: (elements) => set({
        elements,
        lastSavedState: JSON.stringify(elements)
    }),
    setAssets: (assets) => set({ assets }),
    addAsset: (asset) => set((state) => ({ assets: [asset, ...state.assets] })),

    addElement: (element) =>
        set((state) => ({ elements: [...state.elements, element] })),

    updateElementPosition: (id, x, y) =>
        set((state) => ({
            elements: state.elements.map((el) =>
                el.id === id ? { ...el, x, y } : el
            ),
        })),

    updateElementProperties: (id, properties) =>
        set((state) => ({
            elements: state.elements.map((el) => {
                if (el.id === id) {
                    const newProperties = properties.properties
                        ? { ...el.properties, ...properties.properties }
                        : el.properties;
                    return { ...el, ...properties, properties: newProperties };
                }
                return el;
            }),
        })),

    removeElement: (id) =>
        set((state) => ({
            elements: state.elements.filter((el) => el.id !== id),
            selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
        })),

    setSelectedElementId: (id) => set({ selectedElementId: id }),

    saveToSupabase: async () => {
        const { projectId, elements, lastSavedState } = get();
        const currentState = JSON.stringify(elements);

        if (!projectId || currentState === lastSavedState) return;

        try {
            const { supabase } = await import('@/lib/supabase');
            const { error } = await supabase
                .from('projects')
                .update({
                    canvas_state: elements,
                    updated_at: new Date().toISOString()
                })
                .eq('id', projectId);

            if (error) throw error;
            set({ lastSavedState: currentState });
            console.log('✅ Proyecto guardado automáticamente');
        } catch (err) {
            console.error('❌ Error al guardar en Supabase:', err);
        }
    },

    fetchAssets: async () => {
        const { projectId } = get();
        if (!projectId) return;

        try {
            const { supabase } = await import('@/lib/supabase');
            const { data, error } = await supabase
                .from('assets')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            set({ assets: data || [] });
        } catch (err) {
            console.error('❌ Error al cargar assets:', err);
        }
    }
}));
