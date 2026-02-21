"use client";

import React, { useRef, useState, useEffect } from "react";
import { Monitor, ZoomIn, ZoomOut, Maximize, Play, Image as ImageIcon, Send } from "lucide-react";
import { useEditorStore, CanvasElement } from "@/store/useEditorStore";
import { motion, AnimatePresence } from "framer-motion";
import { ExportModal } from "./ExportModal";

export const Canvas = () => {
    const { elements, selectedElementId, setSelectedElementId, updateElementPosition, projectId, showNotification } = useEditorStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    return (
        <div className="flex-1 bg-zinc-950 relative overflow-hidden flex flex-col">
            {/* Canvas Toolbar */}
            <div className="h-12 border-b border-zinc-900 bg-zinc-900/50 flex items-center justify-between px-4 z-10">
                <div className="flex items-center gap-4">
                    <div className="text-[11px] font-medium text-zinc-400 bg-zinc-800 px-2 py-1 rounded">
                        9:16 - 1080x1920
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsExportModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-[10px] font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-900/40 mr-4"
                    >
                        <Send size={12} />
                        Exportar MP4
                    </button>

                    <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded px-2 text-zinc-400">
                        <button
                            onClick={() => showNotification("Zoom Out en desarrollo", "info")}
                            className="p-1 hover:text-white transition-colors"
                        ><ZoomOut size={14} /></button>
                        <span className="text-[10px] px-2 font-mono">45%</span>
                        <button
                            onClick={() => showNotification("Zoom In en desarrollo", "info")}
                            className="p-1 hover:text-white transition-colors"
                        ><ZoomIn size={14} /></button>
                    </div>
                    <button
                        onClick={() => showNotification("Pantalla completa en desarrollo", "info")}
                        className="p-2 text-zinc-400 hover:text-white transition-colors bg-zinc-800 rounded"
                    >
                        <Maximize size={14} />
                    </button>
                </div>
            </div>

            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                projectId={projectId}
            />

            {/* Workspace Area */}
            <div
                className="flex-1 overflow-auto p-12 flex items-center justify-center bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px]"
                onClick={() => setSelectedElementId(null)}
            >
                {/* The 9:16 Video Frame Container */}
                <div
                    ref={containerRef}
                    className="relative aspect-[9/16] h-[120%] max-h-full bg-black shadow-2xl border border-zinc-800 overflow-hidden group"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Subtle Video Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

                    {/* Placeholder Content (only visible when empty) */}
                    {elements.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4 pointer-events-none">
                            <Monitor className="text-zinc-800 transition-transform group-hover:scale-110 duration-500" size={64} />
                            <div className="space-y-1">
                                <h3 className="text-zinc-600 font-bold uppercase tracking-[0.2em] text-xs">Previsualización de Video</h3>
                                <p className="text-zinc-700 text-[10px] font-mono">1080 x 1920 @ 60FPS</p>
                            </div>
                        </div>
                    )}

                    {/* Rendered Elements */}
                    {elements.map((el) => {
                        const isSelected = selectedElementId === el.id;

                        return (
                            <motion.div
                                key={el.id}
                                drag
                                dragMomentum={false}
                                onDragStart={() => setSelectedElementId(el.id)}
                                onDragEnd={(_, info) => {
                                    updateElementPosition(el.id, el.x + info.offset.x, el.y + info.offset.y);
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedElementId(el.id);
                                }}
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    x: el.x,
                                    y: el.y,
                                    width: el.width,
                                    height: el.height,
                                    rotate: el.rotation,
                                    zIndex: el.zIndex,
                                    cursor: 'move',
                                    userSelect: 'none',
                                    borderRadius: el.properties?.borderRadius || 0,
                                    boxShadow: el.properties?.boxShadow || 'none',
                                }}
                                className={`flex items-center justify-center transition-shadow overflow-hidden ${isSelected ? "shadow-[0_0_0_2px_#a855f7]" : ""
                                    }`}
                            >
                                {el.type === 'text' && (
                                    <span
                                        style={{
                                            color: el.properties?.fillColor,
                                            fontSize: el.properties?.fontSize,
                                            fontFamily: el.properties?.fontFamily,
                                            textAlign: el.properties?.textAlign,
                                            display: 'block',
                                            width: '100%',
                                        }}
                                        className="font-bold tracking-tight whitespace-nowrap"
                                    >
                                        {el.srcOrText}
                                    </span>
                                )}

                                {el.type === 'video' && (
                                    <video
                                        src={el.srcOrText}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover pointer-events-none"
                                    />
                                )}

                                {el.type === 'image' && (
                                    <img
                                        src={el.srcOrText}
                                        alt={el.name}
                                        className="w-full h-full object-cover pointer-events-none"
                                    />
                                )}

                                {el.type === 'slideshow' && (
                                    <SlideshowPreview images={el.images || []} />
                                )}
                            </motion.div>
                        );
                    })}

                    {/* Guidelines Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 border-x border-zinc-800 flex justify-center">
                        <div className="w-px h-full bg-zinc-700" />
                    </div>
                    <div className="absolute inset-0 pointer-events-none opacity-20 border-y border-zinc-800 flex flex-col justify-center">
                        <div className="w-full h-px bg-zinc-700" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente auxiliar para la previsualización del Carrusel
const SlideshowPreview = ({ images }: { images: string[] }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 3000); // 3 segundos para el preview del editor
        return () => clearInterval(interval);
    }, [images]);

    if (images.length === 0) {
        return (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <ImageIcon className="text-zinc-700" size={32} />
            </div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            <motion.img
                key={images[index]}
                src={images[index]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="w-full h-full object-cover pointer-events-none"
            />
        </AnimatePresence>
    );
};
