# Brainstorming: Digital Menu Studio v2.0

## 1. Concepto: "Figma para Pantallas Digitales"
- **Libertad Total:** Posicionamiento absoluto (X, Y, Z, Rotación).
- **Enfoque en Movimiento:** Animaciones de entrada, idle y salida por cada elemento.
- **Inteligencia de Dominio:** Conocimiento sobre menús (precios, categorías, tags de alérgenos).

## 2. El Cerebro: Store de Zustand
- Estructura de árbol plana para elementos.
- Sincronización optimizada para evitar re-renders masivos.
- Middleware para Undo/Redo.

## 3. IA: CuatesMenuGPT
- **Multimodal:** Entrada de imágenes (fotos de menús físicos) para OCR y vectorización.
- **Generativo:** Capacidad de inyectar elementos directamente al Canvas.
- **Refinamiento:** Ajustes por lenguaje natural ("Haz los precios dorados").

## 4. Renderizado: Remotion + Cloud Run
- Preview instantáneo en el editor.
- Renderizado distribuido para clips 4K 60fps.
- Integración con FFmpeg para post-procesamiento.

## 5. Monetización & Premium
- Exportación 4K.
- Animaciones exclusivas (Scene Morphing).
- Audio Reactivo.
