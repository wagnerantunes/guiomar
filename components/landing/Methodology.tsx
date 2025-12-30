"use client";

import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { RichText } from "@/components/ui/RichText";
import { InfiniteSlider } from "@/components/ui/InfiniteSlider";
import { motion } from "framer-motion";

interface MethodologyProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function Methodology({ getSetting }: MethodologyProps) {
    const content = getSetting("section_metodologia_content", SECTION_DEFAULTS.metodologia);
    const steps = content.steps || SECTION_DEFAULTS.metodologia.steps;
    const layout = content.layout || "grid";

    // Custom card renderer for slider mode
    const renderMethodologyCard = (step: any, index: number) => (
        <div className="bg-card backdrop-blur-xl p-10 rounded-[2.5rem] border border-border hover:border-primary/30 hover:shadow-[0_0_40px_-10px_rgba(var(--primary-rgb),0.15)] transition-all duration-500 group relative overflow-hidden shadow-2xl h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>

            {/* Step number badge */}
            <div className="absolute top-6 left-6 size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg border border-primary/30">
                {String(index + 1).padStart(2, '0')}
            </div>

            <h4 className="text-2xl font-black text-foreground mb-6 uppercase tracking-tight mt-16">
                {step.t}
            </h4>
            <RichText
                content={step.d}
                className="text-muted font-medium leading-relaxed"
                style={{ fontSize: "var(--section-body-size)" } as any}
            />
        </div>
    );

    return (
        <>
            <div className="text-center mb-32 space-y-8">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] border border-primary/20 px-4 py-2 rounded-full bg-primary/5 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]">Como trabalhamos</span>
                <h2
                    className="font-black text-foreground leading-tight tracking-tighter uppercase italic drop-shadow-lg"
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

            {layout === "slider" ? (
                <InfiniteSlider
                    items={steps}
                    renderCard={renderMethodologyCard}
                    speed={40}
                    cardWidth="450px"
                />
            ) : (
                <div className="relative space-y-24">
                    {/* Timeline Line */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent -translate-x-1/2"></div>

                    {steps.map((m: any, i: number) => (
                        <div
                            key={i}
                            className={`flex flex-col lg:flex-row items-center gap-16 ${i % 2 !== 0 ? "lg:flex-row-reverse" : ""
                                }`}
                        >
                            <div className="flex-1 w-full lg:text-right">
                                {i % 2 === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8 }}
                                        className="bg-card backdrop-blur-xl p-10 rounded-[2.5rem] border border-border hover:border-primary/30 hover:shadow-[0_0_40px_-10px_rgba(var(--primary-rgb),0.15)] transition-all duration-500 group relative overflow-hidden shadow-2xl"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
                                        <h4 className="text-3xl font-black text-foreground mb-6 uppercase tracking-tight">
                                            {m.t}
                                        </h4>
                                        <RichText
                                            content={m.d}
                                            className="text-muted font-medium leading-relaxed"
                                            style={{ fontSize: "var(--section-body-size)" } as any}
                                        />
                                    </motion.div>
                                )}
                            </div>

                            {/* Center Number/Orb */}
                            <div className="relative z-20 shrink-0">
                                <div className="absolute inset-0 bg-primary blur-2xl opacity-20 rounded-full animate-pulse"></div>
                                <div className="size-20 rounded-2xl bg-background text-primary flex items-center justify-center font-black text-2xl border border-primary/30 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)] relative z-10 rotate-45 group hover:rotate-0 transition-all duration-500">
                                    <span className="-rotate-45 group-hover:rotate-0 transition-all duration-500">0{i + 1}</span>
                                </div>
                            </div>

                            <div className="flex-1 w-full lg:text-left">
                                {i % 2 !== 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8 }}
                                        className="bg-card backdrop-blur-xl p-10 rounded-[2.5rem] border border-border hover:border-primary/30 hover:shadow-[0_0_40px_-10px_rgba(var(--primary-rgb),0.15)] transition-all duration-500 group relative overflow-hidden shadow-2xl"
                                    >
                                        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full -ml-16 -mt-16 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
                                        <h4 className="text-3xl font-black text-foreground mb-6 uppercase tracking-tight">
                                            {m.t}
                                        </h4>
                                        <RichText
                                            content={m.d}
                                            className="text-muted font-medium leading-relaxed"
                                            style={{ fontSize: "var(--section-body-size)" } as any}
                                        />
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

