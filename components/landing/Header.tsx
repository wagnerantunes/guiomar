"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface HeaderProps {
    logo?: string | null;
    logoLight?: string | null;
    logoDark?: string | null;
    settings?: any;
    // Legacy props removed as Header handles its own logic now
}

export function Header({ logo, logoLight, logoDark, settings }: HeaderProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const isMobile = useIsMobile();

    // Hide Header on Admin routes
    if (pathname?.startsWith('/admin')) return null;

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getSetting = (key: string, defaultValue: any) => {
        if (!settings || !Array.isArray(settings)) return defaultValue;
        const target = settings.find((s: any) => s.key === key);
        // Simple value return, assuming basic types or relying on pre-parsed if passed
        // For complex JSON content usually handled by pages, Header mostly uses primitive values
        return target ? target.value : defaultValue;
    };

    const menuItems = getSetting("navigation_header", [
        { label: "SOBRE", url: "#sobre" },
        { label: "CLIENTES", url: "#clientes" },
        { label: "SERVIÇOS", url: "#servicos" },
        { label: "METODOLOGIA", url: "#metodologia" },
        { label: "BLOG", url: "/blog" },
        { label: "CONTATO", url: "#contato" },
    ]);

    const handleNavigation = (url: string) => {
        setMobileMenuOpen(false);
        if (url.startsWith("#")) {
            const id = url.replace("#", "");
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            } else {
                if (window.location.pathname !== '/') {
                    window.location.href = "/" + url;
                }
            }
        } else {
            window.location.href = url;
        }
    };

    // Logo Logic
    const effectiveLogo = mounted && theme === 'dark' ? (logoLight || logo) : (logoDark || logo);

    // Dimensions
    const width = settings?.logoWidthNavbar ? `${settings.logoWidthNavbar}px` : "auto";
    const height = settings?.logoHeightNavbar ? `${settings.logoHeightNavbar}px` : "48px";

    const socialLinks = [
        { icon: "linked_camera", url: "#" }, // Instagram placeholder
        { icon: "public", url: "#" }, // Facebook placeholder
        { icon: "work", url: "#" }, // LinkedIn placeholder
    ];

    const phoneNumber = ((getSetting("navigation_footer", { phone: "5511994416024" }) || { phone: "5511994416024" }).phone || "5511994416024").replace(/\D/g, "");

    const isBlogPost = pathname?.startsWith('/blog/') && pathname !== '/blog';

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 will-change-transform ${scrolled ? (isMobile ? "bg-background border-b border-border shadow-md" : "bg-background/80 backdrop-blur-xl border-b border-border shadow-md") : "bg-transparent"}`}>

            {/* ROW 1: TOP BAR (Desktop Only) */}
            <div className={`hidden lg:block w-full border-b border-border/10 ${scrolled ? "h-0 overflow-hidden opacity-0 py-0" : "h-12 opacity-100 py-0"} transition-all duration-300 bg-primary/5`}>
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">

                    {/* Social Icons (Left) */}
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-[#0077b5] hover:scale-110 transition-all" aria-label="LinkedIn">
                            <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        </a>
                        <a href="#" className="hover:text-[#E1306C] hover:scale-110 transition-all" aria-label="Instagram">
                            <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                        </a>
                        <a href="#" className="hover:text-[#1877F2] hover:scale-110 transition-all" aria-label="Facebook">
                            <svg className="size-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                        </a>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-6">
                        <ThemeToggle />
                        <Link
                            href="/admin"
                            className="flex items-center gap-2 hover:text-foreground transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">lock</span>
                            Admin
                        </Link>

                        <a
                            href={`https://wa.me/${phoneNumber}`}
                            className="bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:brightness-110 transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">chat</span>
                            Fale Conosco
                        </a>
                    </div>
                </div>
            </div>

            {/* ROW 2: MAIN NAVIGATION */}
            <div className={`${scrolled ? "py-4" : "py-6"} transition-all duration-300`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                    {/* LOGO (Left) */}
                    <Link href="/" className="flex items-center gap-3 cursor-pointer group shrink-0">
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
                            <div className="flex items-center gap-2">
                                <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg">
                                    <span className="material-symbols-outlined">spa</span>
                                </div>
                                <span className="font-black text-xl text-foreground tracking-tighter">Renova<span className="text-primary">Mente</span></span>
                            </div>
                        )}
                    </Link>

                    {/* NAV LINKS (Right) */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {menuItems.map((link: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => handleNavigation(link.url)}
                                className="text-[11px] font-black text-foreground/70 hover:text-primary transition-colors tracking-[0.15em] uppercase hover:underline decoration-2 underline-offset-4 decoration-primary"
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    {/* MOBILE TOGGLE & SCROLLED CTA */}
                    <div className="flex items-center gap-4 lg:hidden">
                        <ThemeToggle />
                        <button
                            className="p-2 text-foreground"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="material-symbols-outlined text-3xl">
                                {mobileMenuOpen ? "close" : "menu"}
                            </span>
                        </button>
                    </div>

                    {/* SCROLLED STATE CTA (Desktop Only - appears when scrolled) */}
                    <div className={`hidden lg:flex transition-all duration-500 ${scrolled ? "opacity-100 scale-100 w-auto" : "opacity-0 scale-90 w-0 overflow-hidden"}`}>
                        <a
                            href={`https://wa.me/${phoneNumber}`}
                            className="bg-primary text-primary-foreground size-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                            title="Fale Conosco"
                        >
                            <span className="material-symbols-outlined text-xl">chat</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            <div className={`fixed inset-0 z-40 bg-background transition-all duration-500 lg:hidden flex flex-col items-center justify-center gap-8 ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
                {!isMobile && <div className="absolute inset-0 backdrop-blur-3xl bg-background/95 z-[-1]" />}

                {/* Social Mobile */}
                <div className="flex items-center gap-6 mb-8 text-muted-foreground">
                    <a href="#" className="hover:text-primary"><span className="material-symbols-outlined text-2xl">post_add</span></a>
                    <a href="#" className="hover:text-primary"><span className="material-symbols-outlined text-2xl">photo_camera</span></a>
                    <a href="#" className="hover:text-primary"><span className="material-symbols-outlined text-2xl">thumb_up</span></a>
                </div>

                {menuItems.map((link: any, i: number) => (
                    <button
                        key={i}
                        onClick={() => handleNavigation(link.url)}
                        className="text-2xl font-black text-foreground hover:text-primary transition-colors uppercase tracking-widest"
                    >
                        {link.label}
                    </button>
                ))}

                <Link
                    href="/admin"
                    className="mt-8 flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-xs font-black text-muted uppercase"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <span className="material-symbols-outlined text-base">lock</span>
                    Admin Panel
                </Link>
            </div>
        </header>
    );
}
