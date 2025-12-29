"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import {
    Instagram,
    Facebook,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    ArrowRight
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

interface FooterProps {
    getSetting?: (key: string, defaultValue: any) => any;
    scrollTo?: (id: string) => void;
    handleNewsletterSubmit?: (e: React.FormEvent) => void;
    newsletterEmail?: string;
    setNewsletterEmail?: (email: string) => void;
    newsletterStatus?: string;
    logo?: string | null;
}

export function Footer({
    getSetting,
    scrollTo,
    handleNewsletterSubmit,
    newsletterEmail = "",
    setNewsletterEmail,
    newsletterStatus = "idle",
    logo
}: FooterProps) {
    const { toast } = useToast();

    const defaultFooterData = {
        bio: "Consultoria em bem-estar corporativo que une técnica, cuidado e gestão humana para transformar ambientes de trabalho.",
        quickLinks: [
            { label: "Sobre Nós", url: "#sobre" },
            { label: "Nossos Serviços", url: "#servicos" },
            { label: "Metodologia", url: "#metodologia" },
            { label: "Blog", url: "/blog" },
            { label: "Contato", url: "#contato" },
        ],
        services: [
            "Ergonomia Legal",
            "Clima Organizacional",
            "Cultura Organizacional",
            "Bem-Estar Corporativo",
            "Recrutamento",
        ],
        socials: {
            instagram: "https://www.instagram.com/renovamente.guiomarmelo/",
            facebook: "https://www.facebook.com/renovamente.guiomarmelo",
            linkedin: "https://www.linkedin.com/company/renovamente",
        },
        phone: "(11) 99441-6024",
        email: "contato@renovamente.com.br",
        address: "São Paulo, SP"
    };

    const footerSettings = getSetting ? {
        ...defaultFooterData,
        ...getSetting("navigation_footer", defaultFooterData)
    } : defaultFooterData;

    const SocialIcon = ({ name }: { name: string }) => {
        switch (name.toLowerCase()) {
            case "instagram": return <Instagram size={18} />;
            case "facebook": return <Facebook size={18} />;
            case "linkedin": return <Linkedin size={18} />;
            default: return null;
        }
    };

    return (
        <footer className="bg-background border-t border-border pt-32 pb-12 px-6 relative overflow-hidden transition-colors duration-500">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full opacity-30 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full opacity-20 pointer-events-none" />

            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24 relative z-10">
                {/* BIO COLUMN */}
                <div className="space-y-10 lg:col-span-1">
                    {logo ? (
                        <img src={logo} alt="RenovaMente" className="h-12 object-contain" />
                    ) : (
                        <div className="flex items-center gap-3 group cursor-default">
                            <div className="size-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/5 group-hover:scale-110 transition-transform duration-500">
                                <span className="material-symbols-outlined text-3xl">spa</span>
                            </div>
                            <span className="text-xl font-black text-foreground tracking-tighter uppercase italic">
                                RenovaMente
                            </span>
                        </div>
                    )}
                    <p className="text-sm text-muted leading-relaxed font-medium">
                        {footerSettings.bio}
                    </p>
                    <div className="flex items-center gap-4">
                        {Object.entries(footerSettings.socials || {}).map(([key, val]) => (
                            <a
                                key={key}
                                href={val as string}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="size-12 rounded-xl bg-card border border-border flex items-center justify-center text-muted hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:-translate-y-1 shadow-sm"
                                title={key}
                            >
                                <SocialIcon name={key} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* QUICK LINKS */}
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-10">
                        Links Rápidos
                    </h4>
                    <ul className="space-y-6">
                        {(footerSettings.quickLinks || []).map((link: any, i: number) => (
                            <li key={i}>
                                <button
                                    onClick={() => {
                                        if (scrollTo && link.url.startsWith("#")) {
                                            scrollTo(link.url.replace("#", ""));
                                        } else {
                                            window.location.href = link.url;
                                        }
                                    }}
                                    className="text-sm font-bold text-muted hover:text-primary transition-all flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors"></span>
                                    {link.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* SERVICES */}
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-10">
                        Nossos Serviços
                    </h4>
                    <ul className="space-y-6">
                        {(footerSettings.services || []).map((service: string, i: number) => (
                            <li key={i}>
                                <span className="text-sm font-bold text-muted hover:text-foreground cursor-pointer transition-all block flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-foreground transition-colors"></span>
                                    {service}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CONTACT INFO */}
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-10">
                        Contato
                    </h4>
                    <ul className="space-y-6">
                        <li>
                            <a
                                href={`https://wa.me/${((footerSettings.phone || "5511994416024").replace(/\D/g, ""))}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-bold text-muted hover:text-foreground transition-all flex items-center gap-4 group"
                            >
                                <div className="size-8 rounded-lg bg-card border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    <Phone size={14} />
                                </div>
                                <span className="group-hover:translate-x-1 transition-transform">{footerSettings.phone || "(11) 99441-6024"}</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href={`mailto:${footerSettings.email || "contato@renovamente.com.br"}`}
                                className="text-sm font-bold text-muted hover:text-foreground transition-all flex items-center gap-4 group"
                            >
                                <div className="size-8 rounded-lg bg-card border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    <Mail size={14} />
                                </div>
                                <span className="group-hover:translate-x-1 transition-transform">{footerSettings.email || "contato@renovamente.com.br"}</span>
                            </a>
                        </li>
                        <li>
                            <div className="text-sm font-bold text-muted flex items-start gap-4 group cursor-default">
                                <div className="size-8 rounded-lg bg-card border border-border flex items-center justify-center text-primary">
                                    <MapPin size={14} />
                                </div>
                                <span>{footerSettings.address || "São Paulo, SP"}</span>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* NEWSLETTER */}
                <div className="bg-card/50 backdrop-blur-xl p-10 rounded-[3rem] border border-border relative overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                    <h4 className="text-xl font-black text-foreground mb-2 relative z-10 italic uppercase tracking-tight">Receba novidades</h4>
                    <p className="text-[10px] text-muted font-black uppercase tracking-[0.2em] mb-8 relative z-10">
                        Insights exclusivos de bem-estar
                    </p>
                    <form className="space-y-4 relative z-10" onSubmit={(e) => handleNewsletterSubmit ? handleNewsletterSubmit(e) : e.preventDefault()}>
                        <div className="space-y-1">
                            <input
                                className="w-full bg-background/50 border border-border rounded-2xl text-[11px] py-4 px-6 outline-none focus:border-primary/50 focus:bg-background text-foreground font-bold placeholder:text-muted/40 transition-all uppercase tracking-widest"
                                placeholder="Seu nome"
                                type="text"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <input
                                className="w-full bg-background/50 border border-border rounded-2xl text-[11px] py-4 px-6 outline-none focus:border-primary/50 focus:bg-background text-foreground font-bold placeholder:text-muted/40 transition-all uppercase tracking-widest"
                                placeholder="Seu melhor e-mail*"
                                type="email"
                                required
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail && setNewsletterEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={newsletterStatus === "loading" || !handleNewsletterSubmit}
                            className="w-full bg-primary text-primary-foreground font-black py-5 rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-primary/20"
                        >
                            {newsletterStatus === "loading" ? "Processando..." :
                                newsletterStatus === "success" ? "Inscrito!" :
                                    newsletterStatus === "error" ? "Tente novamente" : "Inscrever-se"}
                        </button>
                    </form>
                </div>
            </div>

            {/* COPYRIGHT */}
            <div className="max-w-7xl mx-auto pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 opacity-50 hover:opacity-100 transition-opacity duration-500">
                <p className="text-[10px] text-muted font-black uppercase tracking-widest">
                    © {new Date().getFullYear()} RenovaMente. Todos os direitos reservados.
                </p>
                <div className="flex gap-8 text-[9px] font-black text-muted uppercase tracking-widest">
                    <a href="#" className="hover:text-primary transition-colors">Termos</a>
                    <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
                </div>
            </div>
        </footer>
    );
}
