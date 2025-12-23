import prisma from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function BlogPage() {
    const site = await prisma.site.findFirst({
        where: { domain: 'renovamente-guiomarmelo.com.br' }
    })

    if (!site) {
        return <div>Site não configurado</div>
    }

    const posts = await prisma.post.findMany({
        where: {
            siteId: site.id,
            status: 'PUBLISHED'
        },
        include: {
            category: true,
            author: true
        },
        orderBy: { publishedAt: 'desc' }
    })

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-2xl font-bold text-indigo-600">
                            RenovaMente
                        </Link>
                        <Link
                            href="/admin"
                            className="text-sm text-gray-600 hover:text-gray-900 transition"
                        >
                            Admin
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-indigo-100 hover:text-white mb-6 transition"
                    >
                        <ArrowLeft size={20} />
                        Voltar para home
                    </Link>
                    <h1 className="text-5xl font-bold mb-4">Blog</h1>
                    <p className="text-xl text-indigo-100">
                        Artigos sobre psicologia, bem-estar e desenvolvimento pessoal
                    </p>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {posts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Nenhum post publicado ainda.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
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
                                        <h2 className="text-xl font-bold text-gray-900 mt-2 mb-3 group-hover:text-indigo-600 transition">
                                            {post.title}
                                        </h2>
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
                </div>
            </section>
        </div>
    )
}
