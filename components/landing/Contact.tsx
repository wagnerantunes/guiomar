"use client";

import React, { useState } from "react";

interface ContactProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function Contact({ getSetting }: ContactProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const content = getSetting("navigation_footer", {
        phone: "(11) 99441-6024",
        email: "renova@renovamente.com.br"
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message"),
            source: "Landing Page Contact Form",
            domain: window.location.hostname
        };

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStatus("success");
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus("error");
            }
        } catch (err) {
            setStatus("error");
        }
    };

    return (
        <section id="contato" className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5 bg-[#0d1b12] text-white p-12 rounded-[3rem] space-y-10 shadow-2xl relative overflow-hidden">
                    <span className="material-symbols-outlined absolute -bottom-10 -right-10 opacity-5 text-[200px]">
                        contact_support
                    </span>
                    <h2 className="text-4xl font-black">Vamos conversar?</h2>
                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-4 text-[#13ec5b] font-bold">
                            <span className="material-symbols-outlined">
                                call
                            </span>{" "}
                            {content.phone}
                        </div>
                        <div className="flex items-center gap-4 text-gray-300">
                            <span className="material-symbols-outlined text-primary">
                                mail
                            </span>{" "}
                            {content.email}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-7 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl">
                    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Seu Nome"
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent text-[#0d1b12] text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                        />
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Seu E-mail"
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent text-[#0d1b12] text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                        />
                        <textarea
                            name="message"
                            required
                            rows={4}
                            placeholder="Como podemos ajudar?"
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent text-[#0d1b12] text-sm focus:ring-2 focus:ring-primary/40 outline-none resize-none"
                        ></textarea>
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="bg-[#0d1b12] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 disabled:opacity-50"
                        >
                            {status === "loading" ? "Enviando..." :
                                status === "success" ? "Mensagem Enviada!" :
                                    status === "error" ? "Erro ao Enviar" : "Enviar Mensagem"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
