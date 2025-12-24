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

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
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
                ? 'bg-[#13ec5b] text-[#0d1b12] shadow-lg shadow-[#13ec5b]/20 scale-110 z-10'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#13ec5b]'
                }`}
        >
            {children}
        </button>
    )

    return (
        <div className="flex flex-col rounded-[2rem] overflow-hidden bg-white dark:bg-[#102216]">
            {/* Toolbar */}
            <div className="bg-gray-50/50 dark:bg-[#183221]/50 border-b border-gray-100 dark:border-white/5 p-4 flex flex-wrap gap-2 items-center backdrop-blur-sm">
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

                <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-2" />

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

                <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-2" />

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

                <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-2" />

                <div className="flex items-center gap-1">
                    <ToolbarButton onClick={addImage} title="Inserir Imagem">
                        <ImageIcon size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                    <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="Inserir Link">
                        <LinkIcon size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                </div>

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
            <div className="p-8 md:p-12 min-h-[500px] cursor-text bg-white dark:bg-[#102216]">
                <EditorContent
                    editor={editor}
                    className="prose prose-lg max-w-none focus:outline-none dark:prose-invert 
                    prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed
                    prose-headings:text-[#0d1b12] dark:prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                    prose-strong:text-[#0d1b12] dark:prose-strong:text-[#13ec5b]
                    prose-blockquote:border-l-4 prose-blockquote:border-[#13ec5b] prose-blockquote:bg-gray-50/50 dark:prose-blockquote:bg-white/5 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                    prose-img:rounded-[2rem] prose-img:shadow-2xl prose-img:mx-auto"
                />
            </div>

            {/* Bottom Status Bar */}
            <div className="px-8 py-3 bg-gray-50 dark:bg-[#183221]/30 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-[#13ec5b] animate-pulse"></div>
                        Editor Ativo
                    </span>
                </div>
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    {editor.getText().length} Caracteres
                </div>
            </div>
        </div>
    )
}
