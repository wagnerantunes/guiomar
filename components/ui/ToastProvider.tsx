"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

interface Toast {
    id: string;
    title: string;
    description?: string;
    type: "success" | "error" | "info" | "warning";
}

interface ToastContextType {
    toast: (props: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        // Fallback for SSR or when provider is missing
        return {
            toast: () => {
                console.warn("useToast used outside of ToastProvider");
            }
        };
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback(({ title, description, type }: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substring(7);
        const newToast = { id, title, description, type };

        setToasts((prev) => [...prev, newToast]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const getIcon = (type: Toast["type"]) => {
        switch (type) {
            case "success":
                return <CheckCircle2 className="w-5 h-5" />;
            case "error":
                return <XCircle className="w-5 h-5" />;
            case "warning":
                return <AlertTriangle className="w-5 h-5" />;
            case "info":
                return <Info className="w-5 h-5" />;
        }
    };

    const getColors = (type: Toast["type"]) => {
        switch (type) {
            case "success":
                return "bg-green-50 border-green-200 text-green-900";
            case "error":
                return "bg-red-50 border-red-200 text-red-900";
            case "warning":
                return "bg-yellow-50 border-yellow-200 text-yellow-900";
            case "info":
                return "bg-blue-50 border-blue-200 text-blue-900";
        }
    };

    const getIconColor = (type: Toast["type"]) => {
        switch (type) {
            case "success":
                return "text-green-600";
            case "error":
                return "text-red-600";
            case "warning":
                return "text-yellow-600";
            case "info":
                return "text-blue-600";
        }
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-md">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`${getColors(t.type)} border-2 rounded-2xl p-4 shadow-xl backdrop-blur-sm flex items-start gap-3 min-w-[320px]`}
                        >
                            <div className={getIconColor(t.type)}>
                                {getIcon(t.type)}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm">{t.title}</h4>
                                {t.description && (
                                    <p className="text-xs mt-1 opacity-80">{t.description}</p>
                                )}
                            </div>
                            <button
                                onClick={() => removeToast(t.id)}
                                className="text-current opacity-50 hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
