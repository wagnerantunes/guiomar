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
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => {
                        if (setSelectedPost) setSelectedPost(null);
                        if (typeof window !== "undefined") {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                    }}
                >
                    {logo ? (
                        <img src={logo} alt="RenovaMente" className="h-12 object-contain" />
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-3xl text-[var(--color-primary)] transition-transform group-hover:rotate-12">
                                spa
                            </span>
                            <span className="text-xl font-black tracking-tight text-[var(--color-text-main)]">
                                RenovaMente
                            </span>
                        </>
                    )}
                </div>

                <div className="hidden lg:flex items-center gap-8">
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
                            className="text-xs font-black text-gray-500 hover:text-[var(--color-primary)] transition-colors tracking-widest"
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/admin"
                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-[10px] font-black text-gray-400 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 uppercase transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">settings</span>{" "}
                        ADMIN
                    </Link>
                    <a
                        href={`https://wa.me/${((getSetting ? getSetting("navigation_footer", { phone: "5511994416024" }) : { phone: "5511994416024" }).phone || "5511994416024").replace(/\D/g, "")}`}
                        className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl text-xs font-black hover:bg-[var(--color-primary-dark)] shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        FALE CONOSCO
                    </a>
                </div>
            </div>
        </nav>
    );
}

