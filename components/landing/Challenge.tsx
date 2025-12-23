export function Challenge() {
    return (
        <section className="py-20 bg-background-light">
            <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl lg:text-4xl font-bold text-text-main mb-8">
                    O desafio das empresas hoje
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-12">
                    Empresas enfrentam desafios cada vez mais complexos relacionados à
                    saúde, segurança, engajamento e desempenho de seus colaboradores.
                    Exigências legais como a NR-1 e a NR-17, somadas ao aumento de
                    afastamentos e riscos psicossociais, tornam essencial uma atuação
                    estruturada, preventiva e alinhada à realidade do negócio.
                </p>
                <div className="inline-block bg-white border border-gray-100 p-8 rounded-2xl shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-full bg-primary/10 text-primary-dark">
                            <span className="material-symbols-outlined text-4xl">
                                trending_up
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-text-main">
                            +30% de produtividade
                        </h3>
                        <p className="text-gray-500 font-medium">em ambientes saudáveis</p>
                    </div>
                </div>
            </div>
            {/* Divider Arrow */}
            <div className="flex justify-center mt-16 opacity-30">
                <span className="material-symbols-outlined text-3xl">
                    keyboard_arrow_down
                </span>
            </div>
        </section>
    );
}
