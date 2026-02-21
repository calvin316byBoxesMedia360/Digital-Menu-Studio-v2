"use client";

import { useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import { useEditorStore } from '@/store/useEditorStore';

export const useAutoSave = () => {
    const { elements, saveToSupabase, projectId } = useEditorStore();

    // Crear la función debounced una sola vez
    const debouncedSave = useRef(
        debounce(() => {
            saveToSupabase();
        }, 1500)
    ).current;

    useEffect(() => {
        // Solo disparar si tenemos un proyecto activo
        if (projectId && elements.length > 0) {
            debouncedSave();
        }

        // Cleanup del debounce al desmontar
        return () => {
            debouncedSave.cancel();
        };
    }, [elements, projectId, debouncedSave]);
};
