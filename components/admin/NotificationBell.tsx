"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Notification {
    id: string;
    name: string;
    message: string;
    createdAt: string;
    company: string | null;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/admin/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, [pathname]); // Refresh on navigation

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const hasUnread = notifications.length > 0;

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Notificações"
                aria-expanded={isOpen}
                className={`relative p-2.5 rounded-xl transition-all active:scale-95 border border-transparent ${isOpen || hasUnread ? "text-primary bg-primary/10" : "text-muted hover:text-primary hover:bg-primary/5"
                    }`}
            >
                <span className={`material-symbols-outlined transition-transform ${isOpen || hasUnread ? "fill-1" : ""} ${hasUnread ? "animate-tada" : ""}`}>
                    notifications
                </span>
                {hasUnread && (
                    <span className="absolute top-2.5 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-background animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-4 w-80 md:w-96 bg-card/80 backdrop-blur-2xl border border-border/80 rounded-[2rem] shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 zoom-in-95 duration-200">
                    <div className="p-5 border-b border-border flex justify-between items-center bg-muted/5">
                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest">
                            Notificações
                        </h3>
                        {hasUnread && (
                            <span className="bg-primary text-primary-foreground text-[9px] font-black px-2 py-0.5 rounded-md">
                                {notifications.length} NOVAS
                            </span>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-8 text-center text-muted text-xs">Carregando...</div>
                        ) : hasUnread ? (
                            <div className="divide-y divide-border/50">
                                {notifications.map((notif) => (
                                    <Link
                                        key={notif.id}
                                        href={`/admin/leads`}
                                        onClick={() => setIsOpen(false)}
                                        className="block p-5 hover:bg-primary/5 transition-colors group relative"
                                    >
                                        <div className="flex gap-4">
                                            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-xl">person_add</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-xs font-black text-foreground uppercase tracking-tight truncate pr-2">
                                                        Novo Lead
                                                    </p>
                                                    <span className="text-[9px] font-bold text-muted whitespace-nowrap">
                                                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-medium text-muted-foreground line-clamp-2">
                                                    <span className="text-foreground font-bold">{notif.name}</span> ({notif.company || 'Pessoal'}) enviou uma mensagem.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center space-y-3">
                                <div className="size-16 rounded-full bg-muted/10 flex items-center justify-center mx-auto text-muted/30">
                                    <span className="material-symbols-outlined text-3xl">notifications_off</span>
                                </div>
                                <p className="text-xs font-bold text-muted uppercase tracking-widest">
                                    Tudo limpo por aqui!
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-muted/5 border-t border-border text-center">
                        <Link
                            href="/admin/leads"
                            onClick={() => setIsOpen(false)}
                            className="text-[10px] font-black text-muted hover:text-primary transition-colors uppercase tracking-[0.2em]"
                        >
                            Ver todos os leads
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
