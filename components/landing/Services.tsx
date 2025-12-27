"use client";

import React from "react";
import { motion } from "framer-motion";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { RichText } from "@/components/ui/RichText";

interface ServicesProps {
    getSetting: (key: string, defaultValue: any) => any;
}

const ServiceCard = ({ s }: { s: any }) => {
    const [rotateX, setRotateX] = React.useState(0);
    const [rotateY, setRotateY] = React.useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const moveX = (y - centerY) / 8;
        const moveY = (centerX - x) / 8;
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
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ rotateX, rotateY }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-primary/40 hover:shadow-2xl transition-all group cursor-default"
            style={{ transformStyle: "preserve-3d" }}
        >
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors" style={{ transform: "translateZ(30px)" }}>
                <span className="material-symbols-outlined text-2xl">
                    verified
                </span>
            </div>
            <h3 className="text-xl font-black text-[#0d1b12] mb-4" style={{ transform: "translateZ(20px)" }}>
                {s.t}
            </h3>
            <div style={{ transform: "translateZ(10px)" }}>
                <RichText content={s.d} className="text-sm text-gray-500 leading-relaxed prose-p:text-sm" />
            </div>
        </motion.div>
    );
};

export function Services({ getSetting }: ServicesProps) {
    const services = getSetting("section_servicos_content", SECTION_DEFAULTS.servicos);

    return (
        <section id="servicos" className="py-24 px-6 bg-[var(--color-background-light)]/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl font-black text-[var(--color-text-main)]">
                        {services.title}
                    </h2>
                    <p className="text-lg text-[var(--color-primary)] font-bold italic">
                        {services.subtitle}
                    </p>
                </div>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
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
                    {(services.items || SECTION_DEFAULTS.servicos.items).map((s: any, i: number) => (
                        <ServiceCard key={i} s={s} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
