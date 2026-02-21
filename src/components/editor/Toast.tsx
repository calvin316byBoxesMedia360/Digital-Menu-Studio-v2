"use client";

import React from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { motion, AnimatePresence } from "framer-motion";
import { Info, CheckCircle, AlertCircle, X } from "lucide-react";

export const Toast = () => {
    const { notification } = useEditorStore();

    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-full shadow-2xl"
                >
                    {notification.type === 'info' && <Info className="text-purple-400" size={18} />}
                    {notification.type === 'success' && <CheckCircle className="text-green-400" size={18} />}
                    {notification.type === 'error' && <AlertCircle className="text-red-400" size={18} />}

                    <span className="text-xs font-medium text-zinc-200">
                        {notification.message}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
