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
            className="py-32 px-6 bg-[#09090b] relative overflow-hidden"
        >
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#13ec5b]/5 blur-[120px] rounded-full opacity-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 blur-[100px] rounded-full opacity-20 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-32 space-y-8">
                    <span className="text-[10px] font-black text-[#13ec5b] uppercase tracking-[0.4em] border border-[#13ec5b]/20 px-4 py-2 rounded-full bg-[#13ec5b]/5 shadow-[0_0_20px_rgba(19,236,91,0.1)]">Como trabalhamos</span>
                    <h2 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tighter uppercase italic drop-shadow-lg">
                        {content.title}
                    </h2>
                    <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        {content.subtitle}
                    </p>
                </div>

                <div className="relative space-y-24">
                    {/* Timeline Line */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#13ec5b]/30 to-transparent -translate-x-1/2"></div>

                    {(content.steps || SECTION_DEFAULTS.metodologia.steps).map((m: any, i: number) => (
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
                                        className="bg-zinc-900/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 hover:border-[#13ec5b]/30 hover:shadow-[0_0_40px_-10px_rgba(19,236,91,0.15)] transition-all duration-500 group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#13ec5b]/5 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
                                        <h4 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">
                                            {m.t}
                                        </h4>
                                        <RichText content={m.d} className="text-base text-zinc-400 font-medium leading-relaxed prose-p:text-base prose-strong:text-white" />
                                    </motion.div>
                                )}
                            </div>

                            {/* Center Number/Orb */}
                            <div className="relative z-20 shrink-0">
                                <div className="absolute inset-0 bg-[#13ec5b] blur-2xl opacity-20 rounded-full animate-pulse"></div>
                                <div className="size-20 rounded-2xl bg-[#09090b] text-[#13ec5b] flex items-center justify-center font-black text-2xl border border-[#13ec5b]/30 shadow-[0_0_30px_rgba(19,236,91,0.2)] relative z-10 rotate-45 group hover:rotate-0 transition-all duration-500">
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
                                        className="bg-zinc-900/40 backdrop-blur-xl p-10 rounded-[3rem] border border-white/5 hover:border-[#13ec5b]/30 hover:shadow-[0_0_40px_-10px_rgba(19,236,91,0.15)] transition-all duration-500 group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-32 h-32 bg-[#13ec5b]/5 blur-[60px] rounded-full -ml-16 -mt-16 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
                                        <h4 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">
                                            {m.t}
                                        </h4>
                                        <RichText content={m.d} className="text-base text-zinc-400 font-medium leading-relaxed prose-p:text-base prose-strong:text-white" />
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
