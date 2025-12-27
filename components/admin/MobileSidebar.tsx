"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { menuItems } from "./Sidebar";

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
    const pathname = usePathname();
    const [logo, setLogo] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!isOpen) return;
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings/site");
                if (res.ok) {
                    const data = await res.json();
                    setLogo(data.logoAdmin || data.logo);
                }
            } catch (error) {
                console.error("Error fetching mobile sidebar settings:", error);
            }
        };
        fetchSettings();
    }, [isOpen]);

    const handleSignOut = () => {
        signOut({ callbackUrl: "/login" });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <aside className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-[#0d1b12] shadow-2xl flex flex-col animate-in slide-in-from-left duration-500">
                <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <Link href="/admin" onClick={onClose} className="flex items-center gap-3 text-[#0d1b12] dark:text-white">
                        {logo ? (
                            <img src={logo} alt="RenovaMente" className="h-8 object-contain" />
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-3xl text-[#13ec5b]">spa</span>
                                <h2 className="text-lg font-bold tracking-tight">RenovaMente</h2>
                            </>
                        )}
                    </Link>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-black dark:hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-1 overflow-y-auto flex-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-3">
                        Menu Administrativo
                    </span>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold ${isActive
                                    ? "bg-[#13ec5b]/10 text-[#13ec5b]"
                                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5"
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-xl ${isActive ? "fill-1" : ""}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm uppercase tracking-widest text-[11px]">{item.label}</span>
                                {item.badge && (
                                    <span className="ml-auto bg-[#13ec5b] text-[#0d1b12] text-[10px] font-black px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-white/5 space-y-2">
                    <Link
                        href="/admin/settings"
                        onClick={onClose}
                        className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold ${pathname === "/admin/settings"
                            ? "bg-[#13ec5b]/10 text-[#13ec5b]"
                            : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5"
                            }`}
                    >
                        <span className="material-symbols-outlined text-xl">settings</span>
                        <span className="text-[11px] uppercase tracking-widest">Configurações</span>
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-red-500 rounded-2xl transition-colors font-bold"
                    >
                        <span className="material-symbols-outlined text-xl">logout</span>
                        <span className="text-[11px] uppercase tracking-widest text-left">Sair do Painel</span>
                    </button>
                </div>
            </aside>
        </div>
    );
}
