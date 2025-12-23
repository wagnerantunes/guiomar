export function WhyUs() {
    return (
        <section className="py-20 lg:py-28 bg-background-dark text-white">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                    Por que a RenovaMente?
                </h2>
                <p className="text-lg text-gray-300">
                    Nossa essência traduzida em valor para sua empresa
                </p>
            </div>
            <div className="flex overflow-x-auto gap-6 px-4 sm:px-6 lg:px-8 pb-8 no-scrollbar snap-x snap-mandatory">
                {/* Card 1 */}
                <div className="min-w-[280px] sm:min-w-[320px] snap-center bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-primary text-4xl mb-4">
                        verified
                    </span>
                    <h3 className="text-xl font-bold mb-3">Conformidade Legal</h3>
                    <p className="text-gray-400 text-sm">
                        Garantia de atendimento às normas regulamentadoras (NRs) com rigor
                        técnico.
                    </p>
                </div>
                {/* Card 2 */}
                <div className="min-w-[280px] sm:min-w-[320px] snap-center bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-primary text-4xl mb-4">
                        favorite
                    </span>
                    <h3 className="text-xl font-bold mb-3">Abordagem Humana</h3>
                    <p className="text-gray-400 text-sm">
                        Foco nas pessoas como centro da transformação organizacional.
                    </p>
                </div>
                {/* Card 3 */}
                <div className="min-w-[280px] sm:min-w-[320px] snap-center bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-primary text-4xl mb-4">
                        integration_instructions
                    </span>
                    <h3 className="text-xl font-bold mb-3">Visão Integrada</h3>
                    <p className="text-gray-400 text-sm">
                        Conexão entre saúde, segurança, RH e gestão estratégica.
                    </p>
                </div>
                {/* Card 4 */}
                <div className="min-w-[280px] sm:min-w-[320px] snap-center bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-primary text-4xl mb-4">
                        stars
                    </span>
                    <h3 className="text-xl font-bold mb-3">Experiência Comprovada</h3>
                    <p className="text-gray-400 text-sm">
                        Mais de 30 anos de expertise em ambientes corporativos.
                    </p>
                </div>
                {/* Card 5 */}
                <div className="min-w-[280px] sm:min-w-[320px] snap-center bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-primary text-4xl mb-4">
                        query_stats
                    </span>
                    <h3 className="text-xl font-bold mb-3">Resultados Mensuráveis</h3>
                    <p className="text-gray-400 text-sm">
                        Foco em indicadores de desempenho e retorno sobre o investimento
                        (ROI).
                    </p>
                </div>
                {/* Card 6 */}
                <div className="min-w-[280px] sm:min-w-[320px] snap-center bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-primary text-4xl mb-4">
                        handshake
                    </span>
                    <h3 className="text-xl font-bold mb-3">Parceria Estratégica</h3>
                    <p className="text-gray-400 text-sm">
                        Atuação próxima e consultiva, entendendo o negócio do cliente.
                    </p>
                </div>
            </div>
            {/* Divider Arrow */}
            <div className="flex justify-center mt-8 opacity-30 text-white">
                <span className="material-symbols-outlined text-3xl">
                    keyboard_arrow_down
                </span>
            </div>
        </section>
    );
}
