"use client";

import React, { useEffect } from "react";
import { Sidebar } from "@/components/editor/Sidebar";
import { Canvas } from "@/components/editor/Canvas";
import { Timeline } from "@/components/editor/Timeline";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { Save, Share2, Download, Settings, Menu, Loader2 } from "lucide-react";

import { useAutoSave } from "@/hooks/useAutoSave";
import { useEditorStore } from "@/store/useEditorStore";
import { supabase } from "@/lib/supabase";

export default function EditorPage() {
    const { projectId, setProjectId, setElements, setProjectName } = useEditorStore();

    // Activar el autoguardado
    useAutoSave();

    useEffect(() => {
        const initProject = async () => {
            // Para propósitos de prueba, buscaremos el primer proyecto o crearemos uno
            // En una app real, esto vendría del ID en la URL
            const { data: projects, error } = await supabase
                .from('projects')
                .select('*')
                .limit(1);

            if (projects && projects.length > 0) {
                const p = projects[0];
                setProjectId(p.id);
                setProjectName(p.name);
                setElements(p.canvas_state || []);
                console.log("📂 Proyecto cargado:", p.id);
            } else {
                // Crear un proyecto de prueba si no existe ninguno
                const { data: newProject, error: createError } = await supabase
                    .from('projects')
                    .insert([{ name: 'Mi Primer Menú Digital', canvas_state: [] }])
                    .select()
                    .single();

                if (newProject) {
                    setProjectId(newProject.id);
                    setProjectName(newProject.name);
                    console.log("✨ Proyecto inicial creado:", newProject.id);
                }
            }
        };

        initProject();
    }, [setProjectId, setElements, setProjectName]);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 font-sans selection:bg-purple-500/30">
            {/* Main Container */}
            <div className="flex flex-1 flex-col">

                {/* Top Navbar */}
                <header className="h-12 border-b border-zinc-800 bg-zinc-900 px-4 flex items-center justify-between z-20">
                    <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-purple-600 font-bold text-white">
                            D
                        </div>
                        <div className="h-4 w-px bg-zinc-800" />
                        <h1 className="text-xs font-semibold text-zinc-300 tracking-wide uppercase group flex items-center gap-2 cursor-pointer">
                            {useEditorStore((state) => state.projectName)}
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-zinc-500">Edit</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-800 text-zinc-300 text-[11px] font-medium hover:bg-zinc-700 transition-colors">
                            <Save size={14} />
                            Guardar
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-800 text-zinc-300 text-[11px] font-medium hover:bg-zinc-700 transition-colors">
                            <Share2 size={14} />
                            Compartir
                        </button>
                        <button className="flex items-center gap-2 px-4 py-1.5 rounded bg-purple-600 text-white text-[11px] font-bold hover:bg-purple-500 transition-all shadow-lg shadow-purple-900/20 active:scale-95">
                            <Download size={14} />
                            EXPORTAR MP4
                        </button>
                        <div className="h-4 w-px bg-zinc-800 ml-2" />
                        <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                            <Settings size={16} />
                        </button>
                    </div>
                </header>

                {/* Editor Body */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Area */}
                    <Sidebar />

                    {/* Center + Bottom Area */}
                    <div className="flex flex-1 flex-col overflow-hidden">
                        {/* Canvas / Preview Area */}
                        <Canvas />

                        {/* Timeline Area */}
                        <Timeline />
                    </div>

                    <PropertiesPanel />
                </div>
            </div>
        </div>
    );
}
