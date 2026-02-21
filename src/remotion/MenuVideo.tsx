import { AbsoluteFill, useVideoConfig } from 'remotion';
import { CanvasElement } from '@/store/useEditorStore';
import { RenderElement } from './components/RenderElement';

export const MenuVideo: React.FC<{ elements: CanvasElement[] }> = ({ elements }) => {
    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {/* Fondo / Patrón base si se desea */}

            {elements.map((el) => (
                <RenderElement key={el.id} element={el} />
            ))}
        </AbsoluteFill>
    );
};
