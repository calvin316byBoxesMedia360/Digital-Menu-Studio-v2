"use client";

import React, { useRef } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import {
    Type,
    Palette,
    Type as TypeIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Trash2,
    Layers,
    Box,
    Image as ImageIcon,
    Plus,
    X,
    Layout,
    Loader2
} from "lucide-react";

const FONTS = [
    { name: "Inter", value: "var(--font-geist-sans)" },
    { name: "Roboto", value: "var(--font-roboto)" },
    { name: "Playfair Display", value: "var(--font-playfair)" },
    { name: "Bebas Neue", value: "var(--font-bebas)" },
];

const SHADOWS = [
    { name: "Ninguna", value: "none" },
    { name: "Suave", value: "0 4px 12px rgba(0,0,0,0.2)" },
    { name: "Premium", value: "0 10px 30px rgba(0,0,0,0.5)" },
    { name: "Brillante", value: "0 0 20px rgba(168, 85, 247, 0.4)" },
];

export const PropertiesPanel = () => {
    const { elements, selectedElementId, updateElementProperties, removeElement } = useEditorStore();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = React.useState(false);
    const projectId = useEditorStore((state) => state.projectId);

    const selectedElement = elements.find((el) => el.id === selectedElementId);

    if (!selectedElement) {
        return (
            <div className="w-64 border-l border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="p-4 rounded-full bg-zinc-900 mb-4">
                    <Layers className="text-zinc-700" size={24} />
                </div>
                <p className="text-sm text-zinc-500">Selecciona un elemento para editar sus propiedades</p>
            </div>
        );
    }

    const handleChange = (key: string, value: any) => {
        if (key === 'srcOrText') {
            updateElementProperties(selectedElement.id, { srcOrText: value });
        } else if (key === 'images') {
            updateElementProperties(selectedElement.id, { images: value });
        } else {
            updateElementProperties(selectedElement.id, {
                properties: {
                    [key]: value
                }
            });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !projectId) return;

        setIsUploading(true);
        try {
            const { supabase } = await import('@/lib/supabase');
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${projectId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('menu-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('menu-assets')
                .getPublicUrl(filePath);

            const currentImages = selectedElement.images || [];
            handleChange('images', [...currentImages, publicUrl]);
        } catch (error) {
            console.error("❌ Error en la subida:", error);
            alert("Error al subir la imagen.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const addSlideImage = () => {
        const currentImages = selectedElement.images || [];
        if (currentImages.length < 5) {
            fileInputRef.current?.click();
        }
    };

    const removeSlideImage = (index: number) => {
        const currentImages = selectedElement.images || [];
        const newImages = currentImages.filter((_, i) => i !== index);
        handleChange('images', newImages);
    };

    return (
        <div className="w-64 border-l border-zinc-800 bg-zinc-950 flex flex-col overflow-y-auto">
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Layout size={14} />
                    {selectedElement.type.toUpperCase()}
                </h2>
            </div>

            <div className="p-4 space-y-6">
                {/* Content Section based on type */}
                {selectedElement.type === 'text' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Texto</label>
                            <textarea
                                value={selectedElement.srcOrText}
                                onChange={(e) => handleChange('srcOrText', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-purple-500 focus:outline-none min-h-[60px] resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Fuente</label>
                            <select
                                value={selectedElement.properties?.fontFamily}
                                onChange={(e) => handleChange('fontFamily', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-purple-500 focus:outline-none"
                            >
                                {FONTS.map((font) => (
                                    <option key={font.value} value={font.value}>{font.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Tamaño</label>
                                <span className="text-[10px] font-mono text-zinc-400">{selectedElement.properties?.fontSize}px</span>
                            </div>
                            <input
                                type="range"
                                min="12"
                                max="200"
                                value={selectedElement.properties?.fontSize || 24}
                                onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                                className="w-full accent-purple-600 bg-zinc-800 h-1 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Color</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="color"
                                    value={selectedElement.properties?.fillColor || "#ffffff"}
                                    onChange={(e) => handleChange('fillColor', e.target.value)}
                                    className="w-10 h-10 bg-transparent border-none cursor-pointer rounded overflow-hidden"
                                />
                                <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded p-2 text-xs font-mono text-zinc-400">
                                    {selectedElement.properties?.fillColor?.toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedElement.type === 'slideshow' && (
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Imágenes del Carrusel ({selectedElement.images?.length || 0}/5)</label>
                        <div className="space-y-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                            {selectedElement.images?.map((img, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded group">
                                    <div className="w-8 h-8 rounded bg-zinc-800 overflow-hidden shrink-0">
                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="flex-1 text-[10px] text-zinc-500 truncate">{img}</div>
                                    <button
                                        onClick={() => removeSlideImage(idx)}
                                        className="p-1 hover:text-red-500 text-zinc-700 transition-colors"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            {(selectedElement.images?.length || 0) < 5 && (
                                <button
                                    onClick={addSlideImage}
                                    disabled={isUploading}
                                    className="w-full py-2 border border-zinc-800 border-dashed rounded text-zinc-500 hover:text-white hover:border-zinc-600 transition-all text-[10px] flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isUploading ? <Loader2 className="animate-spin" size={12} /> : <Plus size={12} />}
                                    {isUploading ? "Subiendo..." : "Añadir Imagen"}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Video / Image Specific: BorderRadius & Effects */}
                {(selectedElement.type === 'video' || selectedElement.type === 'image' || selectedElement.type === 'slideshow') && (
                    <div className="space-y-4 border-t border-zinc-900 pt-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Esquinas (Radius)</label>
                                <span className="text-[10px] font-mono text-zinc-400">{selectedElement.properties?.borderRadius || 0}px</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={selectedElement.properties?.borderRadius || 0}
                                onChange={(e) => handleChange('borderRadius', parseInt(e.target.value))}
                                className="w-full accent-purple-600 bg-zinc-800 h-1 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Efecto de Sombra</label>
                            <div className="grid grid-cols-2 gap-2">
                                {SHADOWS.map((shadow) => (
                                    <button
                                        key={shadow.name}
                                        onClick={() => handleChange('boxShadow', shadow.value)}
                                        className={`py-2 px-1 rounded text-[10px] border transition-all ${selectedElement.properties?.boxShadow === shadow.value
                                            ? "border-purple-600 bg-purple-600/10 text-white"
                                            : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-700"
                                            }`}
                                    >
                                        {shadow.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="h-px bg-zinc-800 my-4" />

                <button
                    onClick={() => removeElement(selectedElement.id)}
                    className="w-full py-2 px-4 border border-red-900/50 hover:bg-red-900/20 text-red-500 rounded text-xs flex items-center justify-center gap-2 transition-colors uppercase font-bold"
                >
                    <Trash2 size={14} />
                    Eliminar
                </button>
            </div>
        </div>
    );
};
