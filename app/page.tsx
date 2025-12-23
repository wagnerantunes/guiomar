import prisma from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Get the first site (RenovaMente)
  const site = await prisma.site.findFirst({
    where: { domain: 'renovamente-guiomarmelo.com.br' }
  })

  if (!site) {
    return <div>Site não configurado</div>
  }

  // Get recent published posts
  const recentPosts = await prisma.post.findMany({
    where: {
      siteId: site.id,
      status: 'PUBLISHED'
    },
    include: {
      category: true,
      author: true
    },
    orderBy: { publishedAt: 'desc' },
    take: 3
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Transformando Mentes,<br />Renovando Vidas
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Serviços de psicologia e terapia para ajudá-lo em sua jornada de transformação pessoal
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition shadow-lg"
              >
                Explorar Blog
                <ArrowRight size={20} />
              </Link>
              <Link
                href="#contato"
                className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Entre em Contato
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Últimos Artigos</h2>
            <p className="text-xl text-gray-600">
              Conteúdo de qualidade sobre psicologia e bem-estar
            </p>
          </div>

          {recentPosts.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum post publicado ainda.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition overflow-hidden group"
                >
                  {post.featuredImage && (
                    <div className="aspect-video bg-gradient-to-br from-indigo-400 to-purple-400" />
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="text-sm font-medium text-indigo-600">
                        {post.category.name}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3 group-hover:text-indigo-600 transition">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                    )}
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <span>{post.author.name}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(post.publishedAt!).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition"
            >
              Ver todos os posts
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">RenovaMente</h3>
            <p className="text-gray-400 mb-6">Transformando mentes, renovando vidas</p>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} RenovaMente. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
