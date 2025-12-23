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
        return null
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

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('bold') ? 'bg-gray-300' : ''
                        }`}
                    type="button"
                >
                    <Bold size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('italic') ? 'bg-gray-300' : ''
                        }`}
                    type="button"
                >
                    <Italic size={18} />
                </button>
                <div className="w-px bg-gray-300 mx-1" />
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
                        }`}
                    type="button"
                >
                    <Heading2 size={18} />
                </button>
                <div className="w-px bg-gray-300 mx-1" />
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('bulletList') ? 'bg-gray-300' : ''
                        }`}
                    type="button"
                >
                    <List size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('orderedList') ? 'bg-gray-300' : ''
                        }`}
                    type="button"
                >
                    <ListOrdered size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-gray-200 transition ${editor.isActive('blockquote') ? 'bg-gray-300' : ''
                        }`}
                    type="button"
                >
                    <Quote size={18} />
                </button>
                <div className="w-px bg-gray-300 mx-1" />
                <button
                    onClick={addImage}
                    className="p-2 rounded hover:bg-gray-200 transition"
                    type="button"
                >
                    <ImageIcon size={18} />
                </button>
                <button
                    onClick={addLink}
                    className="p-2 rounded hover:bg-gray-200 transition"
                    type="button"
                >
                    <LinkIcon size={18} />
                </button>
                <div className="w-px bg-gray-300 mx-1" />
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    className="p-2 rounded hover:bg-gray-200 transition"
                    type="button"
                >
                    <Undo size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    className="p-2 rounded hover:bg-gray-200 transition"
                    type="button"
                >
                    <Redo size={18} />
                </button>
            </div>

            {/* Editor */}
            <EditorContent
                editor={editor}
                className="prose max-w-none p-4 min-h-[400px] focus:outline-none"
            />
        </div>
    )
}
