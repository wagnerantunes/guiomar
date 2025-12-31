'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Quote,
    Undo,
    Redo,
    ImageIcon,
    Link as LinkIcon
} from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { MediaPicker } from './MediaPicker'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    minHeight?: string
}

export default function RichTextEditor({ content, onChange, minHeight = "500px" }: RichTextEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [showMediaPicker, setShowMediaPicker] = useState(false)
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    // Sync content updates (e.g. from async fetch)
    useEffect(() => {
        if (editor && content && editor.getHTML() !== content) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    if (!editor) {
        return (
            <div className="p-10 text-center animate-pulse text-gray-400 font-black uppercase tracking-widest text-[10px]">
                Iniciando Editor...
            </div>
        )
    }

    const addImage = () => {
        const url = window.prompt('URL da imagem:')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !editor) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/media', {
                method: 'POST',
                body: formData,
            })

            if (res.ok) {
                const data = await res.json()
                editor.chain().focus().setImage({ src: data.url, alt: file.name }).run()
            } else {
                alert('Erro ao fazer upload da imagem')
            }
        } catch (error) {
            console.error('Upload error:', error)
            alert('Falha na conexão ao subir imagem')
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const addLink = () => {
        const url = window.prompt('URL do link:')
        if (url) {
            editor.chain().focus().setLink({ href: url }).run()
        }
    }

    const ToolbarButton = ({ onClick, isActive, children, title }: { onClick: () => void, isActive?: boolean, children: React.ReactNode, title: string }) => (
        <button
            onClick={onClick}
            type="button"
            title={title}
            className={`size-10 rounded-xl flex items-center justify-center transition-all ${isActive
                ? 'bg-primary text-[#0d1b12] shadow-lg shadow-primary/20 scale-110 z-10'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary'
                }`}
        >
            {children}
        </button>
    )

    return (
        <div className="flex flex-col rounded-[2rem] overflow-hidden bg-card border border-border">
            {/* Toolbar */}
            <div className="bg-muted/5 border-b border-border p-4 flex flex-wrap gap-2 items-center backdrop-blur-sm">
                <div className="flex items-center gap-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Negrito"
                    >
                        <Bold size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Itálico"
                    >
                        <Italic size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                </div>

                <div className="w-px h-6 bg-border mx-2" />

                <div className="flex items-center gap-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="Título 2"
                    >
                        <Heading2 size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Citação"
                    >
                        <Quote size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                </div>

                <div className="w-px h-6 bg-border mx-2" />

                <div className="flex items-center gap-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Lista Simples"
                    >
                        <List size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Lista Numerada"
                    >
                        <ListOrdered size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                </div>

                <div className="w-px h-6 bg-border mx-2" />

                <div className="flex items-center gap-1">
                    <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Upload Imagem">
                        {isUploading ? (
                            <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <ImageIcon size={18} strokeWidth={2.5} />
                        )}
                    </ToolbarButton>
                    <ToolbarButton onClick={() => setShowMediaPicker(true)} title="Biblioteca de Mídia">
                        <span className="material-symbols-outlined text-lg">photo_library</span>
                    </ToolbarButton>
                    <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="Inserir Link">
                        <LinkIcon size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                </div>

                <MediaPicker
                    isOpen={showMediaPicker}
                    onClose={() => setShowMediaPicker(false)}
                    onSelect={(url) => {
                        editor.chain().focus().setImage({ src: url }).run()
                        setShowMediaPicker(false)
                    }}
                />

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                />

                <div className="flex-1" />

                <div className="flex items-center gap-1">
                    <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Desfazer">
                        <Undo size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Refazer">
                        <Redo size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                </div>
            </div>

            {/* Editor Content Area */}
            <div
                className="p-8 md:p-12 cursor-text bg-card"
                style={{ minHeight }}
            >
                <EditorContent
                    editor={editor}
                    className="prose prose-lg max-w-none focus:outline-none dark:prose-invert 
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-headings:text-foreground prose-headings:font-black prose-headings:tracking-tight
                    prose-strong:text-primary
                    prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/5 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                    prose-img:rounded-[2rem] prose-img:shadow-2xl prose-img:mx-auto"
                />
            </div>

            {/* Bottom Status Bar */}
            <div className="px-8 py-3 bg-muted/5 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-primary animate-pulse"></div>
                        Editor Ativo
                    </span>
                </div>
                <div className="text-[9px] font-black text-muted uppercase tracking-widest">
                    {editor.getText().length} Caracteres
                </div>
            </div>
        </div>
    )
}
