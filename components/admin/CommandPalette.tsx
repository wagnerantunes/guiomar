"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    Search,
    Inbox,
    Image,
    Megaphone,
    LogOut,
    ExternalLink
} from "lucide-react";
import { signOut } from "next-auth/react";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const pages = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Leads & Inbox", href: "/admin/leads", icon: Inbox },
        { name: "Edição de Seções", href: "/admin/sections", icon: FileText },
        { name: "Posts do Blog", href: "/admin/posts", icon: FileText },
        { name: "Newsletter", href: "/admin/newsletter", icon: Megaphone },
        { name: "Mídia & Arquivos", href: "/admin/media", icon: Image },
        { name: "Usuários", href: "/admin/users", icon: Users },
        { name: "Configurações", href: "/admin/settings", icon: Settings },
    ];

    const actions = [
        {
            name: "Ver Site Ao Vivo",
            action: () => window.open('/', '_blank'),
            icon: ExternalLink
        },
        {
            name: "Sair do Sistema",
            action: () => signOut({ callbackUrl: '/login' }),
            icon: LogOut,
            danger: true
        },
    ];

    const filteredPages = pages.filter((page) =>
        page.name.toLowerCase().includes(query.toLowerCase())
    );

    const filteredActions = actions.filter((action) =>
        action.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (callback: () => void) => {
        setOpen(false);
        callback();
        setQuery("");
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-[50%] top-[20%] z-[101] w-full max-w-lg translate-x-[-50%] gap-4 border border-border bg-card p-0 shadow-2xl rounded-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] outline-none overflow-hidden">
                    <div className="flex items-center border-b border-border px-4" cmdk-input-wrapper="">
                        <Search className="mr-2 h-5 w-5 shrink-0 opacity-50" />
                        <input
                            className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Digite um comando ou busque..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        <div className="flex items-center gap-1 text-[10px] text-muted font-bold uppercase tracking-widest bg-muted/20 px-2 py-1 rounded">
                            ESC
                        </div>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto overflow-x-hidden py-2 px-2 custom-scrollbar">
                        {filteredPages.length === 0 && filteredActions.length === 0 && (
                            <div className="py-6 text-center text-sm text-foreground/50">
                                Nenhum resultado encontrado.
                            </div>
                        )}

                        {filteredPages.length > 0 && (
                            <div className="mb-4">
                                <div className="px-2 py-1.5 text-[10px] font-black uppercase text-foreground/50 tracking-widest">
                                    Navegação
                                </div>
                                {filteredPages.map((page) => (
                                    <div
                                        key={page.href}
                                        onClick={() => handleSelect(() => router.push(page.href))}
                                        className="relative flex cursor-pointer select-none items-center rounded-xl px-3 py-2.5 text-sm outline-none hover:bg-primary/10 hover:text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors group"
                                    >
                                        <page.icon className="mr-3 h-4 w-4" />
                                        <span>{page.name}</span>
                                        <span className="ml-auto text-[10px] text-muted group-hover:text-primary/50 opacity-0 group-hover:opacity-100 transition-opacity">Ir</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {filteredActions.length > 0 && (
                            <div>
                                <div className="px-2 py-1.5 text-[10px] font-black uppercase text-foreground/50 tracking-widest">
                                    Ações
                                </div>
                                {filteredActions.map((action) => (
                                    <div
                                        key={action.name}
                                        onClick={() => handleSelect(action.action)}
                                        className={`relative flex cursor-pointer select-none items-center rounded-xl px-3 py-2.5 text-sm outline-none transition-colors group ${action.danger ? 'text-destructive hover:bg-destructive/10' : 'hover:bg-primary/10 hover:text-primary'}`}
                                    >
                                        <action.icon className="mr-3 h-4 w-4" />
                                        <span>{action.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="border-t border-border bg-muted/5 px-4 py-2 flex justify-between items-center">
                        <span className="text-[9px] text-muted font-bold uppercase tracking-widest">
                            RenovaMente Admin
                        </span>
                        <div className="flex gap-2">
                            <span className="text-[9px] text-muted font-bold">Protip: Use as setas para navegar</span>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
