import { AbsoluteFill, delayRender, continueRender } from 'remotion';
import { useCallback, useEffect, useState } from 'react';
import { CanvasElement } from '../store/useEditorStore';
import { RenderElement } from './components/RenderElement';
import { supabase } from '../lib/supabase';

export const MenuVideo: React.FC<{ projectId?: string; elements?: CanvasElement[] }> = ({
    projectId,
    elements: initialElements
}) => {
    const [fetchedElements, setFetchedElements] = useState<CanvasElement[] | null>(null);
    const [handle] = useState(() => delayRender('Cargando datos de proyecto de Supabase'));

    const fetchData = useCallback(async () => {
        if (!projectId) {
            setFetchedElements(initialElements || []);
            continueRender(handle);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('projects')
                .select('canvas_state')
                .eq('id', projectId)
                .single();

            if (error) throw error;

            // Castear el canvas_state (JSONB) al tipo CanvasElement[]
            setFetchedElements((data.canvas_state as unknown as CanvasElement[]) || []);
        } catch (err) {
            console.error('❌ Error rendering project:', err);
            setFetchedElements([]);
        } finally {
            continueRender(handle);
        }
    }, [projectId, initialElements, handle]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const elementsToRender = fetchedElements || initialElements || [];

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {elementsToRender.map((el) => (
                <RenderElement key={el.id} element={el} />
            ))}
        </AbsoluteFill>
    );
};
