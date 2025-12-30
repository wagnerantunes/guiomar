"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface HeaderProps {
    getSetting?: (key: string, defaultValue: any) => any;
    scrollTo?: (id: string) => void;
    setSelectedPost?: (post: any) => void;
    logo?: string | null;
    logoLight?: string | null;
    logoDark?: string | null;
    settings?: any;
}

export function Header({ getSetting, scrollTo, setSelectedPost, logo, logoLight, logoDark, settings }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuItems = getSetting ? getSetting("navigation_header", [
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
    ];

    // Logo Logic
    // Default to logoLight (for transparent darker hero) if not scrolled
    // If scrolled: Check theme. Light theme -> logoDark. Dark theme -> logoLight.
    // Fallback to 'logo' if specific ones are missing.
    const effectiveLogo = scrolled
        ? (theme === 'dark' ? (logoLight || logo) : (logoDark || logo))
        : (logoLight || logo);

    // Dimensions
    const width = settings?.logoWidthNavbar ? `${settings.logoWidthNavbar}px` : "auto";
    const height = settings?.logoHeightNavbar ? `${settings.logoHeightNavbar}px` : "40px";

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-2xl py-4" : "bg-transparent py-6"}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => {
                        if (setSelectedPost) setSelectedPost(null);
                        if (typeof window !== "undefined") {
                            window.location.href = "/";
                        }
                    }}
                >
                    {mounted && effectiveLogo ? (
                        <img
                            src={effectiveLogo}
                            alt="RenovaMente"
                            className="object-contain transition-all"
                            style={{
                                width: width,
                                height: height,
                                maxWidth: 'none'
                            }}
                        />
                    ) : (
                        <>
                            <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.3)] group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-2xl text-primary-foreground">spa</span>
                            </div>
                            <span className="text-xl font-black tracking-tighter text-foreground">
                                Renova<span className="text-primary">Mente</span>
                            </span>
                        </>
                    )}
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-10">
                    <div className="flex items-center gap-8 pr-10 border-r border-border">
                        {menuItems.map((link: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => {
                                    if (scrollTo) {
                                        scrollTo(link.url.replace("#", ""));
                                    } else {
                                        window.location.href = "/" + link.url;
                                    }
                                }}
                                className="text-[11px] font-black text-muted hover:text-primary transition-colors tracking-[0.2em] uppercase relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-[10px] font-black text-muted hover:text-foreground hover:border-primary/50 hover:bg-primary/5 uppercase transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">settings</span>
                            ADMIN
                        </Link>
                        <a
                            href={`https://wa.me/${((getSetting ? getSetting("navigation_footer", { phone: "5511994416024" }) : { phone: "5511994416024" }).phone || "5511994416024").replace(/\D/g, "")}`}
                            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl text-[11px] font-black hover:bg-foreground hover:text-background transition-all active:scale-95 uppercase tracking-wide shadow-lg shadow-primary/10"
                        >
                            Fale Conosco
                        </a>
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="lg:hidden flex items-center gap-4">
                    <ThemeToggle />
                    <button
                        className="text-foreground p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="material-symbols-outlined text-3xl">
                            {mobileMenuOpen ? "close" : "menu"}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl transition-all duration-500 lg:hidden flex flex-col items-center justify-center gap-10 ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
                {menuItems.map((link: any, i: number) => (
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
                        className="text-3xl font-black text-foreground hover:text-primary transition-all uppercase italic tracking-tighter"
                    >
                        {link.label}
                    </button>
                ))}

                <div className="pt-10 flex flex-col items-center gap-4 w-full px-10">
                    <a
                        href={`https://wa.me/${((getSetting ? getSetting("navigation_footer", { phone: "5511994416024" }) : { phone: "5511994416024" }).phone || "5511994416024").replace(/\D/g, "")}`}
                        className="w-full text-center bg-primary text-primary-foreground py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                    >
                        Fale Conosco
                    </a>
                </div>
            </div>
        </nav>
    );
}
