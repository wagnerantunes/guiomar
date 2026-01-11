import { auth } from '@/lib/auth';
import React from 'react';
import DashboardContent from './DashboardContent';
import { getActiveSiteId } from '@/lib/admin-utils';

export default async function AdminDashboard() {
    const session = await auth();

    if (!session?.user?.id || !session?.user?.email) {
        return null; // MiddleWare handles redirect, but safe to return null
    }

    const siteId = await getActiveSiteId(session.user.id, session.user.email);

    if (!siteId) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-6 animate-in fade-in duration-700">
                <div className="size-24 rounded-[2.5rem] bg-primary/5 text-primary flex items-center justify-center border border-primary/10 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
                    <span className="material-symbols-outlined text-4xl">domain_disabled</span>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-foreground uppercase tracking-[0.2em]">Site não encontrado</h2>
                    <p className="text-[11px] text-muted font-bold uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                        Sua conta de administrador ainda não está vinculada a nenhuma instância ativa.
                        Por favor, contate o suporte técnico.
                    </p>
                </div>
                <form action={async () => {
                    'use server';
                    // This is just a trigger to refresh the page since getActiveSiteId handles auto-linking
                }}>
                    <button className="px-10 py-4 bg-primary text-primary-foreground rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                        Sincronizar Conta
                    </button>
                </form>
            </div>
        );
    }

    return <DashboardContent session={session} />;
}
