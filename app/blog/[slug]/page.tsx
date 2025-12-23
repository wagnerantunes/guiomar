import prisma from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params

    const post = await prisma.post.findFirst({
        where: {
            slug,
            status: 'PUBLISHED'
        },
        include: {
            category: true,
            author: true,
            site: true
        }
    })

    if (!post) {
        notFound()
    }

    // Increment views
    await prisma.post.update({
        where: { id: post.id },
        data: { views: { increment: 1 } }
    })

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link href="/" className="text-2xl font-bold text-indigo-600">
                        RenovaMente
                    </Link>
                </div>
            </header>

            {/* Article */}
            <article className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8 transition"
                    >
                        <ArrowLeft size={20} />
                        Voltar para o blog
                    </Link>

                    {/* Category */}
                    {post.category && (
                        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                            {post.category.name}
                        </span>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        {post.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <User size={18} />
                            <span>{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={18} />
                            <span>{formatDate(post.publishedAt!)}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-indigo-600 prose-strong:text-gray-900"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>
        </div>
    )
}
