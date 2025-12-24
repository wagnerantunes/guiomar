"use client";

import React from "react";

interface FooterProps {
    getSetting?: (key: string, defaultValue: any) => any;
    scrollTo?: (id: string) => void;
    handleNewsletterSubmit?: (e: React.FormEvent) => void;
    newsletterEmail?: string;
    setNewsletterEmail?: (email: string) => void;
    newsletterStatus?: string;
}

export function Footer({
    getSetting,
    scrollTo,
    handleNewsletterSubmit,
    newsletterEmail = "",
    setNewsletterEmail,
    newsletterStatus = "idle"
}: FooterProps) {
    const footerSettings = getSetting ? getSetting("navigation_footer", {
        bio: "Transformando ambientes de trabalho com técnica e humanização.",
        quickLinks: [
            { label: "Sobre", url: "#sobre" },
            { label: "Serviços", url: "#servicos" },
            { label: "Blog", url: "#blog" },
        ],
        socials: {
            instagram: "#",
            linkedin: "#",
        },
        phone: "5511994416024"
    }) : {
        bio: "Transformando ambientes de trabalho com técnica e humanização.",
        quickLinks: [
            { label: "Sobre", url: "#sobre" },
            { label: "Serviços", url: "#servicos" },
            { label: "Blog", url: "#blog" },
        ],
        socials: {
            instagram: "#",
            linkedin: "#",
        },
        phone: "5511994416024"
    };

    return (
        <footer className="bg-gray-100 py-20 px-6 border-t border-gray-200">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-3xl text-primary">
                            spa
                        </span>
                        <span className="text-xl font-black text-[#0d1b12]">
                            RenovaMente
                        </span>
                    </div>
                    <p className="text-sm text-gray-500">
                        {footerSettings.bio}
                    </p>
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-6">
                        Explore
                    </h4>
                    <ul className="space-y-4 text-sm font-bold text-gray-500">
                        {(footerSettings.quickLinks || []).map((link: any, i: number) => (
                            <li key={i}>
                                <button
                                    onClick={() => {
                                        if (scrollTo) {
                                            scrollTo(link.url.replace("#", ""));
                                        } else {
                                            window.location.href = "/" + link.url;
                                        }
                                    }}
                                    className="hover:text-primary transition-colors text-left"
                                >
                                    {link.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-6">
                        Redes Sociais
                    </h4>
                    <div className="flex gap-4">
                        {Object.entries(footerSettings.socials || {}).map(([key, val]) => (
                            <a
                                key={key}
                                href={val as string}
                                target="_blank"
                                className="text-gray-400 hover:text-primary transition-colors capitalize"
                            >
                                {key}
                            </a>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h4 className="text-xs font-black mb-4">Newsletter</h4>
                    <form className="flex flex-col gap-2" onSubmit={(e) => handleNewsletterSubmit ? handleNewsletterSubmit(e) : e.preventDefault()}>
                        <input
                            className="bg-gray-50 border-none rounded-xl text-xs py-2 px-4 outline-none focus:ring-2 focus:ring-primary/30 text-[#0d1b12]"
                            placeholder="Seu e-mail"
                            type="email"
                            required
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail && setNewsletterEmail(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={newsletterStatus === "loading" || !handleNewsletterSubmit}
                            className="bg-primary text-text-dark font-black py-2 rounded-xl text-[10px] uppercase hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {newsletterStatus === "loading" ? "..." :
                                newsletterStatus === "success" ? "Sucesso!" :
                                    newsletterStatus === "error" ? "Erro" : "Assinar"}
                        </button>
                    </form>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-200 text-center text-[10px] text-gray-400 font-black uppercase tracking-widest">
                © 2024 RenovaMente Consultoria de Bem-Estar. Todos os direitos
                reservados.
            </div>
        </footer>
    );
}
