import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function PostsPage() {
    const session = await auth()

    const siteUser = await prisma.siteUser.findFirst({
        where: { userId: session?.user?.id },
        include: { site: true }
    })

    if (!siteUser) {
        return <div>Site não encontrado</div>
    }

    const posts = await prisma.post.findMany({
        where: { siteId: siteUser.siteId },
        include: {
            category: true,
            author: true
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
                    <p className="text-gray-600 mt-2">Gerencie todos os posts do seu site</p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
                >
                    <Plus size={20} />
                    Novo Post
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar posts..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                        <option value="">Todos os status</option>
                        <option value="PUBLISHED">Publicado</option>
                        <option value="DRAFT">Rascunho</option>
                    </select>
                </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Título</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Categoria</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Autor</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Data</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    Nenhum post encontrado. Crie seu primeiro post!
                                </td>
                            </tr>
                        ) : (
                            posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{post.title}</div>
                                        <div className="text-sm text-gray-500 mt-1">{post.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {post.category?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {post.author.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.status === 'PUBLISHED'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {post.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {formatDate(post.createdAt)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/admin/posts/${post.id}/edit`}
                                            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                                        >
                                            Editar
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
