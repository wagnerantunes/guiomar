"use client";

import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { RichText } from "@/components/ui/RichText";
import { motion } from "framer-motion";

interface MethodologyProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function Methodology({ getSetting }: MethodologyProps) {
    const content = getSetting("section_metodologia_content", SECTION_DEFAULTS.metodologia);

    return (
        <section
            id="metodologia"
            className="py-32 px-6 bg-white overflow-hidden"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-28 space-y-6">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Como trabalhamos</span>
                    <h2 className="text-4xl md:text-6xl font-black text-[#09090b] leading-tight tracking-tighter uppercase italic">
                        {content.title}
                    </h2>
                    <p className="text-lg text-zinc-400 font-bold italic max-w-2xl mx-auto">
                        {content.subtitle}
                    </p>
                </div>

                <div className="relative space-y-24">
                    <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 w-px bg-zinc-100 -translate-x-1/2"></div>

                    {(content.steps || SECTION_DEFAULTS.metodologia.steps).map((m: any, i: number) => (
                        <div
                            key={i}
                            className={`flex flex-col lg:flex-row items-center gap-16 ${i % 2 !== 0 ? "lg:flex-row-reverse" : ""
                                }`}
                        >
                            <div className="flex-1 w-full lg:text-right">
                                {i % 2 === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8 }}
                                        className="bg-zinc-50 p-10 rounded-[3rem] border border-zinc-100 hover:border-primary/20 hover:shadow-2xl transition-all duration-500 group"
                                    >
                                        <h4 className="text-2xl font-black text-[#09090b] mb-4">
                                            0{i + 1}. {m.t}
                                        </h4>
                                        <RichText content={m.d} className="text-base text-zinc-500 font-medium leading-relaxed prose-p:text-base" />
                                    </motion.div>
                                )}
                            </div>

                            <div className="size-16 rounded-full bg-[#09090b] text-white flex items-center justify-center font-black z-20 border-8 border-white shadow-2xl shrink-0 group-hover:bg-primary group-hover:text-black transition-colors duration-500">
                                {i + 1}
                            </div>

                            <div className="flex-1 w-full lg:text-left">
                                {i % 2 !== 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8 }}
                                        className="bg-zinc-50 p-10 rounded-[3rem] border border-zinc-100 hover:border-primary/20 hover:shadow-2xl transition-all duration-500 group"
                                    >
                                        <h4 className="text-2xl font-black text-[#09090b] mb-4">
                                            0{i + 1}. {m.t}
                                        </h4>
                                        <RichText content={m.d} className="text-base text-zinc-500 font-medium leading-relaxed prose-p:text-base" />
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
