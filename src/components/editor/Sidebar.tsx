"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    LayoutTemplate,
    Type,
    Image as ImageIcon,
    Shapes,
    Upload,
    MousePointer2,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Plus,
    Play,
    Layout,
    Loader2,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditorStore, CanvasElement, ProjectAsset } from "@/store/useEditorStore";
import { supabase } from "@/lib/supabase";

const TABS = [
    { id: "templates", icon: <LayoutTemplate size={20} />, label: "Plantillas" },
    { id: "text", icon: <Type size={20} />, label: "Texto" },
    { id: "elements", icon: <Shapes size={20} />, label: "Elementos" },
    { id: "images", icon: <ImageIcon size={20} />, label: "Subidos" },
    { id: "ai", icon: <Sparkles size={20} />, label: "IA Assistant" },
];

export const Sidebar = () => {
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        projectId,
        addElement,
        assets,
        addAsset,
        fetchAssets,
        selectedElementId,
        updateElementProperties,
        elements,
        showNotification
    } = useEditorStore();

    useEffect(() => {
        if (activeTab === "images" && projectId) {
            fetchAssets();
        }
    }, [activeTab, projectId, fetchAssets]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !projectId) return;

        setIsUploading(true);
        try {
            // 1. Subir a Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${projectId}/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('menu-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Obtener URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('menu-assets')
                .getPublicUrl(filePath);

            // 3. Registrar en la tabla assets
            const assetType = file.type.startsWith('video/') ? 'video' : 'image';
            const { data: assetData, error: dbError } = await supabase
                .from('assets')
                .insert([
                    {
                        project_id: projectId,
                        storage_url: publicUrl,
                        asset_type: assetType
                    }
                ])
                .select()
                .single();

            if (dbError) throw dbError;

            addAsset(assetData as ProjectAsset);
            console.log("✅ Archivo subido y registrado:", publicUrl);
        } catch (error) {
            console.error("❌ Error en la subida:", error);
            alert("Error al subir el archivo. Revisa la consola.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleAddAssetToCanvas = (asset: ProjectAsset) => {
        const selectedElement = elements.find(el => el.id === selectedElementId);

        // Si es imagen y hay un slideshow seleccionado, añadirla al carrusel
        if (asset.asset_type === 'image' && selectedElement?.type === 'slideshow') {
            const currentImages = selectedElement.images || [];
            if (currentImages.length < 5) {
                updateElementProperties(selectedElement.id, {
                    images: [...currentImages, asset.storage_url]
                });
                return;
            }
        }

        // De lo contrario, crear nuevo elemento
        const newElement: CanvasElement = {
            id: crypto.randomUUID(),
            type: asset.asset_type === 'video' ? 'video' : 'image',
            name: asset.asset_type === 'video' ? 'Video Subido' : 'Imagen Subida',
            x: 100,
            y: 200,
            width: asset.asset_type === 'video' ? 300 : 400,
            height: asset.asset_type === 'video' ? 533 : 400, // Proporción 9:16 para video por defecto
            rotation: 0,
            zIndex: 5,
            srcOrText: asset.storage_url,
            properties: {
                borderRadius: asset.asset_type === 'video' ? 12 : 0,
                boxShadow: asset.asset_type === 'video' ? "0 10px 30px rgba(0,0,0,0.5)" : "none",
            },
            startFrame: 0,
            durationFrames: 600,
        };
        addElement(newElement);
    };

    const handleAddTextMock = () => {
        const newElement: CanvasElement = {
            id: crypto.randomUUID(),
            type: 'text',
            name: 'Texto de Prueba',
            x: 100,
            y: 100,
            width: 200,
            height: 50,
            rotation: 0,
            zIndex: 10,
            srcOrText: 'NUEVO MENÚ DINÁMICO',
            properties: {
                fillColor: '#ffffff',
                fontSize: 24,
                fontFamily: 'var(--font-roboto)',
                textAlign: 'center',
            },
            startFrame: 0,
            durationFrames: 600,
        };
        addElement(newElement);
    };

    const handleAddSlideshowMock = () => {
        const newElement: CanvasElement = {
            id: crypto.randomUUID(),
            type: 'slideshow',
            name: 'Carrusel de Menú',
            x: 150,
            y: 300,
            width: 300,
            height: 300,
            rotation: 0,
            zIndex: 5,
            srcOrText: '',
            images: [
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
                'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=500&q=80',
            ],
            properties: {
                borderRadius: 20,
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            },
            startFrame: 0,
            durationFrames: 600,
        };
        addElement(newElement);
    };

    return (
        <div className="flex h-full border-r border-zinc-800 bg-zinc-950">
            {/* Mini Sidebar Tabs */}
            <div className="flex w-16 flex-col items-center gap-4 bg-zinc-900 py-4 border-r border-zinc-800">
                <div className="mb-4 text-purple-500">
                    <MousePointer2 size={24} />
                </div>
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${activeTab === tab.id
                            ? "text-purple-400 bg-purple-500/10"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                            }`}
                    >
                        {tab.icon}
                        <span className="text-[10px] mt-1">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Expandable Drawer */}
            <AnimatePresence>
                {activeTab && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        className="overflow-hidden bg-zinc-900 border-r border-zinc-800 flex flex-col"
                    >
                        <div className="w-[280px] p-4 flex-1 flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
                                    {TABS.find(t => t.id === activeTab)?.label}
                                </h2>
                                <button
                                    onClick={() => setActiveTab(null)}
                                    className="p-1 hover:bg-zinc-800 rounded-md text-zinc-500"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                                {activeTab === "images" && (
                                    <div className="space-y-6">
                                        {/* Upload Button Area */}
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer group"
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*,video/mp4"
                                                onChange={handleFileUpload}
                                            />
                                            {isUploading ? (
                                                <Loader2 className="animate-spin text-purple-500" size={32} />
                                            ) : (
                                                <Upload className="text-zinc-600 group-hover:text-purple-400 transition-colors" size={32} />
                                            )}
                                            <div className="text-center">
                                                <p className="text-xs font-bold text-zinc-300">Subir Media</p>
                                                <p className="text-[10px] text-zinc-600">PNG, JPG o MP4</p>
                                            </div>
                                        </div>

                                        {/* Assets Grid */}
                                        <div className="grid grid-cols-2 gap-2">
                                            {assets.map((asset) => (
                                                <div
                                                    key={asset.id}
                                                    onClick={() => handleAddAssetToCanvas(asset)}
                                                    className="aspect-square bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 hover:border-purple-500 cursor-pointer relative group transition-all"
                                                >
                                                    {asset.asset_type === 'video' ? (
                                                        <div className="w-full h-full flex items-center justify-center bg-black">
                                                            <Play size={20} className="text-white/50" />
                                                            <video src={asset.storage_url} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    ) : (
                                                        <img src={asset.storage_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                                    )}
                                                    <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Plus size={20} className="text-white drop-shadow-lg" />
                                                    </div>
                                                </div>
                                            ))}
                                            {assets.length === 0 && !isUploading && (
                                                <div className="col-span-2 py-8 text-center">
                                                    <p className="text-[10px] text-zinc-600 italic">No hay archivos subidos aún</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "text" && (
                                    <div className="space-y-4">
                                        <button
                                            onClick={handleAddTextMock}
                                            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-900/20"
                                        >
                                            <Plus size={14} />
                                            AÑADIR TEXTO DE PRUEBA
                                        </button>
                                    </div>
                                )}

                                {activeTab === "elements" && (
                                    <div className="space-y-4">
                                        <button
                                            onClick={handleAddSlideshowMock}
                                            className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-zinc-700"
                                        >
                                            <Layout size={14} />
                                            CARRUSEL (SLIDESHOW)
                                        </button>
                                    </div>
                                )}

                                {activeTab === "templates" && (
                                    <div className="grid grid-cols-2 gap-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                onClick={() => showNotification("Plantilla en desarrollo", "info")}
                                                className="aspect-[9/16] bg-zinc-800 rounded-md border border-zinc-700 hover:border-purple-500 cursor-pointer transition-colors"
                                            />
                                        ))}
                                    </div>
                                )}

                                {activeTab === "ai" && (
                                    <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                                        <p className="text-xs text-purple-200/60 mb-2">Pregúntale a CuatesMenuGPT</p>
                                        <div className="h-24 bg-zinc-800 rounded border border-zinc-700 mb-2" />
                                        <button
                                            onClick={() => showNotification("IA Assistant en desarrollo", "info")}
                                            className="w-full py-2 bg-purple-600 text-xs font-bold rounded hover:bg-purple-500 transition-colors"
                                        >GENERAR CON IA</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
