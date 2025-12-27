"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import MobileSidebar from "./MobileSidebar";

export default function AdminHeader() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [logo, setLogo] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings/site");
                if (res.ok) {
                    const data = await res.json();
                    setLogo(data.logoAdmin || data.logo);
                }
            } catch (error) {
                console.error("Error fetching header settings:", error);
            }
        };
        fetchSettings();
    }, []);

    return (
        <header
            className="sticky top-0 z-[60] w-full border-b border-white/5 bg-[#09090b]/60 backdrop-blur-2xl"
            role="banner"
        >
            <div className="px-6 md:px-10 lg:px-8 flex justify-center w-full">
                <div className="flex h-16 w-full items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Abrir menu lateral"
                            className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-[#13ec5b] transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>

                        <Link href="/" className="flex items-center gap-3 text-[#0d1b12] dark:text-white cursor-pointer group">
                            {logo ? (
                                <img src={logo} alt="RenovaMente" className="h-8 object-contain" />
                            ) : (
                                <>
                                    <div className="size-10 rounded-xl bg-[#13ec5b]/10 flex items-center justify-center text-[#13ec5b] group-hover:scale-110 transition-transform shadow-lg shadow-[#13ec5b]/5">
                                        <span className="material-symbols-outlined text-2xl">spa</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-md font-black leading-tight tracking-tight uppercase tracking-widest">RenovaMente</h2>
                                        <span className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-black">Painel de Controle</span>
                                    </div>
                                </>
                            )}
                        </Link>
                    </div>

                    <MobileSidebar
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    />

                    <nav className="hidden md:flex flex-1 justify-end gap-8 items-center" aria-label="Navegação do cabeçalho">
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5 focus-within:border-[#13ec5b]/50 focus-within:bg-[#09090b] transition-all group w-64">
                            <span className="material-symbols-outlined text-gray-500 text-[20px] group-focus-within:text-[#13ec5b] transition-colors">search</span>
                            <input
                                className="bg-transparent border-none text-xs font-bold focus:ring-0 w-full text-white placeholder:text-gray-600 outline-none"
                                placeholder="Buscar no painel..."
                                type="text"
                                aria-label="Buscar"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                aria-label="Ver site ao vivo"
                                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl hover:bg-[#13ec5b] hover:text-[#0d1b12] hover:border-[#13ec5b] transition-all shadow-sm active:scale-95"
                            >
                                <span className="material-symbols-outlined text-sm">visibility</span>
                                Site Ao Vivo
                            </Link>

                            <button
                                aria-label="Notificações"
                                className="relative p-2.5 text-gray-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/5 rounded-xl transition-all active:scale-95"
                            >
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-[#102216]"></span>
                            </button>

                            <div className="flex items-center gap-3 pl-4 border-l border-gray-100 dark:border-white/5">
                                <div className="text-right hidden lg:block">
                                    <p className="text-[11px] font-black text-[#0d1b12] dark:text-white leading-none">Guiomar Melo</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Administradora</p>
                                </div>
                                <div className="size-10 rounded-xl border-2 border-white dark:border-white/10 shadow-lg overflow-hidden shrink-0">
                                    <img
                                        alt="Avatar"
                                        className="h-full w-full object-cover"
                                        src="https://lh3.googleusercontent.com/a/ACg8ocL0O7T_F-zL7W3J_GhcBEox7bdUyHxk5JShcprT5YPMDd3e7Q=s96-c"
                                    />
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
