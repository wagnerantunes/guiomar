export function Services() {
    return (
        <section
            className="py-20 lg:py-28 bg-white border-y border-gray-100 overflow-hidden"
            id="servicos"
        >
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex flex-col sm:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-text-main mb-2">
                        Nossos Serviços
                    </h2>
                    <p className="text-lg text-gray-500">
                        Soluções completas para sua empresa
                    </p>
                </div>
                <div className="flex gap-2">
                    {/* Controls could go here if using JS, keeping simple for no-js */}
                </div>
            </div>
            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto gap-6 px-4 sm:px-6 lg:px-8 pb-8 no-scrollbar snap-x snap-mandatory">
                {/* Card 1 */}
                <div className="min-w-[300px] sm:min-w-[340px] snap-center bg-background-light p-6 rounded-xl border border-gray-100 hover:border-primary/50 transition-colors group flex flex-col">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-text-main transition-colors">
                        <span className="material-symbols-outlined">gavel</span>
                    </div>
                    <h3 className="text-xl font-bold text-text-main mb-3">
                        Ergonomia Legal
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Adequação à NR-17, AET (Análise Ergonômica do Trabalho), laudos e
                        gestão de comitês de ergonomia.
                    </p>
                </div>
                {/* Card 2 */}
                <div className="min-w-[300px] sm:min-w-[340px] snap-center bg-background-light p-6 rounded-xl border border-gray-100 hover:border-primary/50 transition-colors group flex flex-col">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-text-main transition-colors">
                        <span className="material-symbols-outlined">psychology</span>
                    </div>
                    <h3 className="text-xl font-bold text-text-main mb-3">
                        Riscos Psicossociais
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Mapeamento e gestão de fatores de risco psicossocial no trabalho,
                        prevenindo Burnout e estresse.
                    </p>
                </div>
                {/* Card 3 */}
                <div className="min-w-[300px] sm:min-w-[340px] snap-center bg-background-light p-6 rounded-xl border border-gray-100 hover:border-primary/50 transition-colors group flex flex-col">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-text-main transition-colors">
                        <span className="material-symbols-outlined">diversity_3</span>
                    </div>
                    <h3 className="text-xl font-bold text-text-main mb-3">
                        Cultura de Bem-Estar
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Diagnóstico de cultura, programas de qualidade de vida e
                        fortalecimento do engajamento.
                    </p>
                </div>
                {/* Card 4 */}
                <div className="min-w-[300px] sm:min-w-[340px] snap-center bg-background-light p-6 rounded-xl border border-gray-100 hover:border-primary/50 transition-colors group flex flex-col">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-text-main transition-colors">
                        <span className="material-symbols-outlined">chair</span>
                    </div>
                    <h3 className="text-xl font-bold text-text-main mb-3">
                        Ginástica Laboral
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Programas presenciais e online para prevenção de lesões e promoção
                        da saúde física.
                    </p>
                </div>
                {/* Card 5 */}
                <div className="min-w-[300px] sm:min-w-[340px] snap-center bg-background-light p-6 rounded-xl border border-gray-100 hover:border-primary/50 transition-colors group flex flex-col">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-text-main transition-colors">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <h3 className="text-xl font-bold text-text-main mb-3">
                        Treinamentos e Palestras
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Capacitação em ergonomia, saúde mental, liderança consciente e
                        segurança do trabalho.
                    </p>
                </div>
                {/* Card 6 */}
                <div className="min-w-[300px] sm:min-w-[340px] snap-center bg-background-light p-6 rounded-xl border border-gray-100 hover:border-primary/50 transition-colors group flex flex-col">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-text-main transition-colors">
                        <span className="material-symbols-outlined">design_services</span>
                    </div>
                    <h3 className="text-xl font-bold text-text-main mb-3">
                        Projetos Ergonômicos
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Consultoria para projetos de novos espaços de trabalho, mobiliário e
                        adaptações.
                    </p>
                </div>
                {/* Card 7 */}
                <div className="min-w-[300px] sm:min-w-[340px] snap-center bg-background-light p-6 rounded-xl border border-gray-100 hover:border-primary/50 transition-colors group flex flex-col">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-text-main transition-colors">
                        <span className="material-symbols-outlined">groups</span>
                    </div>
                    <h3 className="text-xl font-bold text-text-main mb-3">
                        Gestão de Afastados
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Acompanhamento e programas de retorno ao trabalho para colaboradores
                        afastados.
                    </p>
                </div>
                {/* Card 8 */}
                <div className="min-w-[300px] sm:min-w-[340px] snap-center bg-background-light p-6 rounded-xl border border-gray-100 hover:border-primary/50 transition-colors group flex flex-col">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-text-main transition-colors">
                        <span className="material-symbols-outlined">accessibility_new</span>
                    </div>
                    <h3 className="text-xl font-bold text-text-main mb-3">
                        Inclusão e PcD
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Análise de postos de trabalho e acessibilidade para inclusão segura
                        de Pessoas com Deficiência.
                    </p>
                </div>
                {/* Card 9 */}
                <div className="min-w-[300px] sm:min-w-[340px] snap-center bg-background-light p-6 rounded-xl border border-gray-100 hover:border-primary/50 transition-colors group flex flex-col">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-text-main transition-colors">
                        <span className="material-symbols-outlined">settings_suggest</span>
                    </div>
                    <h3 className="text-xl font-bold text-text-main mb-3">
                        Consultoria Personalizada
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Soluções sob medida para as necessidades específicas da sua empresa.
                    </p>
                </div>
            </div>
            {/* Divider Arrow */}
            <div className="flex justify-center mt-8 opacity-30">
                <span className="material-symbols-outlined text-3xl">
                    keyboard_arrow_down
                </span>
            </div>
        </section>
    );
}
