"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            // Show after a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "accepted");
        setIsVisible(false);
        // Here you would trigger your analytics scripts (GA, Pixel)
    };

    const handleDecline = () => {
        localStorage.setItem("cookie_consent", "declined");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-10 md:w-[480px] z-50 pointer-events-none"
                >
                    <div className="bg-background/80 backdrop-blur-xl border border-border p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-black/20 pointer-events-auto">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-2xl">cookie</span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-black text-foreground uppercase tracking-wide text-sm">Usamos Cookies</h3>
                                    <p className="text-xs text-muted leading-relaxed font-medium">
                                        Utilizamos cookies para personalizar conteúdo e analisar nosso tráfego. 
                                        Ao continuar, você concorda com nossa <Link href="/privacidade" className="text-foreground underline decoration-primary decoration-2 underline-offset-2 hover:text-primary transition-colors">Política de Privacidade</Link>.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleDecline}
                                    className="flex-1 px-6 py-3.5 rounded-xl border border-border text-muted-foreground font-black text-[10px] uppercase tracking-widest hover:bg-muted/10 transition-colors"
                                >
                                    Recusar
                                </button>
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                                >
                                    Aceitar e Continuar
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
