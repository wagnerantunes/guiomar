"use client";

import { useEffect, useRef } from "react";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { RichText } from "@/components/ui/RichText";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

interface ChallengeProps {
    getSetting: (key: string, defaultValue: any) => any;
}

function AnimatedCounter({ value, suffix = "" }: { value: string, suffix?: string }) {
    // Extract numeric part
    const numericValue = parseInt(value.replace(/\D/g, "")) || 0;
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 50, stiffness: 100 });
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(numericValue);
        }
    }, [isInView, numericValue, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest).toString() + suffix + (value.includes("+") ? "+" : "");
            }
        });
    }, [springValue, suffix, value]);

    return <span ref={ref} className="tabular-nums" />;
}

export function Challenge({ getSetting }: ChallengeProps) {
    const content = getSetting("section_desafio_content", SECTION_DEFAULTS.desafio);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
            {/* TEXT COLUMN */}
            <div className="lg:col-span-7 space-y-12">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">warning</span>
                        Contexto Atual
                    </div>
                    <h2
                        className="font-black leading-[1.1] tracking-tighter text-foreground"
                        style={{ fontSize: "var(--section-title-size)" } as any}
                    >
                        {content.title}
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative pl-8"
                >
                    <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full opacity-30"></div>
                    <RichText
                        content={content.description}
                        className="text-muted text-lg font-medium leading-relaxed italic"
                        style={{ fontSize: "var(--section-body-size)" } as any}
                    />
                </motion.div>

                {/* Decorative Stats List (Optional extras) */}
                <div className="flex flex-wrap gap-8 pt-4">
                    <div className="flex items-center gap-3">
                        <div className="size-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-muted uppercase tracking-widest">Riscos Ergonômicos</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="size-2 rounded-full bg-orange-500 animate-pulse delay-100"></div>
                        <span className="text-xs font-bold text-muted uppercase tracking-widest">Saúde Mental</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="size-2 rounded-full bg-primary animate-pulse delay-200"></div>
                        <span className="text-xs font-bold text-muted uppercase tracking-widest">Legislação</span>
                    </div>
                </div>
            </div>

            {/* STAT COLUMN */}
            <div className="lg:col-span-5">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                    whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                    className="bg-card border border-border p-12 lg:p-16 rounded-[3rem] text-center backdrop-blur-xl relative group overflow-hidden shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-700"
                >
                    {/* Animated visual bg */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-50"></div>
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-colors duration-700"></div>

                    {/* Main Stat */}
                    <div className="relative z-10 space-y-2">
                        <span className="text-[120px] leading-[1] font-black text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/40 drop-shadow-sm block">
                            <AnimatedCounter value={content.statValue} suffix="%" />
                        </span>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-8"></div>

                        <span className="text-sm font-black text-foreground uppercase tracking-[0.4em] block max-w-[200px] mx-auto leading-relaxed">
                            {content.statLabel}
                        </span>
                    </div>

                    {/* Floating Icons Decors */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-10 right-10 text-primary/20"
                    >
                        <span className="material-symbols-outlined text-4xl">trending_up</span>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
