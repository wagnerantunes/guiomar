"use client";

import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { RichText } from "@/components/ui/RichText";
import { motion } from "framer-motion";

interface ChallengeProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function Challenge({ getSetting }: ChallengeProps) {
    const content = getSetting("section_desafio_content", SECTION_DEFAULTS.desafio);

    return (
        <section id="desafio" className="py-32 px-6 bg-[#09090b] text-white overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#13ec5b]/10 blur-[150px] -z-0 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[150px] -z-0 opacity-30"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
                <div className="lg:col-span-7 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter uppercase italic">
                            {content.title}
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-[#13ec5b] to-transparent rounded-full opacity-50"></div>
                        <RichText
                            content={content.description}
                            className="text-xl text-gray-400 font-medium leading-relaxed prose-invert italic"
                        />
                    </motion.div>
                </div>

                <div className="lg:col-span-5">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                        whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, type: "spring" }}
                        className="bg-white/[0.03] border border-white/10 p-16 rounded-[4rem] text-center backdrop-blur-xl relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#13ec5b]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <span className="text-9xl font-black text-[#13ec5b] block drop-shadow-[0_0_30px_rgba(19,236,91,0.3)] animate-pulse-subtle">
                            {content.statValue}
                        </span>
                        <div className="w-12 h-1.5 bg-[#13ec5b] mx-auto my-8 rounded-full"></div>
                        <span className="text-sm font-black text-white uppercase tracking-[0.4em] block">
                            {content.statLabel}
                        </span>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
