# Digital Menu Studio v2.0 - Documento Maestro

## 🏗️ Arquitectura y Reglas del Proyecto

### 1. Stack Tecnológico Estricto
- **Frontend:** Next.js 15 (Estable), Tailwind CSS v4, Zustand, Framer Motion, Lucide React.
- **Backend (Producción):** Supabase (PostgreSQL, Storage, Auth).
- **Video:** Remotion + FFmpeg.
- **Infraestructura:** GCP Cloud Run para renderizado escalable.

### 2. Directriz de Infraestructura (Desarrollo)
⚠️ **Prohibido ejecutar renders pesados de Remotion en local.**
- El entorno local se utiliza únicamente para maquetación y previsualización ligera.
- **Flujo de Trabajo:** Las pruebas de renderizado se realizarán mediante **GitHub Actions**.
- Al hacer push a ramas específicas, GitHub Actions renderizará el .mp4 y lo adjuntará como un artefacto descargable para validación.

### 3. Filosofía de Diseño (Ingeniería de Diseño)
- **Rendimiento sobre Estética:** Prohibido el uso de `backdrop-filter` (Glassmorphism) en el editor para mantener 60fps constantes.
- **Estética:** Colores sólidos, bordes limpios, estilo herramientas profesionales (Figma/Adobe).
- **Interactividad:** Edición in-place, snapping magnético, fluidez máxima.

### 💎 Capacidades Premium Operativas
- [x] **Carrusel de Imágenes**: Soporte para múltiples assets con transición Crossfade lenta (vía Framer Motion).
- [x] **Vídeo Picture-in-Picture**: MP4s con esquinas redondeadas (`borderRadius`) y sombras profundas (`boxShadow`).
- [x] **Tipografía Dinámica**: Fuentes Google (Bebas Neue, Playfair) integradas.
- [x] **Drag & Drop a 60FPS**: Posicionamiento absoluto y escalado fluido.

## � Hoja de Ruta (Sprints)

### 🔴 Fase 1: Layout Base del Editor (SPRINT ACTUAL)
- [x] Downgrade a Next.js 15 Estable.
- [x] Estructura Grid/Flex: Sidebar, Canvas, Timeline.
- [x] Sidebar interactivo con pestañas y drawer (Framer Motion).
- [x] Fondos y patrones sutiles para áreas de trabajo.
*Estado: COMPLETADO. Listo para revisión.*

### 🟡 Fase 2: Motor de Lienzo y Manipulación (COMPLETADO)
- [x] Configuración del store global (CanvasElement Schema).
- [x] Implementación de posicionamiento absoluto (X, Y).
- [x] Sistema de Drag & Drop fluido con Framer Motion.
- [x] Selección activa de elementos.
- [x] **Panel de Propiedades Contextuales**: Edición de texto, color, fuentes premium y tamaño en tiempo real.
*Estado: COMPLETADO al 100%. El editor visual es plenamente funcional para diseño.*
Base lista para integración con Supabase.

### 🟡 Fase 3: Persistencia y Backend (Supabase) - EN PROGRESO
- [x] Instalación de `@supabase/supabase-js`.
- [x] Configuración del cliente y variables de entorno.
- [x] Esquema de base de datos SQL (Tabla `projects` y `assets`).
- [x] **Lógica de Autoguardado (Debounce 1.5s)**: Persistencia automática del estado del lienzo.
- [x] **Integración de Supabase Storage**: Subida de PNG/JPG/MP4 al bucket `menu-assets`.
- [x] **Galería de Medios**: Registro en la tabla `assets` y visualización dinámica en el Sidebar.
- [x] **Inyección Inteligente**: Los assets subidos se transforman en elementos de Vídeo PiP o Imágenes en el lienzo con un clic.
*Estado: FASE 3 COMPLETADA AL 100%. Persistencia y gestión de medios operativa.*

### 🟡 Fase 4: Motor de Video (Remotion + CI/CD) - EN PROGRESO
- [x] Instalación de Remotion Core y dependencias de renderizado.
- [x] Configuración de GitHub Actions (`render-video.yml`) con FFmpeg.
- [x] Arquitectura de Composición Remotion (1080x1920).
- [x] Soporte para **Slideshow con Crossfade** y **Video PiP** en el render.
- [ ] Renderizado dinámico basado en estados de Supabase.
*Estado: INFRAESTRUCTURA DE RENDERIZADO CLOUD OPERATIVA. Estructura de Remotion lista para escalado.*

### 🟡 Fase 5: IA Multimodal
- Integración de asistente inteligente en el Sidebar.

---
**Ubicación:** `c:\Users\boxes\.gemini\antigravity\playground\quantum-newton\digital-menu-studio-v2`
