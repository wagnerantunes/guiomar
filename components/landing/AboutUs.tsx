"use client";

import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { RichText } from "@/components/ui/RichText";
import { motion } from "framer-motion";

interface AboutUsProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function AboutUs({ getSetting }: AboutUsProps) {
    const content = getSetting("section_sobre_content", SECTION_DEFAULTS.sobre);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            {/* Image Area with Animations */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative group"
            >
                <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -z-10 animate-pulse"></div>
                <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -z-10"></div>

                <div className="relative z-10">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <img
                            src={content.image}
                            className="rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full aspect-[4/5] object-cover"
                            alt="Sobre"
                        />

                        {/* Experience Badge - Premium Floating Style */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="absolute -bottom-10 -right-10 bg-card/80 backdrop-blur-2xl p-12 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-border z-20 group-hover:translate-y-[-10px] transition-transform duration-500"
                        >
                            <span className="text-6xl font-black block text-primary tracking-tighter leading-none mb-3">
                                +{content.experience}
                            </span>
                            <span className="text-[11px] font-black text-muted uppercase tracking-[0.25em] leading-tight block">
                                ANOS DE<br />EXCELÊNCIA
                            </span>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Decorative Frames */}
                <div className="absolute inset-0 border-2 border-primary/10 rounded-[3rem] translate-x-12 translate-y-12 -z-0 group-hover:translate-x-8 group-hover:translate-y-8 transition-transform duration-700"></div>
                <div className="absolute inset-0 border border-primary/5 rounded-[3rem] translate-x-20 translate-y-20 -z-0 hidden md:block group-hover:translate-x-16 group-hover:translate-y-16 transition-transform duration-1000 opacity-50"></div>
            </motion.div>

            {/* Content Area */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="space-y-10"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-primary"></div>
                        <span className="type-badge text-primary">Legado & Expertise</span>
                    </div>
                    <h2 className="type-h2 text-foreground">
                        {content.title}
                    </h2>
                </div>

                {content.subtitle && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="type-h3 text-foreground border-l-4 border-primary pl-8 py-2 bg-primary/5 rounded-r-2xl italic"
                    >
                        {content.subtitle}
                    </motion.p>
                )}

                <div className="relative space-y-6">
                    <RichText
                        content={content.description}
                        className="type-body prose-p:mb-4"
                    />
                </div>

                <div className="pt-8">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            const el = document.getElementById("servicos");
                            el?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="group flex items-center gap-6"
                    >
                        <div className="bg-foreground text-background px-12 py-6 rounded-2xl font-black text-[10px] hover:bg-primary hover:text-primary-foreground transition-all duration-500 uppercase tracking-[0.2em] shadow-2xl shadow-black/10">
                            {content.ctaText || "CONHEÇA NOSSOS SERVIÇOS"}
                        </div>
                        <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-500 shadow-lg">
                            <span className="material-symbols-outlined text-sm text-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </div>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}

