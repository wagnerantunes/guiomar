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
        const moveX = (y - centerY) / 10;
        const moveY = (centerX - x) / 10;
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
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ rotateX, rotateY }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`bg-white p-10 rounded-[2.5rem] border border-zinc-100 hover:border-primary/40 hover:shadow-2xl transition-all group cursor-default relative overflow-hidden ${isLarge ? "md:col-span-2 md:row-span-2" : "col-span-1"
                }`}
            style={{ transformStyle: "preserve-3d" }}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>

            <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-[#09090b] mb-10 group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-sm" style={{ transform: "translateZ(30px)" }}>
                <span className="material-symbols-outlined text-3xl">
                    {isLarge ? "star" : "verified"}
                </span>
            </div>

            <h3 className={`font-black text-[#09090b] leading-tight mb-6 ${isLarge ? "text-3xl" : "text-xl"}`} style={{ transform: "translateZ(20px)" }}>
                {s.t}
            </h3>

            <div style={{ transform: "translateZ(10px)" }}>
                <RichText content={s.d} className={`${isLarge ? "text-lg" : "text-sm"} text-zinc-500 leading-relaxed font-medium`} />
            </div>

            {isLarge && (
                <div className="mt-10 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#09090b]">
                    Saiba mais
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
            )}
        </motion.div>
    );
};

export function Services({ getSetting }: ServicesProps) {
    const services = getSetting("section_servicos_content", SECTION_DEFAULTS.servicos);
    const items = services.items || SECTION_DEFAULTS.servicos.items;

    return (
        <section id="servicos" className="py-32 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="max-w-2xl space-y-6">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Nossos Serviços</span>
                        <h2 className="text-4xl md:text-6xl font-black text-[#09090b] leading-none tracking-tighter uppercase italic">
                            {services.title}
                        </h2>
                    </div>
                    <p className="text-lg text-zinc-400 font-bold italic max-w-sm border-l-2 border-primary pl-6 py-2">
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
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {items.map((s: any, i: number) => (
                        <ServiceCard key={i} s={s} isLarge={i === 0} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
