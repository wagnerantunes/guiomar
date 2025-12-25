import { auth } from '@/lib/auth';
import React from 'react';
import DashboardContent from './DashboardContent';
import prisma from '@/lib/prisma';

export default async function AdminDashboard() {
    const session = await auth();

    // Get user's site just to verify it exists
    const siteUser = await prisma.siteUser.findFirst({
        where: { userId: session?.user?.id },
    });

    if (!siteUser) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-6 animate-in fade-in duration-700">
                <div className="size-24 rounded-[2.5rem] bg-[#13ec5b]/5 text-[#13ec5b] flex items-center justify-center border border-[#13ec5b]/10 shadow-2xl shadow-[#13ec5b]/5">
                    <span className="material-symbols-outlined text-4xl">domain_disabled</span>
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-[#0d1b12] dark:text-white uppercase tracking-[0.2em]">Site não encontrado</h2>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                        Sua conta de administrador ainda não está vinculada a nenhuma instância ativa.
                        Por favor, contate o suporte técnico.
                    </p>
                </div>
                <button className="px-10 py-4 bg-[#0d1b12] dark:bg-white dark:text-[#0d1b12] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all">
                    Sincronizar Conta
                </button>
            </div>
        );
    }

    return <DashboardContent session={session} />;
}
