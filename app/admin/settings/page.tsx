import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import React from "react";

export default async function SettingsPage() {
    const session = await auth();

    const siteUser = await prisma.siteUser.findFirst({
        where: { userId: session?.user?.id },
        include: { site: true },
    });

    if (!siteUser) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold text-gray-900">Site não encontrado</h2>
                <p className="text-gray-600 mt-2">Certifique-se de que sua conta está vinculada a um site.</p>
            </div>
        );
    }

    const site = siteUser.site;

    return (
        <div className="p-6 md:p-10 space-y-10 max-w-5xl mx-auto w-full pb-20">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#0d1b12] dark:text-white tracking-tight uppercase tracking-widest">
                        Global Settings
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">
                        Configure as diretrizes mestre, SEO e integrações do seu site.
                    </p>
                </div>
                <button className="px-8 py-4 bg-[#13ec5b] text-[#0d1b12] rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#13ec5b]/20 hover:scale-105 transition-all active:scale-95">
                    Salvar Tudo
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* SEO SECTION */}
                <div className="bg-white dark:bg-[#183221] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 dark:border-white/5 flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <h3 className="text-lg font-black text-[#0d1b12] dark:text-white">SEO & Indexação</h3>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                                    Site Name (Title Tag)
                                </label>
                                <input
                                    className="w-full bg-gray-50 dark:bg-zinc-800 border-transparent rounded-xl px-4 py-3 text-sm font-bold focus:ring-[#13ec5b]/30 outline-none"
                                    defaultValue={site.name}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                                    Custom Domain
                                </label>
                                <input
                                    className="w-full bg-gray-50 dark:bg-zinc-800 border-transparent rounded-xl px-4 py-3 text-sm font-mono focus:ring-[#13ec5b]/30 outline-none"
                                    defaultValue={site.domain || ""}
                                    placeholder="exemplo.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                                Global Meta Description
                            </label>
                            <textarea
                                rows={3}
                                className="w-full bg-gray-50 dark:bg-zinc-800 border-transparent rounded-xl px-4 py-3 text-sm font-medium focus:ring-[#13ec5b]/30 outline-none resize-none"
                                defaultValue={site.description || ""}
                            />
                        </div>
                    </div>
                </div>

                {/* BRANDING SECTION */}
                <div className="bg-white dark:bg-[#183221] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 dark:border-white/5 flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-[#13ec5b]/10 text-[#13ec5b] flex items-center justify-center">
                            <span className="material-symbols-outlined">brush</span>
                        </div>
                        <h3 className="text-lg font-black text-[#0d1b12] dark:text-white">Branding & Ícones</h3>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-4 text-center md:text-left">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">
                                Favicon (32x32)
                            </label>
                            <div className="size-24 mx-auto md:mx-0 bg-gray-50 dark:bg-zinc-800 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-3xl flex items-center justify-center cursor-pointer hover:border-[#13ec5b]/50 transition-colors group">
                                {site.favicon ? (
                                    <img src={site.favicon} alt="Favicon" className="size-10 object-contain" />
                                ) : (
                                    <span className="material-symbols-outlined text-[#13ec5b] text-4xl group-hover:scale-110 transition-transform">spa</span>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">
                                Social Sharing Image (1200x630)
                            </label>
                            <div className="aspect-video w-full bg-gray-50 dark:bg-zinc-800 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#13ec5b]/50 transition-colors group">
                                <span className="material-symbols-outlined text-gray-300 text-5xl group-hover:text-[#13ec5b] transition-colors">image</span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#13ec5b] transition-colors">
                                    Upload OG Image
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SYSTEM STATUS */}
                <div className="bg-[#0d1b12] rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5">
                    <div className="flex items-center gap-6">
                        <div className="size-16 rounded-3xl bg-[#13ec5b]/20 flex items-center justify-center text-[#13ec5b]">
                            <span className="material-symbols-outlined text-3xl">verified</span>
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-white tracking-tight uppercase tracking-widest">
                                RenovaMente Admin v2.5
                            </h4>
                            <p className="text-gray-400 text-sm font-medium">
                                Todos os sistemas estão operacionais. Nenhuma atualização pendente.
                            </p>
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <span className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest">
                            Last Backup: Hoje, 04:00 AM
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
