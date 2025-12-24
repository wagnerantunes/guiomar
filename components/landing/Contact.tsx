"use client";

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
        <section id="contato" className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-12 mb-12 text-center">
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest mb-4">
                        CONTATO
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-[#0d1b12]">Vamos conversar?</h2>
                </div>

                <div className="lg:col-span-5 bg-[#0d1b12] text-white p-12 rounded-[3.5rem] space-y-12 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                    <span className="material-symbols-outlined absolute -bottom-10 -right-10 opacity-5 text-[200px] select-none">
                        contact_support
                    </span>

                    <div className="space-y-6">
                        <h3 className="text-3xl font-black text-primary leading-tight">Pronto para<br />renovar sua empresa?</h3>
                        <p className="text-gray-400 font-medium">Nossa equipe de especialistas está pronta para desenhar a melhor solução para o seu cenário.</p>
                    </div>

                    <div className="space-y-8 relative z-10">
                        <div className="flex items-center gap-6 group">
                            <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-[#0d1b12] transition-all">
                                <span className="material-symbols-outlined">call</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Telefone</p>
                                <p className="text-lg font-bold">{footerSetting.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                            <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-[#0d1b12] transition-all">
                                <span className="material-symbols-outlined">mail</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">E-mail</p>
                                <p className="text-lg font-bold">{footerSetting.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7 bg-white p-4 md:p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl">
                    {status === "success" ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-fadeIn">
                            <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                                <span className="material-symbols-outlined text-5xl">check_circle</span>
                            </div>
                            <h3 className="text-2xl font-black text-[#0d1b12]">Mensagem Enviada!</h3>
                            <p className="text-gray-500 font-medium max-w-sm mx-auto">{formConfig.successMessage}</p>
                            <button
                                onClick={() => setStatus("idle")}
                                className="text-primary font-black text-xs uppercase tracking-widest hover:underline"
                            >
                                Enviar outra mensagem
                            </button>
                        </div>
                    ) : (
                        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                            {formConfig.fields.map((field: any) => (
                                <div key={field.id} className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                                        {field.label} {field.required && <span className="text-primary">*</span>}
                                    </label>

                                    {field.type === 'textarea' ? (
                                        <textarea
                                            name={field.label}
                                            required={field.required}
                                            rows={4}
                                            placeholder={`Escreva seu ${field.label.toLowerCase()}...`}
                                            className="w-full px-6 py-5 rounded-[1.5rem] bg-gray-50 border-2 border-transparent text-[#0d1b12] text-sm focus:border-primary/20 focus:bg-white outline-none resize-none transition-all"
                                        />
                                    ) : field.type === 'select' ? (
                                        <select
                                            name={field.label}
                                            required={field.required}
                                            className="w-full px-6 py-5 rounded-[1.5rem] bg-gray-50 border-2 border-transparent text-[#0d1b12] text-sm focus:border-primary/20 focus:bg-white outline-none transition-all appearance-none"
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
                                            className="w-full px-6 py-5 rounded-[1.5rem] bg-gray-50 border-2 border-transparent text-[#0d1b12] text-sm focus:border-primary/20 focus:bg-white outline-none transition-all"
                                        />
                                    )}
                                </div>
                            ))}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="w-full bg-[#0d1b12] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                >
                                    {status === "loading" ? "Enviando para nossa equipe..." : "Enviar Mensagem"}
                                </button>
                                {status === "error" && (
                                    <p className="text-red-500 text-[10px] font-black uppercase text-center mt-4 tracking-widest">
                                        Erro ao enviar. Tente novamente ou use nossos contatos diretos.
                                    </p>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
