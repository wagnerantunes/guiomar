"use client";

import React from "react";
import { motion } from "framer-motion";
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
    const footerSettings = getSetting ? getSetting("navigation_footer", {
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
        }
    }) : {
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
        }
    };

    const SocialIcon = ({ name }: { name: string }) => {
        switch (name.toLowerCase()) {
            case "instagram": return <Instagram size={18} />;
            case "facebook": return <Facebook size={18} />;
            case "linkedin": return <Linkedin size={18} />;
            default: return null;
        }
    };

    return (
        <footer className="bg-white border-t border-gray-100 pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
                {/* BIO COLUMN */}
                <div className="space-y-8 lg:col-span-1">
                    {logo ? (
                        <img src={logo} alt="RenovaMente" className="h-12 object-contain" />
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-2xl">spa</span>
                            </div>
                            <span className="text-2xl font-black text-[var(--color-text-main)] tracking-tighter">
                                RenovaMente
                            </span>
                        </div>
                    )}
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                        {footerSettings.bio}
                    </p>
                    <div className="flex items-center gap-3">
                        {Object.entries(footerSettings.socials || {}).map(([key, val]) => (
                            <a
                                key={key}
                                href={val as string}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="size-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all duration-300"
                                title={key}
                            >
                                <SocialIcon name={key} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* QUICK LINKS */}
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-main)] mb-8">
                        Links Rápidos
                    </h4>
                    <ul className="space-y-4">
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
                                    className="text-sm font-bold text-gray-400 hover:text-[var(--color-primary)] transition-all flex items-center gap-2 group"
                                >
                                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                                    {link.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* SERVICES */}
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-main)] mb-8">
                        Nossos Serviços
                    </h4>
                    <ul className="space-y-4">
                        {(footerSettings.services || []).map((service: string, i: number) => (
                            <li key={i}>
                                <span className="text-sm font-bold text-gray-400 hover:text-[var(--color-primary)] cursor-pointer transition-all">
                                    {service}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CONTACT INFO */}
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-main)] mb-8">
                        Contato
                    </h4>
                    <ul className="space-y-4">
                        <li>
                            <a
                                href={`https://wa.me/${((footerSettings.phone || "5511994416024").replace(/\D/g, ""))}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-bold text-gray-400 hover:text-[var(--color-primary)] transition-all flex items-center gap-3 group"
                            >
                                <Phone size={16} className="text-[var(--color-primary)]" />
                                <span>{footerSettings.phone || "(11) 99441-6024"}</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href={`mailto:${footerSettings.email || "contato@renovamente.com.br"}`}
                                className="text-sm font-bold text-gray-400 hover:text-[var(--color-primary)] transition-all flex items-center gap-3 group"
                            >
                                <Mail size={16} className="text-[var(--color-primary)]" />
                                <span>{footerSettings.email || "contato@renovamente.com.br"}</span>
                            </a>
                        </li>
                        <li>
                            <div className="text-sm font-bold text-gray-400 flex items-start gap-3">
                                <MapPin size={16} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                                <span>{footerSettings.address || "São Paulo, SP"}</span>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* NEWSLETTER */}
                <div className="bg-[var(--color-background-light)]/50 p-8 rounded-[2.5rem] border border-gray-100">
                    <h4 className="text-lg font-black text-[var(--color-text-main)] mb-2">Receba novidades</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">
                        Dicas de bem-estar corporativo
                    </p>
                    <form className="space-y-3" onSubmit={(e) => handleNewsletterSubmit ? handleNewsletterSubmit(e) : e.preventDefault()}>
                        <div className="space-y-1">
                            <input
                                className="w-full bg-white border border-gray-100 rounded-xl text-xs py-3.5 px-5 outline-none focus:ring-2 focus:ring-primary/20 text-[var(--color-text-main)] font-medium"
                                placeholder="Seu nome"
                                type="text"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <input
                                className="w-full bg-white border border-gray-100 rounded-xl text-xs py-3.5 px-5 outline-none focus:ring-2 focus:ring-primary/20 text-[var(--color-text-main)] font-medium"
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
                            className="w-full bg-[var(--color-text-main)] text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest hover:bg-[var(--color-primary)] transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-black/5"
                        >
                            {newsletterStatus === "loading" ? "Processando..." :
                                newsletterStatus === "success" ? "Inscrito!" :
                                    newsletterStatus === "error" ? "Tente novamente" : "Inscrever-se"}
                        </button>
                    </form>
                </div>
            </div>

            {/* COPYRIGHT */}
            <div className="max-w-7xl mx-auto pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    © {new Date().getFullYear()} RenovaMente Consultoria de Bem-Estar. Todos os direitos reservados.
                </p>
                <div className="flex gap-8 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                    <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
                    <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
                </div>
            </div>
        </footer>
    );
}
