"use client";

import React from "react";
import { motion } from "framer-motion";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { RichText } from "@/components/ui/RichText";
import { InfiniteSlider } from "@/components/ui/InfiniteSlider";

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
        const moveX = (y - centerY) / 25;
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
            className={`bg-card/40 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-border/50 hover:border-primary/40 hover:shadow-[0_20px_80px_-20px_rgba(0,0,0,0.1),0_0_50px_-10px_rgba(var(--primary-rgb),0.1)] transition-all duration-500 group cursor-default relative overflow-hidden ${isLarge ? "md:col-span-2 md:row-span-2 min-h-[400px]" : "col-span-1 min-h-[300px]"
                }`}
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
        >
            {/* Ambient Glow inside card */}
            <div className={`absolute top-0 right-0 rounded-full transition-all duration-700 pointer-events-none ${isLarge ? 'w-[400px] h-[400px] bg-primary/10 blur-[100px]' : 'w-48 h-48 bg-primary/5 blur-[50px]'} -mr-20 -mt-20 opacity-0 group-hover:opacity-100 group-hover:scale-110`}></div>

            <div className="w-16 h-16 bg-gradient-to-br from-card-muted to-background rounded-2xl flex items-center justify-center text-primary mb-10 border border-border shadow-lg group-hover:border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 relative z-10" style={{ transform: "translateZ(30px)" }}>
                <span className="material-symbols-outlined text-3xl">
                    {s.icon || (isLarge ? "star" : "verified")}
                </span>
            </div>

            <h3 className={`font-black text-foreground leading-tight mb-6 uppercase tracking-tight ${isLarge ? "text-4xl" : "text-xl"}`} style={{ transform: "translateZ(20px)" }}>
                {s.t}
            </h3>

            <div style={{ transform: "translateZ(10px)" }}>
                <RichText
                    content={s.d}
                    className="text-muted-foreground/80 leading-relaxed font-medium"
                    style={{ fontSize: "var(--section-body-size)" } as any}
                />
            </div>

            {isLarge && (
                <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary opacity-60 group-hover:opacity-100 transition-opacity" style={{ transform: "translateZ(15px)" }}>
                    Evolução Constante
                    <span className="material-symbols-outlined text-base group-hover:translate-x-2 transition-transform">trending_up</span>
                </div>
            )}

            {/* Decorative bottom line */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000"></div>
        </motion.div>
    );
};

const ServiceCardSlider = ({ s }: { s: any }) => (
    <div className="bg-card/40 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-border/50 hover:border-primary/40 hover:shadow-[0_20px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 group cursor-default relative overflow-hidden h-full">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[50px] rounded-full -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

        <div className="w-16 h-16 bg-gradient-to-br from-card-muted to-background rounded-2xl flex items-center justify-center text-primary mb-10 border border-border shadow-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 relative z-10">
            <span className="material-symbols-outlined text-3xl">{s.icon || "verified"}</span>
        </div>

        <h3 className="text-xl font-black text-foreground leading-tight mb-6 uppercase tracking-tight">
            {s.t}
        </h3>

        <RichText
            content={s.d}
            className="text-muted-foreground/80 leading-relaxed font-medium"
            style={{ fontSize: "var(--section-body-size)" } as any}
        />

        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000"></div>
    </div>
);

export function Services({ getSetting }: ServicesProps) {
    const data = getSetting("section_servicos_content", SECTION_DEFAULTS.servicos);
    let items = data.items || SECTION_DEFAULTS.servicos.items;
    if (!Array.isArray(items)) items = [];
    const layout = data.layout || "grid";

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
                <div className="max-w-3xl space-y-6">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Soluções</span>
                    <h2
                        className="font-black text-foreground leading-[1.1] tracking-tighter uppercase italic"
                        style={{ fontSize: "var(--section-title-size)" } as any}
                    >
                        {data.title}
                    </h2>
                </div>
                <p
                    className="text-muted-foreground font-medium italic max-w-sm border-l-2 border-primary pl-8 py-2"
                    style={{ fontSize: "var(--section-subtitle-size)" } as any}
                >
                    {data.subtitle}
                </p>
            </div>

            {layout === "slider" ? (
                <InfiniteSlider
                    items={items}
                    renderCard={(item, i) => <ServiceCardSlider key={i} s={item} />}
                    speed={35}
                    cardWidth="400px"
                />
            ) : (
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
            )}
        </>
    );
}

