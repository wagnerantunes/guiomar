export function FAQ() {
    return (
        <section className="py-20 bg-background-light">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-text-main text-center mb-12">
                    Perguntas Frequentes
                </h2>
                <div className="space-y-4">
                    {/* FAQ Item 1 */}
                    <details className="group bg-white rounded-lg shadow-sm open:ring-2 open:ring-primary/20">
                        <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg text-text-main list-none">
                            O que é a consultoria em ergonomia legal?
                            <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                                expand_more
                            </span>
                        </summary>
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                            É o serviço voltado para adequar a empresa às normas
                            regulamentadoras, como a NR-17, através de laudos (AET), comitês e
                            gestão técnica.
                        </div>
                    </details>
                    {/* FAQ Item 2 */}
                    <details className="group bg-white rounded-lg shadow-sm open:ring-2 open:ring-primary/20">
                        <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg text-text-main list-none">
                            Como a RenovaMente atua nos riscos psicossociais?
                            <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                                expand_more
                            </span>
                        </summary>
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                            Atuamos mapeando fatores de estresse, sobrecarga e clima, propondo
                            ações preventivas e de fortalecimento da saúde mental
                            organizacional.
                        </div>
                    </details>
                    {/* FAQ Item 3 */}
                    <details className="group bg-white rounded-lg shadow-sm open:ring-2 open:ring-primary/20">
                        <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg text-text-main list-none">
                            A consultoria é presencial ou online?
                            <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                                expand_more
                            </span>
                        </summary>
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                            Oferecemos formatos híbridos, com visitas técnicas presenciais
                            para diagnósticos e treinamentos, e acompanhamento online ágil.
                        </div>
                    </details>
                    {/* FAQ Item 4 */}
                    <details className="group bg-white rounded-lg shadow-sm open:ring-2 open:ring-primary/20">
                        <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg text-text-main list-none">
                            Qual o porte de empresa que vocês atendem?
                            <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                                expand_more
                            </span>
                        </summary>
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                            Atendemos empresas de pequeno, médio e grande porte, adaptando a
                            metodologia à realidade e necessidade de cada negócio.
                        </div>
                    </details>
                    {/* FAQ Item 5 */}
                    <details className="group bg-white rounded-lg shadow-sm open:ring-2 open:ring-primary/20">
                        <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg text-text-main list-none">
                            Como solicitar um orçamento?
                            <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                                expand_more
                            </span>
                        </summary>
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                            Basta entrar em contato pelo formulário abaixo, pelo WhatsApp ou
                            e-mail. Faremos um diagnóstico inicial para propor a melhor
                            solução.
                        </div>
                    </details>
                </div>
            </div>
            {/* Divider Arrow */}
            <div className="flex justify-center mt-12 opacity-30">
                <span className="material-symbols-outlined text-3xl">
                    keyboard_arrow_down
                </span>
            </div>
        </section>
    );
}
