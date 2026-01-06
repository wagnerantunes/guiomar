"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import Image from "next/image";

interface ContactProps {
    getSetting: (key: string, defaultValue: any) => any;
}

export function Contact({ getSetting }: ContactProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const contatoContent = getSetting("section_contato_content", SECTION_DEFAULTS.contato);

    const footerSetting = getSetting("navigation_footer", {
        phone: "(11) 99441-6024",
        email: "renova@renovamente.com.br"
    });

    const displayPhone = contatoContent.whatsapp || contatoContent.phone || footerSetting.phone || footerSetting.whatsapp;
    const displayEmail = contatoContent.email || footerSetting.email;

    const formConfig = getSetting("form_contact", {
        fields: [
            { id: "1", label: "Seu Nome", type: "text", required: true },
            { id: "2", label: "Seu melhor E-mail", type: "email", required: true },
            { id: "3", label: "Como podemos ajudar sua empresa?", type: "textarea", required: true },
        ],
        successMessage: "Recebemos sua mensagem! Em breve nossa equipe entrará em contato.",
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
            message: ""
        };

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative z-10">
            {/* Header Section */}
            <div className="lg:col-span-12 mb-8 text-center space-y-6">
                <span className="type-badge text-primary">Contato</span>
                <h2 className="type-h2 text-foreground">
                    {contatoContent.title}
                </h2>
                {contatoContent.subtitle && (
                    <p className="type-body text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
                        {contatoContent.subtitle}
                    </p>
                )}
            </div>

            <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">

                {/* Visual / Info Column */}
                <div className="bg-card rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden flex flex-col group min-h-[500px]">
                    {/* Top Image Section */}
                    <div className="h-[250px] relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10" />
                        <Image
                            src={contatoContent.image}
                            alt="Equipe reunida"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 1024px) 100vw, 600px"
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card to-transparent z-20" />
                    </div>

                    {/* Content Section */}
                    <div className="p-10 md:p-12 space-y-8 flex-1 flex flex-col justify-center relative z-30 -mt-10">
                        <div className="space-y-4">
                            <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                                Transforme seu ambiente de trabalho.
                            </h3>
                            <p className="text-base text-muted-foreground font-medium">
                                Estamos prontos para ouvir seus desafios e propor soluções personalizadas.
                            </p>
                        </div>

                        <div className="space-y-6 pt-4 border-t border-border/50">
                            <div className="flex items-center gap-6 p-4 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                                <div className="size-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <span className="material-symbols-outlined text-2xl">call</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Telefone / WhatsApp</p>
                                    <p className="text-lg font-bold text-foreground">{displayPhone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 p-4 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                                <div className="size-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <span className="material-symbols-outlined text-2xl">mail</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">E-mail Corporativo</p>
                                    <p className="text-lg font-bold text-foreground break-all">{displayEmail}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Column */}
                <div className="bg-card p-8 md:p-12 rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden backdrop-blur-xl flex flex-col justify-center">
                    {status === "success" ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-fadeIn py-20">
                            <div className="size-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4 shadow-xl shadow-green-500/20">
                                <span className="material-symbols-outlined text-5xl">check_rounded</span>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-foreground">Obrigado!</h3>
                                <p className="text-muted-foreground font-medium max-w-xs mx-auto">{formConfig.successMessage}</p>
                            </div>
                            <button
                                onClick={() => setStatus("idle")}
                                className="px-6 py-3 bg-muted rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                            >
                                Nova Mensagem
                            </button>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                                {formConfig.formTitle}
                            </h3>

                            {formConfig.fields.map((field: any) => (
                                <div key={field.id} className="group">
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            name={field.label}
                                            required={field.required}
                                            rows={5}
                                            className="w-full px-6 py-4 rounded-2xl bg-muted/50 border-2 border-border/50 text-foreground text-base focus:border-primary focus:bg-background focus:shadow-lg outline-none resize-none transition-all placeholder:text-muted-foreground/50"
                                            placeholder={field.label + (field.required ? ' *' : '')}
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            name={field.label}
                                            required={field.required}
                                            className="w-full px-6 py-4 rounded-2xl bg-muted/50 border-2 border-border/50 text-foreground text-base focus:border-primary focus:bg-background focus:shadow-lg outline-none transition-all placeholder:text-muted-foreground/50"
                                            placeholder={field.label + (field.required ? ' *' : '')}
                                        />
                                    )}
                                </div>
                            ))}

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full bg-primary text-primary-foreground py-5 rounded-xl font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 mt-4"
                            >
                                {status === "loading" ? "Enviando..." : "Enviar Solicitação"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
