"use client";

import React from "react";

interface SEOHealthCheckProps {
    title: string;
    content: string;
    excerpt: string;
    image: string;
    slug: string;
}

export function SEOHealthCheck({ title, content, excerpt, image, slug }: SEOHealthCheckProps) {
    const wordCount = content ? content.trim().split(/\s+/).length : 0;

    const checks = [
        {
            id: 'title',
            label: 'Título',
            status: title.length >= 40 && title.length <= 70 ? 'success' : title.length > 0 ? 'warning' : 'error',
            message: title.length === 0 ? 'Título ausente' : title.length < 40 ? 'Muito curto' : title.length > 70 ? 'Muito longo' : 'Ideal',
            icon: 'title'
        },
        {
            id: 'content',
            label: 'Conteúdo',
            status: wordCount >= 300 ? 'success' : wordCount >= 100 ? 'warning' : 'error',
            message: `${wordCount} palavras`,
            icon: 'article'
        },
        {
            id: 'excerpt',
            label: 'Resumo',
            status: excerpt.length >= 100 && excerpt.length <= 160 ? 'success' : excerpt.length > 0 ? 'warning' : 'error',
            message: excerpt.length === 0 ? 'Faltando' : 'Ajustar tamanho',
            icon: 'short_text'
        },
        {
            id: 'image',
            label: 'Imagem',
            status: image ? 'success' : 'error',
            message: image ? 'Definida' : 'Obrigatória',
            icon: 'image'
        }
    ];

    const score = Math.round((checks.filter(c => c.status === 'success').length / checks.length) * 100);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">SEO Health Score</span>
                    <span className="text-2xl font-black text-[#0d1b12] dark:text-white">{score}%</span>
                </div>
                <div className="flex-1 h-2 bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${score > 70 ? 'bg-[#13ec5b]' : score > 40 ? 'bg-orange-400' : 'bg-red-500'}`}
                        style={{ width: `${score}%` }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {checks.map((check) => (
                    <div
                        key={check.id}
                        className="bg-[#f8faf8] dark:bg-black/20 p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col gap-2 transition-all hover:scale-[1.02]"
                    >
                        <div className="flex items-center justify-between">
                            <span className={`material-symbols-outlined text-sm ${check.status === 'success' ? 'text-[#13ec5b]' : check.status === 'warning' ? 'text-orange-400' : 'text-red-500'}`}>
                                {check.icon}
                            </span>
                            <span className={`size-1.5 rounded-full ${check.status === 'success' ? 'bg-[#13ec5b]' : check.status === 'warning' ? 'bg-orange-400' : 'bg-red-500'}`}></span>
                        </div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{check.label}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-tighter ${check.status === 'success' ? 'text-[#0d1b12] dark:text-gray-300' : 'text-gray-400'}`}>
                            {check.message}
                        </span>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-gray-50 dark:border-white/5">
                <div className="bg-blue-50/50 dark:bg-blue-500/5 p-4 rounded-xl flex items-start gap-3">
                    <span className="material-symbols-outlined text-blue-500 text-lg">info</span>
                    <p className="text-[9px] font-bold text-blue-600 dark:text-blue-400/80 leading-relaxed uppercase tracking-wider">
                        Otimize para 300+ palavras e título entre 40-70 caracteres para melhor rankeamento.
                    </p>
                </div>
            </div>
        </div>
    );
}
