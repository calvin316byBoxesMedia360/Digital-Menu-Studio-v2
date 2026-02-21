"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Monitor, Zap, Sparkles, Loader2, CheckCircle2, Play } from "lucide-react";

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, projectId }) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [quality, setQuality] = useState<'1080p' | '4k'>('1080p');

    const handleRender = async () => {
        if (!projectId) return;

        setStatus('loading');
        try {
            const response = await fetch('/api/render', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId, quality }),
            });

            if (!response.ok) throw new Error('Render failed');

            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Monitor className="text-purple-400" size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-white tracking-tight">Exportar Video</h2>
                        </div>
                        <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8">
                        {status === 'idle' || status === 'loading' ? (
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* HD Card */}
                                    <button
                                        onClick={() => setQuality('1080p')}
                                        className={`group relative p-6 rounded-xl border-2 transition-all text-left ${quality === '1080p'
                                            ? "border-purple-600 bg-purple-600/5 shadow-[0_0_20px_rgba(147,51,234,0.15)]"
                                            : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                                            }`}
                                    >
                                        <Zap className={`mb-4 ${quality === '1080p' ? "text-purple-400" : "text-zinc-500"}`} size={24} />
                                        <h3 className="font-bold text-white mb-1">Full HD (1080p)</h3>
                                        <p className="text-[11px] text-zinc-500 leading-relaxed">Renderizado rápido - Ideal para pantallas estándar.</p>
                                        {quality === '1080p' && (
                                            <div className="absolute top-3 right-3 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                            </div>
                                        )}
                                    </button>

                                    {/* 4K Card */}
                                    <button
                                        onClick={() => setQuality('4k')}
                                        className={`group relative p-6 rounded-xl border-2 transition-all text-left ${quality === '4k'
                                            ? "border-purple-600 bg-purple-600/5 shadow-[0_0_20px_rgba(147,51,234,0.15)]"
                                            : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                                            }`}
                                    >
                                        <Sparkles className={`mb-4 ${quality === '4k' ? "text-purple-400" : "text-zinc-500"}`} size={24} />
                                        <h3 className="font-bold text-white mb-1">Ultra HD (4K)</h3>
                                        <p className="text-[11px] text-zinc-500 leading-relaxed">Máxima calidad - Textos y bordes ultra nítidos.</p>
                                        {quality === '4k' && (
                                            <div className="absolute top-3 right-3 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                            </div>
                                        )}
                                    </button>
                                </div>

                                <button
                                    onClick={handleRender}
                                    disabled={status === 'loading'}
                                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-colors shadow-lg shadow-purple-900/20"
                                >
                                    {status === 'loading' ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <Play size={20} />
                                    )}
                                    RENDERIZAR EN LA NUBE
                                </button>
                            </div>
                        ) : status === 'success' ? (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center py-12 space-y-6"
                            >
                                <div className="inline-flex p-4 bg-green-500/10 rounded-full">
                                    <CheckCircle2 className="text-green-500" size={48} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white">¡Píxeles horneándose! ☁️</h3>
                                    <p className="text-zinc-400 max-w-sm mx-auto text-sm leading-relaxed">
                                        Tu video se está procesando en la infraestructura de GitHub.
                                        <br /><br />
                                        Para descargarlo: Ve a la pestaña <span className="text-purple-400 font-bold">"Actions"</span> en tu repositorio, selecciona la ejecución más reciente y busca la sección <span className="text-purple-400 font-bold">"Artifacts"</span> al final de la página.
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 rounded-lg text-sm transition-colors"
                                >
                                    Entendido
                                </button>
                            </motion.div>
                        ) : (
                            <div className="text-center py-12 space-y-4">
                                <p className="text-red-400 font-bold">Error al iniciar el renderizado</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="px-6 py-2 bg-zinc-800 text-white rounded-lg"
                                >
                                    Reintentar
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
