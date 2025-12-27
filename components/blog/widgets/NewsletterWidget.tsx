export function NewsletterWidget() {
    return (
        <div className="bg-[#13ec5b] rounded-[2.5rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

            <div className="relative z-10">
                <h3 className="text-xl font-black text-[#0d1b12] uppercase tracking-wider mb-2">
                    Receba Novidades
                </h3>
                <p className="text-[#0d1b12]/80 text-xs font-bold uppercase tracking-widest mb-8 max-w-[200px]">
                    Insights exclusivos de bem-estar toda semana.
                </p>

                <div className="space-y-4">
                    <input
                        className="w-full h-12 rounded-2xl border-none bg-white/20 text-[#0d1b12] placeholder:text-[#0d1b12]/50 font-bold px-6 text-xs uppercase tracking-wider outline-none focus:bg-white focus:text-black transition-all"
                        placeholder="Seu e-mail"
                        type="email"
                    />
                    <button className="w-full h-12 rounded-2xl bg-[#0d1b12] text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-xl shadow-black/10">
                        Inscrever-se
                    </button>
                </div>
            </div>

            <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-9xl text-white/20 group-hover:scale-110 transition-transform duration-700">
                mail
            </span>
        </div>
    );
}
