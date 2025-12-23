export function NewsletterWidget() {
    return (
        <div className="bg-[#e7f3eb] dark:bg-[#1f422b] rounded-xl p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-primary/10 dark:text-primary/5">
                <span className="material-symbols-outlined text-[120px] font-bold">
                    mail
                </span>
            </div>
            <div className="relative z-10">
                <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">
                    Newsletter Semanal
                </h3>
                <p className="text-sm text-text-muted dark:text-gray-300 mb-4">
                    Receba dicas de bem-estar e produtividade toda segunda-feira.
                </p>
                <div className="flex flex-col gap-3">
                    <input
                        className="w-full h-10 rounded-lg border-none bg-white dark:bg-black/20 text-text-main dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary px-3 text-sm outline-none"
                        placeholder="Seu melhor e-mail"
                        type="email"
                    />
                    <button className="w-full h-10 rounded-lg bg-primary hover:bg-primary-dark text-[#0d1b12] font-bold text-sm transition-colors">
                        Inscrever-se
                    </button>
                </div>
            </div>
        </div>
    );
}
