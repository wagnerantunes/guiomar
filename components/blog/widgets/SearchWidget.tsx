export function SearchWidget() {
    return (
        <div className="bg-card rounded-[2rem] p-8 border border-border relative group overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-background/40 backdrop-blur-md -z-10"></div>
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-primary">search</span>
                Pesquisar Insights
            </h3>
            <div className="relative">
                <input
                    className="w-full bg-muted/40 border border-border rounded-2xl py-4 px-6 text-sm font-bold text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background transition-all outline-none"
                    placeholder="O que você deseja aprender?"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-lg font-bold">arrow_forward</span>
                </button>
            </div>
        </div>
    );
}
