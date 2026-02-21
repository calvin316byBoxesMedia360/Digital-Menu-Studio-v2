import { registerRoot, Composition, getInputProps } from 'remotion';
import { MenuVideo } from './MenuVideo';
import { CanvasElement } from '../store/useEditorStore';
import React from 'react';

export const RemotionRoot: React.FC = () => {
    // Obtener props inyectadas desde la CLI o el Workflow
    const inputProps = getInputProps();

    return (
        <Composition
            id="DigitalMenu"
            component={MenuVideo}
            durationInFrames={600}
            fps={60}
            width={1080}
            height={1920}
            defaultProps={{
                projectId: (inputProps.projectId as string) || undefined,
                elements: [] as CanvasElement[],
            }}
        />
    );
};

registerRoot(RemotionRoot);
