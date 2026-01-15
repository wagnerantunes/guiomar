"use client";

import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { RichText } from "@/components/ui/RichText";
import { InfiniteSlider } from "@/components/ui/InfiniteSlider";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface MethodologyProps {
    getSetting: (key: string, defaultValue: any) => any;
}

function TiltCard({ step, index }: { step: any, index: number }) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;

        const xPct = mouseXFromCenter / width;
        const yPct = mouseYFromCenter / height;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative h-full perspective-1000"
            whileHover={{ scale: 1.05, zIndex: 10 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-card/80 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-border group relative overflow-hidden shadow-2xl h-full flex flex-col justify-between"
                style={{ transform: "translateZ(0)" }}
            >
                {/* Dynamic Gradient Border Effect via inset shadow or overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none mix-blend-overlay"></div>

                {/* Floating Bg Blob */}
                <motion.div
                    className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none opacity-50"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />

                {/* Content Layer with Depth */}
                <div style={{ transform: "translateZ(50px)" }} className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-foreground/20 opacity-40 select-none">
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="size-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
                            <span className="material-symbols-outlined text-primary">arrow_forward</span>
                        </div>
                    </div>

                    <h4 className="text-3xl font-black text-foreground mb-6 uppercase tracking-tight leading-[0.9]">
                        {step.t}
                    </h4>
                </div>

                <div style={{ transform: "translateZ(30px)" }} className="relative z-10 mt-auto">
                    <RichText
                        content={step.d}
                        className="text-muted font-medium leading-relaxed text-sm"
                    />
                </div>
            </div>
        </motion.div>
    );
}

export function Methodology({ getSetting }: MethodologyProps) {
    const content = getSetting("section_metodologia_content", SECTION_DEFAULTS.metodologia);
    let steps = content.steps || SECTION_DEFAULTS.metodologia.steps;
    if (!Array.isArray(steps)) steps = [];
    const layout = content.layout || "grid"; // We will prefer slider if user asked

    return (
        <div className="py-12">
            <div className="text-center mb-24 space-y-8 relative z-10 px-6">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] border border-primary/20 px-4 py-2 rounded-full bg-primary/5 shadow-lg shadow-primary/5">
                    Como trabalhamos
                </span>
                <h2
                    className="font-black text-foreground leading-tight tracking-tighter uppercase italic drop-shadow-lg max-w-4xl mx-auto"
                    style={{ fontSize: "var(--section-title-size)" } as any}
                >
                    {content.title}
                </h2>
                <p
                    className="text-muted font-medium max-w-2xl mx-auto leading-relaxed"
                    style={{ fontSize: "var(--section-subtitle-size)" } as any}
                >
                    {content.subtitle}
                </p>
            </div>

            <div className="py-10">
                <InfiniteSlider
                    items={steps}
                    renderCard={(step, index) => <TiltCard step={step} index={index} />}
                    speed={50}
                    cardWidth="420px"
                    gap="2rem"
                />
            </div>
        </div>
    );
}
