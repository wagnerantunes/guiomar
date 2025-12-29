"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";

const ToastContext = React.createContext<{
    toast: (props: { title: string; description?: string; type?: "success" | "error" | "info" }) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<any[]>([]);

    const toast = React.useCallback(({ title, description, type = "info" }: { title: string; description?: string; type?: "success" | "error" | "info" }) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, title, description, type }]);
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            <ToastPrimitive.Provider swipeDirection="right">
                {children}
                {toasts.map(({ id, title, description, type }) => (
                    <ToastPrimitive.Root
                        key={id}
                        onOpenChange={(open) => {
                            if (!open) {
                                setToasts((prev) => prev.filter((t) => t.id !== id));
                            }
                        }}
                        className={`bg-card border border-border rounded-2xl shadow-2xl p-4 md:p-6 grid grid-cols-[auto_1fr_auto] gap-4 items-center animate-in slide-in-from-right-full duration-300 ${type === "success" ? "border-l-4 border-l-primary" :
                            type === "error" ? "border-l-4 border-l-destructive" : ""
                            }`}
                    >
                        <div className={`size-10 rounded-xl flex items-center justify-center ${type === "success" ? "bg-primary/10 text-primary" :
                            type === "error" ? "bg-destructive/10 text-destructive" :
                                "bg-primary/10 text-primary"
                            }`}>
                            <span className="material-symbols-outlined">
                                {type === "success" ? "done_all" : type === "error" ? "error" : "info"}
                            </span>
                        </div>
                        <div className="space-y-1">
                            {title && <ToastPrimitive.Title className="text-sm font-black text-foreground uppercase tracking-tight">{title}</ToastPrimitive.Title>}
                            {description && (
                                <ToastPrimitive.Description className="text-xs text-gray-400 font-medium">
                                    {description}
                                </ToastPrimitive.Description>
                            )}
                        </div>
                        <ToastPrimitive.Close className="p-2 text-gray-300 hover:text-gray-500 transition-colors">
                            <X size={16} />
                        </ToastPrimitive.Close>
                    </ToastPrimitive.Root>
                ))}
                <ToastPrimitive.Viewport className="fixed bottom-0 right-0 p-6 flex flex-col gap-3 w-full max-w-md z-[200] outline-none" />
            </ToastPrimitive.Provider>
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
};
