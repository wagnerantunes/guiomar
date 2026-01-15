"use client";

import React, { useState } from "react";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

interface NewsletterProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function Newsletter({ getSetting }: NewsletterProps) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const content = getSetting("section_newsletter_content", SECTION_DEFAULTS.newsletter);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        try {
            const res = await fetch("/api/newsletter/subscribers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setStatus("success");
                setEmail("");
                setTimeout(() => setStatus("idle"), 5000);
            } else {
                setStatus("error");
            }
        } catch (err) {
            setStatus("error");
        }
    };

    return (
        <SectionWrapper id="newsletter" content={content} className="!py-20">
            <div className="relative overflow-hidden rounded-[3rem] bg-foreground p-10 md:p-16 lg:p-20 shadow-2xl">
                {/* Decorative background glass effects */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 size-80 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 size-80 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block">Newsletter</span>
                        <h2 className="text-4xl md:text-5xl font-black text-background tracking-tighter uppercase italic leading-[1.1]">
                            {content.title}
                        </h2>
                        <p className="text-background/60 text-lg font-medium leading-relaxed max-w-md">
                            {content.subtitle}
                        </p>
                    </div>

                    <div className="relative">
                        {status === "success" ? (
                            <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8 text-center animate-in fade-in zoom-in duration-500">
                                <span className="material-symbols-outlined text-primary text-5xl mb-4">check_circle</span>
                                <p className="text-background font-black uppercase tracking-widest text-sm italic">
                                    {content.successMessage}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1 group">
                                    <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-background/30 group-focus-within:text-primary transition-colors">
                                        mail
                                    </span>
                                    <input
                                        type="email"
                                        required
                                        placeholder={content.placeholder}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-background/5 border-2 border-background/10 rounded-2xl px-16 py-5 text-background font-bold outline-none focus:border-primary/50 focus:bg-background/10 transition-all placeholder:text-background/20"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="bg-primary hover:bg-white hover:text-foreground text-primary-foreground px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
                                >
                                    {status === "loading" ? "..." : (content.buttonText || "INSCREVER")}
                                </button>
                            </form>
                        )}
                        {status === "error" && (
                            <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mt-4 ml-6 animate-pulse">
                                Erro ao realizar inscrição. Tente novamente.
                            </p>
                        )}
                        <p className="text-[10px] text-background/30 font-bold uppercase tracking-widest mt-6 ml-6">
                            🔒 Prometemos não enviar spam. Cancele quando quiser.
                        </p>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}
