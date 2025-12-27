export function SearchWidget() {
    return (
        <div className="bg-[#09090b] rounded-[2rem] p-8 border border-white/5 relative group overflow-hidden">
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-md -z-10"></div>
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-[#13ec5b]">search</span>
                Pesquisar Insights
            </h3>
            <div className="relative">
                <input
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-white placeholder:text-gray-500 focus:border-[#13ec5b]/50 focus:bg-black/40 transition-all outline-none"
                    placeholder="O que você deseja aprender?"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-[#13ec5b] text-[#0d1b12] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#13ec5b]/20">
                    <span className="material-symbols-outlined text-lg font-bold">arrow_forward</span>
                </button>
            </div>
        </div>
    );
}
