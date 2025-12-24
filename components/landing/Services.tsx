"use client";

import React from "react";
import { motion } from "framer-motion";

interface ServicesProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function Services({ getSetting }: ServicesProps) {
    const defaultServices = [
        {
            t: "Ergonomia Legal",
            d: "Laudos NR-17 com foco em conformidade e saúde.",
        },
        {
            t: "Riscos Psicossociais",
            d: "Análise ARP integrada ao seu PGR.",
        },
        {
            t: "Clima Organizacional",
            d: "Diagnósticos para fortalecer relações internas.",
        },
        {
            t: "Cultura & Valores",
            d: "Desenvolvimento de práticas corporativas sólidas.",
        },
        {
            t: "Recrutamento",
            d: "Seleção humanizada alinhada ao propósito.",
        },
        {
            t: "Treinamentos",
            d: "Capacitações práticas para equipes e gestores.",
        },
    ];

    const services = getSetting("section_servicos_content", {
        title: "Nossos Serviços",
        subtitle: "Soluções completas para sua empresa",
        items: defaultServices
    });

    return (
        <section id="servicos" className="py-24 px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl font-black text-[#0d1b12]">
                        {services.title}
                    </h2>
                    <p className="text-lg text-gray-500 font-bold italic">
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
                    {(services.items || defaultServices).map((s: any, i: number) => (
                        <motion.div
                            key={i}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-primary/40 hover:shadow-2xl transition-all group cursor-default"
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-2xl">
                                    verified
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-[#0d1b12] mb-4">
                                {s.t}
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{s.d}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
