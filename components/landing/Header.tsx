"use client";

import React from "react";
import Link from "next/link";

interface HeaderProps {
    getSetting?: (key: string, defaultValue: any) => any;
    scrollTo?: (id: string) => void;
    setSelectedPost?: (post: any) => void;
    logo?: string | null;
}

export function Header({ getSetting, scrollTo, setSelectedPost, logo }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-white/5 shadow-2xl transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => {
                        if (setSelectedPost) setSelectedPost(null);
                        if (typeof window !== "undefined") {
                            window.location.href = "/";
                        }
                    }}
                >
                    {logo ? (
                        <img src={logo} alt="RenovaMente" className="h-10 object-contain brightness-0 invert" />
                    ) : (
                        <>
                            <div className="size-10 bg-[#13ec5b] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(19,236,91,0.3)] group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-2xl text-[#09090b]">spa</span>
                            </div>
                            <span className="text-xl font-black tracking-tighter text-white">
                                Renova<span className="text-[#13ec5b]">Mente</span>
                            </span>
                        </>
                    )}
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-10">
                    {(getSetting ? getSetting("navigation_header", [
                        { label: "SOBRE", url: "#sobre" },
                        { label: "SERVIÇOS", url: "#servicos" },
                        { label: "METODOLOGIA", url: "#metodologia" },
                        { label: "BLOG", url: "#blog" },
                        { label: "CONTATO", url: "#contato" },
                    ]) : [
                        { label: "SOBRE", url: "#sobre" },
                        { label: "SERVIÇOS", url: "#servicos" },
                        { label: "METODOLOGIA", url: "#metodologia" },
                        { label: "BLOG", url: "#blog" },
                        { label: "CONTATO", url: "#contato" },
                    ]).map((link: any, i: number) => (
                        <button
                            key={i}
                            onClick={() => {
                                if (scrollTo) {
                                    scrollTo(link.url.replace("#", ""));
                                } else {
                                    window.location.href = "/" + link.url;
                                }
                            }}
                            className="text-[11px] font-black text-gray-400 hover:text-[#13ec5b] transition-colors tracking-[0.2em] uppercase relative group"
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#13ec5b] transition-all duration-300 group-hover:w-full"></span>
                        </button>
                    ))}
                </div>

                <div className="hidden lg:flex items-center gap-4">
                    <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-[10px] font-black text-gray-400 hover:text-white hover:border-[#13ec5b]/50 hover:bg-[#13ec5b]/10 uppercase transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">settings</span>
                        ADMIN
                    </Link>
                    <a
                        href={`https://wa.me/${((getSetting ? getSetting("navigation_footer", { phone: "5511994416024" }) : { phone: "5511994416024" }).phone || "5511994416024").replace(/\D/g, "")}`}
                        className="bg-[#13ec5b] text-[#09090b] px-6 py-3 rounded-xl text-[11px] font-black hover:bg-white hover:scale-105 shadow-[0_0_20px_rgba(19,236,91,0.3)] transition-all active:scale-95 uppercase tracking-wide"
                    >
                        Fale Conosco
                    </a>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span className="material-symbols-outlined text-3xl">
                        {mobileMenuOpen ? "close" : "menu"}
                    </span>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-40 bg-[#09090b]/95 backdrop-blur-xl transition-transform duration-500 lg:hidden flex flex-col items-center justify-center gap-8 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`} style={{ top: "96px" }}>
                {(getSetting ? getSetting("navigation_header", [
                    { label: "SOBRE", url: "#sobre" },
                    { label: "SERVIÇOS", url: "#servicos" },
                    { label: "METODOLOGIA", url: "#metodologia" },
                    { label: "BLOG", url: "#blog" },
                    { label: "CONTATO", url: "#contato" },
                ]) :
                    [{ label: "SOBRE", url: "#sobre" }, { label: "SERVIÇOS", url: "#servicos" }, { label: "BLOG", url: "#blog" }, { label: "CONTATO", url: "#contato" }]
                ).map((link: any, i: number) => (
                    <button
                        key={i}
                        onClick={() => {
                            setMobileMenuOpen(false);
                            if (scrollTo) {
                                scrollTo(link.url.replace("#", ""));
                            } else {
                                window.location.href = "/" + link.url;
                            }
                        }}
                        className="text-2xl font-black text-white hover:text-[#13ec5b] tracking-wider"
                    >
                        {link.label}
                    </button>
                ))}
            </div>
        </nav>
    );
}

