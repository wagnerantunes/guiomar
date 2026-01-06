"use client";

import React, { useState, useEffect } from "react";
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
    { id: "integrations", label: "Integrações", icon: "api", href: "/admin/integrations" },
    { id: "media", label: "Media Library", icon: "image", href: "/admin/media" },
    { id: "users", label: "Usuários", icon: "group", href: "/admin/users" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [logoAdmin, setLogoAdmin] = useState<string | null>(null);

    useEffect(() => {
        const fetchSiteData = async () => {
            try {
                const res = await fetch("/api/settings/site");
                if (res.ok) {
                    const data = await res.json();
                    setLogoAdmin(data.logoAdmin || data.logo);
                }
            } catch (error) {
                console.error("Error fetching site data:", error);
            }
        };
        fetchSiteData();
    }, []);

    const handleSignOut = () => {
        signOut({ callbackUrl: "/login" });
    };

    return (
        <aside
            className="w-64 bg-background/80 backdrop-blur-xl border-r border-border hidden lg:flex flex-col flex-shrink-0 relative z-20"
            role="navigation"
            aria-label="Sidebar principal"
        >
            <div className="h-20 border-b border-border flex items-center px-6 shrink-0">
                {logoAdmin ? (
                    <img src={logoAdmin} alt="RenovaMente" className="h-8 object-contain" />
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                            <span className="material-symbols-outlined text-lg">spa</span>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-foreground tracking-wide uppercase">RenovaCMS</h1>
                            <p className="text-[9px] font-bold text-muted uppercase tracking-widest">Manager</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1">
                <h2 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4 px-4 mt-4">
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
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium text-left group outline-none focus-visible:ring-2 focus-visible:ring-primary/50 relative overflow-hidden ${isActive
                                ? "bg-muted/10 text-primary border border-primary/10 shadow-sm"
                                : "text-muted-foreground hover:bg-muted/5 hover:text-foreground"
                                }`}
                        >
                            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                            <span
                                className={`material-symbols-outlined text-[20px] transition-transform group-hover:scale-105 ${isActive ? "fill-1" : ""
                                    }`}
                            >
                                {item.icon}
                            </span>
                            <span className="text-[12px] uppercase tracking-wide font-bold">{item.label}</span>
                            {item.badge && (
                                <span className={`ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-md border ${isActive ? "bg-primary/10 text-primary border-primary/20" : "bg-muted/10 text-muted border-muted/20"}`}>
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto p-4 space-y-2 border-t border-border bg-muted/5">
                <Link
                    href="/admin/settings"
                    aria-label="Configurações"
                    aria-current={pathname === "/admin/settings" ? "page" : undefined}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${pathname === "/admin/settings"
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted hover:bg-card-muted hover:text-primary"
                        }`}
                >
                    <span className="material-symbols-outlined text-[22px]">settings</span>
                    <span className="text-[13px] tracking-tight">Configurações</span>
                </Link>
                <Link
                    href="/admin/settings/password"
                    aria-label="Alterar Senha"
                    aria-current={pathname === "/admin/settings/password" ? "page" : undefined}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${pathname === "/admin/settings/password"
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted hover:bg-card-muted hover:text-primary"
                        }`}
                >
                    <span className="material-symbols-outlined text-[22px]">lock</span>
                    <span className="text-[13px] tracking-tight">Alterar Senha</span>
                </Link>
                <button
                    onClick={handleSignOut}
                    aria-label="Sair da conta"
                    className="w-full flex items-center gap-3 px-4 py-3 text-muted hover:text-destructive hover:bg-destructive/10 rounded-2xl font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-destructive/50"
                >
                    <span className="material-symbols-outlined text-[22px]">logout</span>
                    <span className="text-[13px] tracking-tight">Sair</span>
                </button>
            </div>
        </aside>
    );
}

