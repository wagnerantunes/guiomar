export function SearchWidget() {
    return (
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 bg-white">
            <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">
                Buscar Artigos
            </h3>
            <label className="flex flex-col w-full">
                <div className="flex w-full items-stretch rounded-lg h-12 bg-[#e7f3eb] dark:bg-[#1f422b]/50 overflow-hidden focus-within:ring-2 ring-primary/50 transition-all">
                    <div className="text-text-muted flex items-center justify-center pl-4 pr-2">
                        <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                        className="w-full bg-transparent border-none text-text-main dark:text-white placeholder:text-text-muted/70 focus:ring-0 h-full text-base outline-none"
                        placeholder="O que você procura?"
                    />
                </div>
            </label>
        </div>
    );
}
