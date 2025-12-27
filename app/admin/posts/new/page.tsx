'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { slugify } from '@/lib/utils'
import Link from 'next/link'
import { SEOHealthCheck } from '@/components/admin/SEOHealthCheck'

interface Category {
    id: string;
    name: string;
}

export default function NewPostPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [showMediaPicker, setShowMediaPicker] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        image: '',
        categoryId: '',
        status: 'DRAFT' as 'DRAFT' | 'PUBLISHED'
    })

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch('/api/categories')
                const data = await res.json()
                if (Array.isArray(data)) {
                    setCategories(data)
                }
            } catch (error) {
                console.error("Error fetching categories:", error)
            }
        }
        fetchCategories()
    }, [])

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
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                router.push('/admin/posts')
                router.refresh()
            } else {
                alert('Erro ao criar post')
            }
        } catch (error) {
            console.error("Submit error:", error)
            alert('Erro ao criar post')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 md:p-10 space-y-10 max-w-6xl mx-auto w-full pb-20 bg-[#f8faf8] dark:bg-[#09090b]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-6">
                    <Link
                        href="/admin/posts"
                        aria-label="Voltar para lista de posts"
                        className="size-14 rounded-[1.5rem] bg-[#f8faf8] dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/5 transition-all group shadow-sm border border-gray-100 dark:border-white/5"
                    >
                        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-[#0d1b12] dark:text-white uppercase tracking-[0.2em]">Criação de Conteúdo</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Escriba um novo artigo memorável.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-[#f8faf8] dark:bg-black/20 p-1.5 rounded-2xl flex items-center border border-gray-100 dark:border-white/5">
                        <button
                            aria-label="Definir como rascunho"
                            aria-pressed={formData.status === 'DRAFT'}
                            onClick={() => setFormData(prev => ({ ...prev, status: 'DRAFT' }))}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === 'DRAFT' ? 'bg-white dark:bg-[#18181b] text-[#0d1b12] dark:text-white shadow-sm border border-gray-100 dark:border-white/10' : 'text-gray-400 hover:text-[#0d1b12]'}`}
                        >
                            Rascunho
                        </button>
                        <button
                            aria-label="Definir como publicado"
                            aria-pressed={formData.status === 'PUBLISHED'}
                            onClick={() => setFormData(prev => ({ ...prev, status: 'PUBLISHED' }))}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === 'PUBLISHED' ? 'bg-[#13ec5b] text-[#0d1b12] shadow-lg shadow-[#13ec5b]/20' : 'text-gray-400 hover:text-[#13ec5b]'}`}
                        >
                            Publicado
                        </button>
                    </div>
                    <div className="w-px h-10 bg-gray-100 dark:bg-white/5 mx-2" />
                    <button
                        aria-label="Salvar post"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-8 py-4 bg-[#0d1b12] dark:bg-[#13ec5b] dark:text-[#0d1b12] text-white rounded-2xl text-[10px] font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/5 uppercase tracking-[0.2em] disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <span className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {loading ? 'Processando...' : 'Finalizar Artigo'}
                    </button>
                </div>
            </div>

            {/* Form Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Main Settings */}
                    <div className="bg-white dark:bg-[#18181b] rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                        <div className="p-10 md:p-14 space-y-12">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 block">Título do Artigo <span className="text-red-500">*</span></label>
                                <input
                                    aria-label="Título do post"
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className="w-full bg-[#f8faf8] dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-[2.5rem] px-10 py-7 text-2xl font-black focus:ring-4 focus:ring-[#13ec5b]/10 outline-none placeholder:text-gray-200 dark:placeholder:text-white/10 transition-all dark:text-white"
                                    placeholder="Comece com um título impactante..."
                                    required
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">Corpo do Conteúdo <span className="text-red-500">*</span></label>
                                    <div className="flex items-center gap-2">
                                        <span className="size-2 rounded-full bg-[#13ec5b] animate-pulse" />
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Salvamento Automático</span>
                                    </div>
                                </div>
                                <div className="border border-gray-100 dark:border-white/5 rounded-[3rem] overflow-hidden bg-[#f8faf8] dark:bg-black/20 p-2">
                                    <RichTextEditor
                                        content={formData.content}
                                        onChange={(content) => setFormData({ ...formData, content })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 delay-150">
                    {/* Publishing Settings */}
                    <div className="bg-white dark:bg-[#18181b] rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden p-10 space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-sm">category</span>
                                </div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Classificação</label>
                            </div>
                            <select
                                aria-label="Selecionar categoria"
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full bg-[#f8faf8] dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl px-6 py-4 text-[10px] font-black focus:ring-4 focus:ring-[#13ec5b]/10 outline-none text-[#0d1b12] dark:text-white appearance-none cursor-pointer uppercase tracking-[0.2em]"
                            >
                                <option value="">Sem Categoria</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="size-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-sm">link</span>
                                </div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Identificador Único</label>
                            </div>
                            <div className="flex items-center gap-4 px-6 py-4 bg-[#f8faf8] dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5 focus-within:ring-4 focus-within:ring-[#13ec5b]/10 transition-all">
                                <input
                                    aria-label="URL do post (slug)"
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="flex-1 bg-transparent border-none p-0 text-[10px] font-black uppercase tracking-[0.2em] outline-none text-gray-500 dark:text-gray-400"
                                    placeholder="identificador-url"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="size-8 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-sm">subject</span>
                                </div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Resumo Executivo</label>
                            </div>
                            <textarea
                                aria-label="Resumo do post"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                rows={6}
                                className="w-full bg-[#f8faf8] dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-[2rem] p-8 text-[11px] font-bold focus:ring-4 focus:ring-[#13ec5b]/10 transition-all outline-none resize-none leading-relaxed dark:text-gray-300 placeholder:text-gray-200 dark:placeholder:text-white/5"
                                placeholder="Uma síntese que despertará curiosidade no leitor..."
                            />
                        </div>

                        <div className="pt-10 border-t border-gray-100 dark:border-white/5">
                            <SEOHealthCheck
                                title={formData.title}
                                content={formData.content}
                                excerpt={formData.excerpt}
                                image={formData.image}
                                slug={formData.slug}
                            />
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-white dark:bg-[#18181b] rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden p-10 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-green-50 dark:bg-green-500/10 text-[#13ec5b] flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm">image</span>
                            </div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Imagem de Destaque</label>
                        </div>

                        {formData.image ? (
                            <div className="relative group aspect-video rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/20">
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setShowMediaPicker(true)}
                                        className="p-3 bg-white text-[#0d1b12] rounded-full hover:scale-110 transition-all"
                                    >
                                        <span className="material-symbols-outlined">sync</span>
                                    </button>
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                        className="p-3 bg-white text-red-500 rounded-full hover:scale-110 transition-all"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowMediaPicker(true)}
                                className="w-full aspect-video rounded-3xl border-2 border-dashed border-gray-100 dark:border-white/10 flex flex-col items-center justify-center gap-3 text-gray-300 hover:text-[#13ec5b] hover:border-[#13ec5b]/50 transition-all group"
                            >
                                <div className="size-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Selecionar Imagem</span>
                            </button>
                        )}
                        <p className="text-[9px] text-gray-400 font-medium text-center px-4 uppercase tracking-tighter">
                            Recomendado: 1200x630px para redes sociais.
                        </p>
                    </div>
                </div>
            </div>

            <MediaPicker
                isOpen={showMediaPicker}
                onClose={() => setShowMediaPicker(false)}
                onSelect={(url) => {
                    setFormData(prev => ({ ...prev, image: url }));
                    setShowMediaPicker(false);
                }}
            />
        </div>
    )
}
