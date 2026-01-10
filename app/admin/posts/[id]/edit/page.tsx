'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { Skeleton } from '@/components/admin/Skeleton'
import { slugify } from '@/lib/utils'
import Link from 'next/link'
import { SEOHealthCheck } from '@/components/admin/SEOHealthCheck'

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
    const [imagePosition, setImagePosition] = useState('center')

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
                    let loadedContent = postData.content || '';
                    let loadedPosition = 'center';

                    const metaMatch = loadedContent.match(/<!-- image_position:(.*?) -->/);
                    if (metaMatch) {
                        loadedPosition = metaMatch[1];
                        loadedContent = loadedContent.replace(/<!-- image_position:.*? -->/g, '');
                    }

                    setFormData({
                        title: postData.title || '',
                        slug: postData.slug || '',
                        content: loadedContent,
                        excerpt: postData.excerpt || '',
                        image: postData.image || '',
                        categoryId: postData.categoryId || '',
                        status: postData.status || 'DRAFT'
                    })
                    setImagePosition(loadedPosition);
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
                body: JSON.stringify({
                    ...formData,
                    content: formData.content + `<!-- image_position:${imagePosition} -->`
                })
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
        <div className="p-6 md:p-10 space-y-10 max-w-screen-2xl mx-auto w-full pb-20 bg-background">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-background/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-border sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-6">
                    <Link
                        href="/admin/posts"
                        aria-label="Voltar para lista de posts"
                        className="size-14 rounded-[1.5rem] bg-muted/5 flex items-center justify-center text-muted hover:text-primary hover:bg-primary/5 transition-all group shadow-sm border border-border"
                    >
                        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-foreground uppercase tracking-[0.2em]">Refinar Artigo</h1>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-[0.2em] mt-1">Aprimore e atualize sua publicação.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-muted/5 p-1.5 rounded-2xl flex items-center border border-border">
                        <button
                            aria-label="Definir como rascunho"
                            aria-pressed={formData.status === 'DRAFT'}
                            onClick={() => setFormData(prev => ({ ...prev, status: 'DRAFT' }))}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === 'DRAFT' ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted hover:text-foreground'}`}
                        >
                            Rascunho
                        </button>
                        <button
                            aria-label="Definir como publicado"
                            aria-pressed={formData.status === 'PUBLISHED'}
                            onClick={() => setFormData(prev => ({ ...prev, status: 'PUBLISHED' }))}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === 'PUBLISHED' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted hover:text-primary'}`}
                        >
                            Publicado
                        </button>
                    </div>
                    <div className="w-px h-10 bg-border mx-2" />
                    <button
                        aria-label="Atualizar post"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl text-[10px] font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 uppercase tracking-[0.2em] disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <span className="size-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />}
                        {loading ? 'Sincronizando...' : 'Publicar Alterações'}
                    </button>
                </div>
            </div>

            {/* Form Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Main Settings */}
                    <div className="bg-card rounded-[3.5rem] border border-border shadow-sm overflow-hidden">
                        <div className="p-10 md:p-14 space-y-12">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 block">Título da Publicação <span className="text-destructive">*</span></label>
                                <input
                                    aria-label="Título do post"
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className="w-full bg-muted/5 border border-border rounded-[2.5rem] px-10 py-7 text-2xl font-black focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-muted/20 transition-all text-foreground"
                                    placeholder="Comece com um título impactante..."
                                    required
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block">Corpo Editorial <span className="text-destructive">*</span></label>
                                    <div className="flex items-center gap-2">
                                        <span className="size-2 rounded-full bg-primary animate-pulse" />
                                        <span className="text-[9px] font-bold text-muted uppercase tracking-widest">Salvamento Ativo</span>
                                    </div>
                                </div>
                                <div className="border border-border rounded-[3rem] overflow-hidden bg-muted/5 p-2">
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
                    <div className="bg-card rounded-[3.5rem] border border-border shadow-sm overflow-hidden p-10 space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-sm">category</span>
                                </div>
                                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Classificação</label>
                            </div>
                            <select
                                aria-label="Selecionar categoria"
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full bg-muted/5 border border-border rounded-2xl px-6 py-4 text-[10px] font-black focus:ring-4 focus:ring-primary/10 outline-none text-foreground appearance-none cursor-pointer uppercase tracking-[0.2em]"
                            >
                                <option value="">Sem Categoria</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-sm">link</span>
                                </div>
                                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Identificador Único</label>
                            </div>
                            <div className="flex items-center gap-4 px-6 py-4 bg-muted/5 rounded-2xl border border-border focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                                <input
                                    aria-label="URL do post (slug)"
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="flex-1 bg-transparent border-none p-0 text-[10px] font-black uppercase tracking-[0.2em] outline-none text-muted"
                                    placeholder="identificador-url"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-sm">subject</span>
                                </div>
                                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Resumo Executivo</label>
                            </div>
                            <textarea
                                aria-label="Resumo do post"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                rows={6}
                                className="w-full bg-muted/5 border border-border rounded-[2rem] p-8 text-[11px] font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none leading-relaxed text-muted placeholder:text-muted/20"
                                placeholder="Uma síntese que despertará curiosidade no leitor..."
                            />
                        </div>

                        <div className="pt-10 border-t border-border">
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
                    <div className="bg-card rounded-[3.5rem] border border-border shadow-sm overflow-hidden p-10 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm">image</span>
                            </div>
                            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Imagem de Destaque</label>
                        </div>

                        {formData.image ? (
                            <div className="relative group aspect-video rounded-3xl overflow-hidden border border-border bg-muted/5">
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setShowMediaPicker(true)}
                                        className="p-3 bg-card text-foreground rounded-full hover:scale-110 transition-all"
                                    >
                                        <span className="material-symbols-outlined">sync</span>
                                    </button>
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                        className="p-3 bg-card text-destructive rounded-full hover:scale-110 transition-all"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowMediaPicker(true)}
                                className="w-full aspect-video rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 text-muted hover:text-primary hover:border-primary/50 transition-all group"
                            >
                                <div className="size-12 rounded-2xl bg-muted/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Selecionar Imagem</span>
                            </button>
                        )}
                        <p className="text-[9px] text-muted font-medium text-center px-4 uppercase tracking-tighter">
                            Recomendado: 1200x630px para redes sociais.
                        </p>

                        {formData.image && (
                            <ImagePositionSelector
                                value={imagePosition}
                                onChange={setImagePosition}
                            />
                        )}
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

function ImagePositionSelector({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const positions = [
        { id: 'center', label: 'Centro (Padrão)', icon: 'center_focus_strong' },
        { id: 'top', label: 'Topo (Rosto)', icon: 'vertical_align_top' },
        { id: 'bottom', label: 'Base', icon: 'vertical_align_bottom' },
    ];

    return (
        <div className="space-y-3 pt-4 border-t border-border">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Recorte / Alinhamento</label>
            <div className="grid grid-cols-3 gap-2">
                {positions.map((pos) => (
                    <button
                        key={pos.id}
                        type="button"
                        onClick={() => onChange(pos.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${value === pos.id
                            ? 'bg-primary/10 border-primary text-primary shadow-sm'
                            : 'bg-muted/5 border-border text-muted hover:border-primary/50'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">{pos.icon}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest">{pos.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
