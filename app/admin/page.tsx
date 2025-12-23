import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { FileText, FolderOpen, Eye, TrendingUp } from 'lucide-react'

export default async function AdminDashboard() {
    const session = await auth()

    // Get user's site
    const siteUser = await prisma.siteUser.findFirst({
        where: { userId: session?.user?.id },
        include: { site: true }
    })

    if (!siteUser) {
        return <div>Site não encontrado</div>
    }

    // Get statistics
    const [postsCount, categoriesCount, totalViews, recentPosts] = await Promise.all([
        prisma.post.count({ where: { siteId: siteUser.siteId } }),
        prisma.category.count({ where: { siteId: siteUser.siteId } }),
        prisma.post.aggregate({
            where: { siteId: siteUser.siteId },
            _sum: { views: true }
        }),
        prisma.post.findMany({
            where: { siteId: siteUser.siteId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { category: true, author: true }
        })
    ])

    const stats = [
        { name: 'Total de Posts', value: postsCount, icon: FileText, color: 'bg-blue-500' },
        { name: 'Categorias', value: categoriesCount, icon: FolderOpen, color: 'bg-green-500' },
        { name: 'Visualizações', value: totalViews._sum.views || 0, icon: Eye, color: 'bg-purple-500' },
        { name: 'Taxa de Crescimento', value: '+12%', icon: TrendingUp, color: 'bg-orange-500' },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Bem-vindo de volta, {session?.user?.name}!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{stat.name}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="text-white" size={24} />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Posts Recentes</h2>
                </div>
                <div className="p-6">
                    {recentPosts.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">Nenhum post encontrado</p>
                    ) : (
                        <div className="space-y-4">
                            {recentPosts.map((post) => (
                                <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{post.title}</h3>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                            <span>{post.category?.name}</span>
                                            <span>•</span>
                                            <span>{post.author.name}</span>
                                            <span>•</span>
                                            <span>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.status === 'PUBLISHED'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {post.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
