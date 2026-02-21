"use client";

import React from "react";
import { Play, SkipBack, SkipForward, Clock } from "lucide-react";

export const Timeline = () => {
    return (
        <div className="h-48 bg-zinc-900 border-t border-zinc-800 flex flex-col">
            {/* Timeline Header */}
            <div className="h-8 border-b border-zinc-800 flex items-center px-4 justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                        <button className="hover:text-white transition-colors"><SkipBack size={14} /></button>
                        <button className="hover:text-white transition-colors"><Play size={14} fill="currentColor" /></button>
                        <button className="hover:text-white transition-colors"><SkipForward size={14} /></button>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">00:00:00 / 00:00:10</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                    <Clock size={12} />
                    <span>60 FPS</span>
                </div>
            </div>

            {/* Timeline Content */}
            <div className="flex-1 overflow-auto flex">
                <div className="w-16 border-r border-zinc-800 flex flex-col py-2">
                    {/* Layer Headers */}
                    <div className="h-6 px-2 text-[10px] text-zinc-500 flex items-center">Capa 1</div>
                    <div className="h-6 px-2 text-[10px] text-zinc-500 flex items-center">Capa 2</div>
                </div>

                {/* Timeline Tracks */}
                <div className="flex-1 bg-zinc-950/50 relative">
                    <div className="absolute inset-0 flex">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="flex-1 border-r border-zinc-800/30 h-full" />
                        ))}
                    </div>

                    <div className="relative py-2 space-y-2">
                        <div className="h-6 mx-2 bg-purple-500/20 border border-purple-500/40 rounded w-1/3" />
                        <div className="h-6 mx-2 bg-blue-500/20 border border-blue-500/40 rounded w-1/2" />
                    </div>

                    {/* Playhead */}
                    <div className="absolute top-0 bottom-0 left-[20%] w-0.5 bg-red-500 z-10 shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-red-500 rotate-45" />
                    </div>
                </div>
            </div>
        </div>
    );
};
