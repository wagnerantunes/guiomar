'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { Skeleton } from '@/components/admin/Skeleton'
import { slugify } from '@/lib/utils'
import Link from 'next/link'

interface Category {
    id: string;
    name: string;
}

interface PageProps {
    params: Promise<{ id: string }>
}

export default function EditPostPage({ params }: PageProps) {
    const router = useRouter()
    const { id } = use(params)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [categories, setCategories] = useState<Category[]>([])
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        categoryId: '',
        status: 'DRAFT' as 'DRAFT' | 'PUBLISHED'
    })

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch categories and post data in parallel
                const [catsRes, postRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch(`/api/posts/${id}`)
                ])

                const [catsData, postData] = await Promise.all([
                    catsRes.json(),
                    postRes.json()
                ])

                if (Array.isArray(catsData)) {
                    setCategories(catsData)
                }

                if (postData && !postData.error) {
                    setFormData({
                        title: postData.title || '',
                        slug: postData.slug || '',
                        content: postData.content || '',
                        excerpt: postData.excerpt || '',
                        categoryId: postData.categoryId || '',
                        status: postData.status || 'DRAFT'
                    })
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setFetching(false)
            }
        }
        fetchData()
    }, [id])

    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: slugify(title)
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch(`/api/posts/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                router.push('/admin/posts')
                router.refresh()
            } else {
                alert('Erro ao atualizar post')
            }
        } catch (error) {
            console.error("Submit error:", error)
            alert('Erro ao atualizar post')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="p-6 md:p-10 space-y-10 max-w-5xl mx-auto w-full pb-20">
                <div className="flex items-center gap-4">
                    <Skeleton className="size-12 rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-8">
                        <Skeleton className="h-[600px] w-full rounded-[2.5rem]" />
                    </div>
                    <div className="lg:col-span-4 space-y-8">
                        <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 md:p-10 space-y-10 max-w-5xl mx-auto w-full pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/posts"
                        className="size-12 rounded-2xl bg-white dark:bg-[#183221] border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-400 hover:text-[#13ec5b] transition-all group shadow-sm"
                    >
                        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-[#0d1b12] dark:text-white tracking-tight uppercase tracking-widest">Editar Post</h1>
                        <p className="text-gray-500 font-medium mt-1">Atualize o conteúdo e configurações do seu artigo.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setFormData(prev => ({ ...prev, status: 'DRAFT' }))}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.status === 'DRAFT' ? 'bg-[#0d1b12] dark:bg-white text-white dark:text-[#0d1b12]' : 'text-gray-400 hover:text-[#0d1b12]'}`}
                    >
                        Rascunho
                    </button>
                    <button
                        onClick={() => setFormData(prev => ({ ...prev, status: 'PUBLISHED' }))}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.status === 'PUBLISHED' ? 'bg-[#13ec5b] text-[#0d1b12] shadow-lg shadow-[#13ec5b]/20' : 'text-gray-400 hover:text-[#13ec5b]'}`}
                    >
                        Publicado
                    </button>
                    <div className="w-px h-8 bg-gray-100 dark:bg-white/5 mx-2" />
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-8 py-3.5 bg-[#0d1b12] dark:bg-white dark:text-[#0d1b12] text-white rounded-xl text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-xl uppercase tracking-widest disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : 'Atualizar'}
                    </button>
                </div>
            </div>

            {/* Form Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                    {/* Main Settings */}
                    <div className="bg-white dark:bg-[#183221] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden">
                        <div className="p-10 space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Título do Post *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className="w-full bg-[#f6f8f6] dark:bg-[#102216] border-transparent rounded-[1.5rem] px-8 py-5 text-lg font-black focus:ring-4 focus:ring-[#13ec5b]/20 outline-none placeholder:text-gray-300 dark:text-white"
                                    placeholder="Como a meditação transforma..."
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Conteúdo do Artigo *</label>
                                <div className="border border-gray-100 dark:border-white/5 rounded-[2rem] overflow-hidden bg-white dark:bg-transparent">
                                    <RichTextEditor
                                        content={formData.content}
                                        onChange={(content) => setFormData({ ...formData, content })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    {/* Publishing Settings */}
                    <div className="bg-white dark:bg-[#183221] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden p-8 space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Categoria</label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full bg-[#f6f8f6] dark:bg-[#102216] border-transparent rounded-2xl px-6 py-4 text-xs font-black focus:ring-4 focus:ring-[#13ec5b]/20 outline-none text-[#0d1b12] dark:text-white appearance-none cursor-pointer uppercase tracking-widest"
                            >
                                <option value="">Sem Categoria</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Slug (URL)</label>
                            <div className="flex items-center gap-2 p-4 bg-[#f6f8f6] dark:bg-[#102216] rounded-2xl border border-transparent focus-within:ring-4 focus-within:ring-[#13ec5b]/20 transition-all">
                                <span className="material-symbols-outlined text-gray-400 text-sm">link</span>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="flex-1 bg-transparent border-none p-0 text-[10px] font-black uppercase tracking-widest outline-none text-gray-500"
                                    placeholder="slug-do-post"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Resumo do Post (Excerpt)</label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                rows={5}
                                className="w-full bg-[#f6f8f6] dark:bg-[#102216] border-transparent rounded-[2rem] p-6 text-xs font-medium focus:ring-4 focus:ring-[#13ec5b]/20 transition-all outline-none resize-none leading-relaxed dark:text-gray-300"
                                placeholder="Uma breve descrição que aparece na listagem do blog..."
                            />
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-4 text-center">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Otimização de SEO</p>
                            <div className="flex justify-center gap-3">
                                <div className="size-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-500 shadow-sm">
                                    <span className="material-symbols-outlined text-lg">check</span>
                                </div>
                                <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm">
                                    <span className="material-symbols-outlined text-lg">description</span>
                                </div>
                                <div className="size-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-sm">
                                    <span className="material-symbols-outlined text-lg">social_distance</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
