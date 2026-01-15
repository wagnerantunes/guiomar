import type { Metadata } from "next";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
    title: "Política de Privacidade | RenovaMente",
    description: "Nossa política de privacidade e proteção de dados.",
};

export default function PrivacyPage() {
    return (
        <div className="bg-background min-h-screen flex flex-col font-sans selection:bg-primary/30 text-foreground">
            <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-32 md:py-40">
                <h1 className="text-4xl md:text-5xl font-black mb-10 text-foreground tracking-tight">Política de Privacidade</h1>
                
                <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-muted-foreground">
                    <p><strong>Última atualização: {new Date().toLocaleDateString('pt-BR')}</strong></p>

                    <p>
                        A sua privacidade é importante para nós. É política do <strong>RenovaMente</strong> respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site <a href="https://renovamente-guiomarmelo.com.br">renovamente-guiomarmelo.com.br</a>, e outros sites que possuímos e operamos.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8">1. Informações que coletamos</h2>
                    <p>
                        Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
                    </p>
                    <p>
                        Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8">2. Compartilhamento de dados</h2>
                    <p>
                        Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8">3. Cookies</h2>
                    <p>
                        O nosso site usa cookies para melhorar a experiência do usuário. Ao utilizar nosso site, você concorda com o uso de cookies de acordo com nossa Política de Cookies. Utilizamos cookies para:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Lembrar suas preferências de exibição;</li>
                        <li>Analisar o tráfego e o comportamento do usuário (Google Analytics);</li>
                        <li>Personalizar anúncios (Google Ads).</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-foreground mt-8">4. Links para sites externos</h2>
                    <p>
                        O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.
                    </p>

                    <h2 className="text-2xl font-bold text-foreground mt-8">5. Compromisso do Usuário</h2>
                    <p>
                        O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o RenovaMente oferece no site e com caráter enunciativo, mas não limitativo:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;</li>
                        <li>B) Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, ou azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;</li>
                        <li>C) Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do RenovaMente, de seus fornecedores ou terceiros.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-foreground mt-8">6. Mais informações</h2>
                    <p>
                        Esperemos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site.
                    </p>
                </div>
            </main>
            <div className="max-w-[1400px] w-full mx-auto px-6">
                 {/* O Footer global será inserido aqui via layout se necessário, mas para páginas 'isoladas' podemos usar o componente manual ou deixar o layout cuidar. 
                     Vou deixar o Layout cuidar, mas adicionei a importação para garantir que a página compile sem erros se eu decidisse usar.
                     Neste caso, removo o <Footer /> manual e deixo o GlobalFooter do layout agir. */}
            </div>
        </div>
    );
}
