"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "/admin" },
    { id: "leads", label: "Leads & Inbox", icon: "inbox", href: "/admin/leads", badge: 5 },
    { id: "sections", label: "Page Sections", icon: "view_quilt", href: "/admin/sections" },
    { id: "navigation", label: "Menu & Footer", icon: "menu_open", href: "/admin/navigation" },
    { id: "newsletter", label: "Newsletter", icon: "campaign", href: "/admin/newsletter" },
    { id: "blog", label: "Blog Posts", icon: "article", href: "/admin/posts" },
    { id: "forms", label: "Forms Editor", icon: "check_box", href: "/admin/forms" },
    { id: "media", label: "Media Library", icon: "image", href: "/admin/media" },
];

export default function Sidebar() {
    const pathname = usePathname();

    const handleSignOut = () => {
        signOut({ callbackUrl: "/login" });
    };

    return (
        <aside
            className="w-64 bg-white dark:bg-[#183221] border-r border-gray-100 dark:border-white/5 hidden lg:flex flex-col flex-shrink-0"
            role="navigation"
            aria-label="Sidebar principal"
        >
            <div className="p-8 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar flex-1">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-3">
                    Menu Principal
                </h2>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            aria-label={item.label}
                            aria-current={isActive ? "page" : undefined}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-left group outline-none focus-visible:ring-2 focus-visible:ring-[#13ec5b]/50 ${isActive
                                ? "bg-[#13ec5b] text-[#0d1b12] shadow-lg shadow-[#13ec5b]/10"
                                : "text-gray-500 hover:bg-gray-50 hover:text-[#13ec5b] dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                                }`}
                        >
                            <span
                                className={`material-symbols-outlined text-[22px] transition-transform group-hover:scale-110 ${isActive ? "fill-1" : ""
                                    }`}
                            >
                                {item.icon}
                            </span>
                            <span className="text-[13px] tracking-tight">{item.label}</span>
                            {item.badge && (
                                <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-full ${isActive ? "bg-[#0d1b12] text-[#13ec5b]" : "bg-[#13ec5b] text-[#0d1b12]"}`}>
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto p-8 space-y-2 border-t border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-black/10">
                <Link
                    href="/admin/settings"
                    aria-label="Configurações"
                    aria-current={pathname === "/admin/settings" ? "page" : undefined}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-left outline-none focus-visible:ring-2 focus-visible:ring-[#13ec5b]/50 ${pathname === "/admin/settings"
                        ? "bg-[#13ec5b] text-[#0d1b12] shadow-lg"
                        : "text-gray-500 hover:bg-white hover:text-[#13ec5b] dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
                        }`}
                >
                    <span className="material-symbols-outlined text-[22px]">settings</span>
                    <span className="text-[13px] tracking-tight">Configurações</span>
                </Link>
                <button
                    onClick={handleSignOut}
                    aria-label="Sair da conta"
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
                >
                    <span className="material-symbols-outlined text-[22px]">logout</span>
                    <span className="text-[13px] tracking-tight">Sair</span>
                </button>
            </div>
        </aside>
    );
}

