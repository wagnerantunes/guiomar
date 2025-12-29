"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";

interface ContactProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function Contact({ getSetting }: ContactProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const footerSetting = getSetting("navigation_footer", {
        phone: "(11) 99441-6024",
        email: "renova@renovamente.com.br"
    });

    const formConfig = getSetting("form_contact", {
        fields: [
            { id: "1", label: "Seu Nome", type: "text", required: true },
            { id: "2", label: "Seu E-mail", type: "email", required: true },
            { id: "3", label: "Como podemos ajudar?", type: "textarea", required: true },
        ],
        successMessage: "Obrigado por entrar em contato! Nossa equipe responderá em breve.",
        active: true,
    });

    if (!formConfig.active) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");

        const formData = new FormData(e.currentTarget);
        const data: any = {
            source: "Landing Page Dynamic Form",
            domain: window.location.hostname,
            message: "" // Fallback for schema
        };

        // Combine all dynamic fields into the message field or handle specifically
        let messageParts: string[] = [];
        formConfig.fields.forEach((field: any) => {
            const value = formData.get(field.label);
            if (field.type === 'email') data.email = value;
            if (field.type === 'text' && field.label.toLowerCase().includes('nome')) data.name = value;

            messageParts.push(`${field.label}: ${value}`);
        });

        data.message = messageParts.join("\n");
        if (!data.name) data.name = "Lead do Formulário";
        if (!data.email) data.email = "não@informado.com";

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStatus("success");
                (e.target as HTMLFormElement).reset();
                setTimeout(() => setStatus("idle"), 5000);
            } else {
                setStatus("error");
            }
        } catch (err) {
            setStatus("error");
        }
    };

    return (
        <section id="contato" className="py-32 px-6 bg-background-dark relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                <div className="lg:col-span-12 mb-16 text-center space-y-6">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Contato</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
                        Vamos conversar?
                    </h2>
                </div>

                <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-5 bg-white/5 text-white p-12 rounded-[3.5rem] border border-white/5 space-y-12 shadow-2xl relative overflow-hidden flex flex-col justify-between group backdrop-blur-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-colors duration-700"></div>

                        <span className="material-symbols-outlined absolute -bottom-10 -right-10 opacity-5 text-[200px] select-none text-white">
                            contact_support
                        </span>

                        <div className="space-y-6 relative z-10">
                            <h3 className="text-3xl font-black text-white leading-tight">Pronto para<br /><span className="text-primary italic">renovar</span> sua empresa?</h3>
                            <p className="text-zinc-400 font-medium text-lg">Nossa equipe de especialistas está pronta para desenhar a melhor solução para o seu cenário.</p>
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="flex items-center gap-8 group/item">
                                <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-background-dark transition-all duration-300 shadow-lg">
                                    <span className="material-symbols-outlined text-2xl">call</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Telefone</p>
                                    <p className="text-xl font-bold font-manrope text-white">{footerSetting.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 group/item">
                                <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-background-dark transition-all duration-300 shadow-lg">
                                    <span className="material-symbols-outlined text-2xl">mail</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">E-mail</p>
                                    <p className="text-xl font-bold font-manrope text-white">{footerSetting.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 bg-white/5 p-8 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                        {status === "success" ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-fadeIn py-20">
                                <div className="size-32 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-xl shadow-primary/20">
                                    <span className="material-symbols-outlined text-6xl">check_circle</span>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black text-white">Mensagem Enviada!</h3>
                                    <p className="text-zinc-400 font-medium max-w-sm mx-auto text-lg">{formConfig.successMessage}</p>
                                </div>
                                <button
                                    onClick={() => setStatus("idle")}
                                    className="text-white font-black text-xs uppercase tracking-widest hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1"
                                >
                                    Enviar outra mensagem
                                </button>
                            </div>
                        ) : (
                            <form className="grid grid-cols-1 gap-8" onSubmit={handleSubmit}>
                                {formConfig.fields.map((field: any) => (
                                    <div key={field.id} className="space-y-2 group">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4 group-focus-within:text-primary transition-colors">
                                            {field.label} {field.required && <span className="text-primary">*</span>}
                                        </label>

                                        {field.type === 'textarea' ? (
                                            <textarea
                                                name={field.label}
                                                required={field.required}
                                                rows={4}
                                                placeholder={`Escreva seu ${field.label.toLowerCase()}...`}
                                                className="w-full px-8 py-6 rounded-[2rem] bg-white/5 border-2 border-transparent text-white text-base font-medium focus:border-primary/20 focus:bg-white/10 focus:shadow-xl outline-none resize-none transition-all placeholder:text-zinc-700"
                                            />
                                        ) : field.type === 'select' ? (
                                            <select
                                                name={field.label}
                                                required={field.required}
                                                className="w-full px-8 py-6 rounded-[2rem] bg-white/5 border-2 border-transparent text-white text-base font-medium focus:border-primary/20 focus:bg-white/10 focus:shadow-xl outline-none transition-all appearance-none"
                                            >
                                                <option value="">Selecione uma opção...</option>
                                                {field.options?.map((opt: string) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type={field.type}
                                                name={field.label}
                                                required={field.required}
                                                placeholder={`Seu ${field.label.toLowerCase()}...`}
                                                className="w-full px-8 py-6 rounded-[2rem] bg-white/5 border-2 border-transparent text-white text-base font-medium focus:border-primary/20 focus:bg-white/10 focus:shadow-xl outline-none transition-all placeholder:text-zinc-700 font-manrope"
                                            />
                                        )}
                                    </div>
                                ))}

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full bg-primary text-background-dark py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-background-dark transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-primary disabled:hover:text-background-dark"
                                    >
                                        {status === "loading" ? (
                                            <span className="flex items-center justify-center gap-3">
                                                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                Enviando...
                                            </span>
                                        ) : "Enviar Mensagem"}
                                    </button>
                                    {status === "error" && (
                                        <p className="text-red-500 text-[10px] font-black uppercase text-center mt-6 tracking-widest animate-pulse">
                                            Erro ao enviar. Tente novamente ou use nossos contatos diretos.
                                        </p>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
