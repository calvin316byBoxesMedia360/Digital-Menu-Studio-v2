import { AbsoluteFill, Sequence, Video, Img, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { CanvasElement } from '../../store/useEditorStore';

export const RenderElement: React.FC<{ element: CanvasElement }> = ({ element }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Animación de entrada "Elegante" (0 a 1.5 segundos)
    // 1. Fade In
    const opacityEntry = interpolate(
        frame,
        [0, 25], // Entrada rápida de opacidad
        [0, 1],
        { extrapolateRight: 'clamp' }
    );

    // 2. Scale In (0.95 a 1.0) usando spring para suavidad premium
    const scaleEntry = spring({
        frame,
        fps,
        config: {
            damping: 12,
            stiffness: 100,
            mass: 0.5,
        },
    });

    // Mapeamos el spring (0 a 1) al rango de escala deseado (0.95 a 1)
    const finalScale = interpolate(scaleEntry, [0, 1], [0.95, 1]);

    return (
        <Sequence
            from={element.startFrame}
            durationInFrames={element.durationFrames}
        >
            <div
                style={{
                    position: 'absolute',
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                    transform: `rotate(${element.rotation}deg) scale(${finalScale})`,
                    opacity: opacityEntry,
                    zIndex: element.zIndex,
                    borderRadius: element.properties?.borderRadius || 0,
                    boxShadow: element.properties?.boxShadow || 'none',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {element.type === 'text' && (
                    <span
                        style={{
                            color: element.properties?.fillColor || '#ffffff',
                            fontSize: element.properties?.fontSize || 24,
                            fontFamily: element.properties?.fontFamily || 'sans-serif',
                            textAlign: element.properties?.textAlign || 'center',
                            width: '100%',
                            fontWeight: 'bold',
                        }}
                    >
                        {element.srcOrText}
                    </span>
                )}

                {element.type === 'video' && (
                    <Video
                        src={element.srcOrText}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                )}

                {element.type === 'image' && (
                    <Img
                        src={element.srcOrText}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                )}

                {element.type === 'slideshow' && (
                    <Slideshow
                        images={element.images || []}
                        durationPerImage={element.properties?.slideshowDuration || 120}
                    />
                )}
            </div>
        </Sequence>
    );
};

const Slideshow: React.FC<{ images: string[]; durationPerImage: number }> = ({ images, durationPerImage }) => {
    const frame = useCurrentFrame();

    if (images.length === 0) return null;

    const totalDuration = images.length * durationPerImage;
    const currentFrameInCycle = frame % totalDuration;
    const index = Math.floor(currentFrameInCycle / durationPerImage);
    const nextIndex = (index + 1) % images.length;

    // Lógica de Crossfade lento (1.5s = 90 frames a 60fps)
    const transitionFrames = 90;
    const frameInImage = currentFrameInCycle % durationPerImage;

    const opacity = interpolate(
        frameInImage,
        [durationPerImage - transitionFrames, durationPerImage],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const nextOpacity = interpolate(
        frameInImage,
        [durationPerImage - transitionFrames, durationPerImage],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    return (
        <AbsoluteFill>
            <Img
                src={images[index]}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity,
                }}
            />
            {frameInImage > (durationPerImage - transitionFrames) && (
                <Img
                    src={images[nextIndex]}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: nextOpacity,
                        position: 'absolute',
                        top: 0,
                    }}
                />
            )}
        </AbsoluteFill>
    );
};
