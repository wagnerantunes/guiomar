"use client";

import { useState } from "react";
import Link from "next/link";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
            {/* Top Bar */}
            <div className="layout-container max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                {/* Logo Area */}
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-primary rounded flex items-center justify-center text-text-main">
                        <span className="material-symbols-outlined">spa</span>
                    </div>
                    <h1 className="text-text-main text-xl font-bold tracking-tight">
                        RenovaMente
                    </h1>
                </div>
                {/* Socials & CTA Area */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex gap-2">
                        <a
                            className="p-2 text-text-main hover:text-primary transition-colors"
                            href="#"
                        >
                            <span className="material-symbols-outlined">photo_camera</span>
                        </a>{" "}
                        {/* Instagram placeholder */}
                        <a
                            className="p-2 text-text-main hover:text-primary transition-colors"
                            href="#"
                        >
                            <span className="material-symbols-outlined">public</span>
                        </a>{" "}
                        {/* Facebook placeholder */}
                        <a
                            className="p-2 text-text-main hover:text-primary transition-colors"
                            href="#"
                        >
                            <span className="material-symbols-outlined">work</span>
                        </a>{" "}
                        {/* LinkedIn placeholder */}
                    </div>
                    <a
                        className="hidden sm:flex bg-primary hover:bg-primary-dark text-text-main text-sm font-bold px-5 py-2.5 rounded-full transition-colors items-center gap-2"
                        href="https://wa.me/5511994416024"
                    >
                        <span className="material-symbols-outlined text-[20px]">chat</span>
                        Fale Conosco
                    </a>
                    <button
                        className="sm:hidden p-2 text-text-main"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </div>
            {/* Navigation Line */}
            <div className="hidden sm:block border-t border-gray-100 bg-white">
                <div className="max-w-[1280px] mx-auto flex justify-center gap-8 py-3">
                    <Link
                        className="text-sm font-semibold text-gray-600 hover:text-primary uppercase tracking-wide transition-colors"
                        href="/#quem-somos"
                    >
                        Quem Somos
                    </Link>
                    <Link
                        className="text-sm font-semibold text-gray-600 hover:text-primary uppercase tracking-wide transition-colors"
                        href="/#servicos"
                    >
                        Serviços
                    </Link>
                    <Link
                        className="text-sm font-semibold text-gray-600 hover:text-primary uppercase tracking-wide transition-colors"
                        href="/#metodologia"
                    >
                        Metodologia
                    </Link>
                    <Link
                        className="text-sm font-semibold text-gray-600 hover:text-primary uppercase tracking-wide transition-colors"
                        href="/blog"
                    >
                        Blog
                    </Link>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden border-t border-gray-100 bg-white absolute w-full left-0 top-[100%] shadow-lg">
                    <div className="flex flex-col p-4 gap-4">
                        <Link
                            className="text-sm font-semibold text-gray-600 hover:text-primary uppercase tracking-wide transition-colors"
                            href="/#quem-somos"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Quem Somos
                        </Link>
                        <Link
                            className="text-sm font-semibold text-gray-600 hover:text-primary uppercase tracking-wide transition-colors"
                            href="/#servicos"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Serviços
                        </Link>
                        <Link
                            className="text-sm font-semibold text-gray-600 hover:text-primary uppercase tracking-wide transition-colors"
                            href="/#metodologia"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Metodologia
                        </Link>
                        <Link
                            className="text-sm font-semibold text-gray-600 hover:text-primary uppercase tracking-wide transition-colors"
                            href="/blog"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Blog
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
