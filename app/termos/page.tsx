import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Termos de Uso | RenovaMente",
    description: "Termos e condições de uso do site RenovaMente.",
};

export default function TermsPage() {
    return (
        <div className="bg-background min-h-screen flex flex-col font-sans selection:bg-primary/30 text-foreground">
            <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-32 md:py-40">
                <h1 className="text-4xl md:text-5xl font-black mb-10 text-foreground tracking-tight">Termos de Uso</h1>
                
                <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-muted-foreground">
                    <p><strong>Última atualização: {new Date().toLocaleDateString('pt-BR')}</strong></p>

                    <h2 className="text-2xl font-bold text-foreground mt-8">1. Termos</h2>
                    <p>
                        Ao acessar ao site <a href="https://renovamente-guiomarmelo.com.br">RenovaMente</a>, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8">2. Uso de Licença</h2>
                    <p>
                        É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site RenovaMente , apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode: 
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Modificar ou copiar os materiais; </li>
                        <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial); </li>
                        <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site RenovaMente; </li>
                        <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou </li>
                        <li>Transferir os materiais para outra pessoa ou 'espelhe' os materiais em qualquer outro servidor.</li>
                    </ul>
                    <p>
                        Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por RenovaMente a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrónico ou impresso.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8">3. Isenção de responsabilidade</h2>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Os materiais no site da RenovaMente são fornecidos 'como estão'. RenovaMente não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.</li>
                        <li>Além disso, o RenovaMente não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ​​ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.</li>
                    </ol>

                    <h2 className="text-2xl font-bold text-foreground mt-8">4. Limitações</h2>
                    <p>
                        Em nenhum caso o RenovaMente ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em RenovaMente, mesmo que RenovaMente ou um representante autorizado da RenovaMente tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos conseqüentes ou incidentais, essas limitações podem não se aplicar a você.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8">5. Precisão dos materiais</h2>
                    <p>
                        Os materiais exibidos no site da RenovaMente podem incluir erros técnicos, tipográficos ou fotográficos. RenovaMente não garante que qualquer material em seu site seja preciso, completo ou atual. RenovaMente pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, RenovaMente não se compromete a atualizar os materiais.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8">6. Links</h2>
                    <p>
                        O RenovaMente não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por RenovaMente do site. O uso de qualquer site vinculado é por conta e risco do usuário.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8">Modificações</h2>
                    <p>
                        O RenovaMente pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8">Lei aplicável</h2>
                    <p>
                        Estes termos e condições são regidos e interpretados de acordo com as leis do RenovaMente e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.
                    </p>
                </div>
            </main>
        </div>
    );
}
