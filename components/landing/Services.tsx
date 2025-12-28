"use client";

import React from "react";
import { motion } from "framer-motion";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { RichText } from "@/components/ui/RichText";

interface ServicesProps {
    getSetting: (key: string, defaultValue: any) => any;
}

const ServiceCard = ({ s, isLarge = false }: { s: any, isLarge?: boolean }) => {
    const [rotateX, setRotateX] = React.useState(0);
    const [rotateY, setRotateY] = React.useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const moveX = (y - centerY) / 25; // Slower rotation
        const moveY = (centerX - x) / 25;
        setRotateX(moveX);
        setRotateY(moveY);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ rotateX, rotateY }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`bg-zinc-900/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/5 hover:border-[#13ec5b]/30 hover:shadow-[0_0_50px_-10px_rgba(19,236,91,0.15)] transition-all duration-500 group cursor-default relative overflow-hidden ${isLarge ? "md:col-span-2 md:row-span-2 min-h-[400px]" : "col-span-1 min-h-[300px]"
                }`}
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
        >
            {/* Ambient Glow inside card */}
            <div className={`absolute top-0 right-0 rounded-full transition-opacity duration-500 pointer-events-none ${isLarge ? 'w-[400px] h-[400px] bg-[#13ec5b]/5 blur-[80px]' : 'w-48 h-48 bg-[#13ec5b]/5 blur-[50px]'} -mr-20 -mt-20 opacity-20 group-hover:opacity-60`}></div>

            <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center text-[#13ec5b] mb-10 border border-[#13ec5b]/20 shadow-[0_4px_20px_-5px_rgba(19,236,91,0.2)] group-hover:scale-110 transition-transform duration-500 relative z-10" style={{ transform: "translateZ(30px)" }}>
                <span className="material-symbols-outlined text-3xl">
                    {isLarge ? "star" : "verified"}
                </span>
            </div>

            <h3 className={`font-black text-white leading-tight mb-6 uppercase tracking-tight ${isLarge ? "text-4xl" : "text-2xl"}`} style={{ transform: "translateZ(20px)" }}>
                {s.t}
            </h3>

            <div style={{ transform: "translateZ(10px)" }}>
                <RichText content={s.d} className={`${isLarge ? "text-lg" : "text-sm"} text-zinc-400 leading-relaxed font-medium prose-p:text-zinc-400 prose-strong:text-white`} />
            </div>

            {isLarge && (
                <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#13ec5b] opacity-80 group-hover:opacity-100 transition-opacity" style={{ transform: "translateZ(15px)" }}>
                    Saiba mais
                    <span className="material-symbols-outlined text-base group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </div>
            )}

            {/* Decorative bottom line */}
            <div className="absolute bottom-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-[#13ec5b]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </motion.div>
    );
};

export function Services({ getSetting }: ServicesProps) {
    const services = getSetting("section_servicos_content", SECTION_DEFAULTS.servicos);
    const items = services.items || SECTION_DEFAULTS.servicos.items;

    return (
        <section id="servicos" className="py-32 px-6 bg-[#09090b] relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500/5 blur-[120px] rounded-full opacity-20 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12 border-b border-white/5 pb-12">
                    <div className="max-w-3xl space-y-6">
                        <span className="text-[10px] font-black text-[#13ec5b] uppercase tracking-[0.4em] inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#13ec5b]"></span>
                            Nossos Serviços
                        </span>
                        <h2 className="text-4xl md:text-7xl font-black text-white leading-none tracking-tighter uppercase italic drop-shadow-xl">
                            {services.title}
                        </h2>
                    </div>
                    <p className="text-xl text-zinc-400 font-medium italic max-w-sm border-l-2 border-[#13ec5b] pl-8 py-2">
                        {services.subtitle}
                    </p>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {items.map((s: any, i: number) => (
                        <ServiceCard key={i} s={s} isLarge={i === 0} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
