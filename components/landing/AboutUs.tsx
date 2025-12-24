"use client";

import React from "react";

interface AboutUsProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function AboutUs({ getSetting }: AboutUsProps) {
    const content = getSetting("section_sobre_content", {
        title: "Muito mais que uma consultoria comum",
        description: "A RenovaMente une ergonomia técnica e humanização para transformar empresas, considerando pessoas, processos e exigências legais.",
        experience: "30",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
    });

    return (
        <section id="sobre" className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="relative">
                    <div className="absolute -bottom-6 -right-6 bg-primary p-8 rounded-3xl shadow-xl z-20 hidden md:block">
                        <span className="text-4xl font-black block text-text-dark tracking-tighter">
                            + DE {content.experience}
                        </span>
                        <span className="text-[10px] font-bold text-text-dark uppercase tracking-widest leading-none">
                            Anos de Experiência
                        </span>
                    </div>
                    <img
                        src={content.image}
                        className="rounded-[3rem] shadow-2xl w-full aspect-[4/3] object-cover relative z-10"
                        alt="Sobre"
                    />
                    <div className="absolute inset-0 bg-primary/20 rounded-[3rem] -rotate-3 -z-0"></div>
                </div>
                <div className="space-y-6">
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest">
                        SOBRE NÓS
                    </div>
                    <h2 className="text-4xl font-black text-[#0d1b12]">
                        {content.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        {content.description}
                    </p>
                </div>
            </div>
        </section>
    );
}
