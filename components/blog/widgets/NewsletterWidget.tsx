"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NewsletterWidget() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        
        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erro ao se inscrever");
            }

            setStatus("success");
            const { toast } = await import("sonner");
            toast.success(data.message || "Inscrição realizada!");
            setEmail("");
        } catch (error: any) {
            setStatus("idle");
            const { toast } = await import("sonner");
            toast.error(error.message || "Erro ao processar sua inscrição");
        }
    };

    return (
        <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group">
            <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                NEWSLETTER
            </h3>
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed mb-8">
                Receba insights sobre bem-estar e gestão diretamente no seu e-mail.
            </p>

            <AnimatePresence mode="wait">
                {status === "success" ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center"
                    >
                        <Check className="mx-auto text-green-500 mb-2" size={24} />
                        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Inscrito!</p>
                    </motion.div>
                ) : (
                    <motion.form 
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit} 
                        className="relative space-y-3"
                    >
                        <input
                            type="email"
                            required
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-card/50 border border-border rounded-2xl py-4 px-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50"
                        />
                        <button
                            disabled={status === "loading"}
                            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {status === "loading" ? "..." : (
                                <>
                                    INSCREVER
                                    <Send size={14} />
                                </>
                            )}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}
