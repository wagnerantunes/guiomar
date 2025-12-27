export function SearchWidget() {
    return (
        <div className="bg-white dark:bg-[#18181b]/40 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-white/5 group">
            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-[#13ec5b]">search</span>
                Pesquisar Insights
            </h3>
            <div className="relative">
                <input
                    className="w-full bg-[#f8faf8] dark:bg-black/20 border-none rounded-2xl py-4 px-6 text-sm font-medium text-[var(--color-text-main)] dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#13ec5b]/20 transition-all outline-none"
                    placeholder="O que você deseja aprender?"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-[#13ec5b] text-[#0d1b12] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#13ec5b]/20">
                    <span className="material-symbols-outlined text-lg font-bold">arrow_forward</span>
                </button>
            </div>
        </div>
    );
}
