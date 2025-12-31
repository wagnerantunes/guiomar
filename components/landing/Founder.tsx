"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { RichText } from "@/components/ui/RichText";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

interface FounderProps {
    getSetting: (key: string, defaultValue: any) => any;
}

// Reusing Animated Counter Logic
function AnimatedCounter({ value, label, icon }: { value: string, label: string, icon: string }) {
    const numericValue = parseInt(value.replace(/\D/g, "")) || 0;
    const suffix = value.replace(/[0-9]/g, "");

    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });
    const isInView = useInView(ref, { once: true, margin: "-20px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(numericValue);
        }
    }, [isInView, numericValue, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                // Formatting: 15+ or 500+
                // We assume suffix goes at end.
                ref.current.textContent = Math.floor(latest).toString() + suffix;
            }
        });
    }, [springValue, suffix]);

    return (
        <div className="bg-card/50 backdrop-blur-xl p-8 rounded-[2rem] border border-border flex-1 hover:border-primary/40 hover:shadow-[0_10px_40px_-10px_rgba(var(--primary-rgb),0.2)] transition-all duration-500 group relative overflow-hidden">
            {/* Decorative Background Blob */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-colors"></div>

            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60 tracking-tighter tabular-nums block" ref={ref}>
                        0
                    </span>
                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                        <span className="material-symbols-outlined">{icon}</span>
                    </div>
                </div>
                <div className="w-8 h-1 bg-gradient-to-r from-primary to-transparent rounded-full mb-4 group-hover:w-16 transition-all duration-500"></div>
                <span className="text-[10px] font-black text-muted uppercase tracking-[0.25em] leading-relaxed">
                    {label.split('<br />').map((line, i) => (
                        <span key={i} className="block">{line}</span>
                    ))}
                </span>
            </div>
        </div>
    );
}

export function Founder({ getSetting }: FounderProps) {
    const content = getSetting("section_guiomar_content", SECTION_DEFAULTS.guiomar);

    return (
        <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10"
        >
            <div className="order-2 lg:order-1 space-y-12">
                <div className="space-y-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">verified</span>
                        Liderança
                    </span>
                    <h2
                        className="font-black text-foreground leading-[1.1] tracking-tighter uppercase italic drop-shadow-sm"
                        style={{ fontSize: "var(--section-title-size)" } as any}
                    >
                        {content.title}
                    </h2>
                </div>

                <div className="relative pl-8">
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-primary to-transparent opacity-30 rounded-full"></div>
                    <p
                        className="text-foreground/80 font-bold italic leading-relaxed"
                        style={{ fontSize: "var(--section-subtitle-size)" } as any}
                    >
                        {content.subtitle}
                    </p>
                </div>

                <div
                    className="relative text-muted text-lg font-medium leading-relaxed"
                    style={{ fontSize: "var(--section-body-size)" } as any}
                >
                    <RichText
                        content={content.description}
                        className="text-muted-foreground"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                    <AnimatedCounter
                        value={content.yearsExp || "15+"}
                        label="Anos de Experiência"
                        icon="workspace_premium"
                    />
                    <AnimatedCounter
                        value={content.projectsCount || "500+"}
                        label="Projetos Entregues"
                        icon="folder_managed"
                    />
                </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative group w-full max-w-[500px]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-[80px] group-hover:bg-primary/30 transition-colors duration-1000 -z-10"></div>

                    {/* Decorative Frames from AboutUs */}
                    <div className="absolute inset-0 border-2 border-primary/10 rounded-[3rem] translate-x-8 translate-y-8 md:translate-x-12 md:translate-y-12 -z-10 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-700"></div>
                    <div className="absolute inset-0 border border-primary/5 rounded-[3rem] translate-x-14 translate-y-14 md:translate-x-20 md:translate-y-20 -z-20 hidden md:block group-hover:translate-x-12 group-hover:translate-y-12 transition-transform duration-1000 opacity-50"></div>

                    {/* Image Decor Frame */}
                    <div className="relative rounded-[3rem] p-3 border border-border bg-card/10 backdrop-blur-sm">
                        <img
                            src={content.image}
                            className="rounded-[2.5rem] shadow-2xl relative z-10 w-full aspect-[4/5] object-cover transition-all duration-700 grayscale-[20%] group-hover:grayscale-0 group-hover:scale-[1.02]"
                            alt="Guiomar Melo"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
