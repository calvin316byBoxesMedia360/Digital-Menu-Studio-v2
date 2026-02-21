import { registerRoot, Composition } from 'remotion';
import { MenuVideo } from './MenuVideo';
import { CanvasElement } from '../store/useEditorStore';

export const RemotionRoot: React.FC = () => {
    return (
        <Composition
            id= "DigitalMenu"
    component = { MenuVideo }
    durationInFrames = { 600}
    fps = { 60}
    width = { 1080}
    height = { 1920}
    defaultProps = {{
        elements: [] as CanvasElement[],
            }
}
        />
    );
};

registerRoot(RemotionRoot);
