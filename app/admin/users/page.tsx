'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PasswordStrengthIndicator from '@/components/admin/PasswordStrengthIndicator'

interface User {
    id: string
    name: string
    email: string
    role: string
    createdAt: string
}

export default function UsersPage() {
    const router = useRouter()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'EDITOR',
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users')
            if (!response.ok) throw new Error('Erro ao carregar usuários')
            const data = await response.json()
            setUsers(data)
        } catch (error) {
            console.error('Error fetching users:', error)
            setError('Erro ao carregar usuários')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setSubmitting(true)

        try {
            const url = editingUser ? '/api/users' : '/api/users'
            const method = editingUser ? 'PATCH' : 'POST'
            const body = editingUser
                ? { id: editingUser.id, name: formData.name, role: formData.role, ...(formData.password ? { password: formData.password } : {}) }
                : formData

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao processar solicitação')
            }

            setSuccess(editingUser ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!')
            setFormData({ name: '', email: '', password: '', role: 'EDITOR' })
            setShowCreateForm(false)
            setEditingUser(null)
            fetchUsers()
        } catch (error: any) {
            setError(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        setError('')
        setSuccess('')
        setSubmitting(true)

        try {
            const response = await fetch(`/api/users?id=${id}`, {
                method: 'DELETE',
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao excluir usuário')
            }

            setSuccess('Usuário excluído com sucesso!')
            setShowDeleteConfirm(null)
            fetchUsers()
        } catch (error: any) {
            setError(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    const startEdit = (user: User) => {
        setEditingUser(user)
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
        })
        setShowCreateForm(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-purple-100 text-purple-800 border-purple-200'
            case 'EDITOR':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'VIEWER':
                return 'bg-gray-100 text-gray-800 border-gray-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-[#0F758D]">Usuários</h1>
                    <p className="text-gray-600 mt-1">Gerencie os usuários do sistema</p>
                </div>
                <button
                    onClick={() => {
                        if (showCreateForm) {
                            setShowCreateForm(false)
                            setEditingUser(null)
                            setFormData({ name: '', email: '', password: '', role: 'EDITOR' })
                        } else {
                            setShowCreateForm(true)
                        }
                    }}
                    className="px-6 py-3 bg-[#0F758D] text-white rounded-xl font-bold hover:bg-[#0d6378] transition-colors"
                >
                    {showCreateForm ? 'Cancelar' : '+ Novo Usuário'}
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex justify-between items-center">
                    <span>{success}</span>
                    <button onClick={() => setSuccess('')} className="text-green-700 hover:text-green-900">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            )}

            {showCreateForm && (
                <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-[#0F758D] mb-4">
                        {editingUser ? `Editar Usuário: ${editingUser.name}` : 'Criar Novo Usuário'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F758D] focus:border-transparent transition-all"
                                    placeholder="Nome completo"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    disabled={!!editingUser}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F758D] focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500"
                                    placeholder="email@exemplo.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    {editingUser ? 'Nova Senha (opcional)' : 'Senha'}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required={!editingUser}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F758D] focus:border-transparent transition-all"
                                    placeholder={editingUser ? 'Deixe em branco para manter' : 'Mínimo 8 caracteres'}
                                />
                                <PasswordStrengthIndicator password={formData.password} />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Função
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F758D] focus:border-transparent transition-all"
                                >
                                    <option value="VIEWER">Visualizador</option>
                                    <option value="EDITOR">Editor</option>
                                    <option value="ADMIN">Administrador</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-6 py-3 bg-[#0F758D] text-white rounded-xl font-bold hover:bg-[#0d6378] transition-colors disabled:opacity-50"
                            >
                                {submitting ? 'Processando...' : editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCreateForm(false)
                                    setEditingUser(null)
                                    setFormData({ name: '', email: '', password: '', role: 'EDITOR' })
                                }}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                                    Nome / Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                                    Função
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                                    Criado em
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-black text-gray-600 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-bold text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEdit(user)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(user.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Excluir"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">group_off</span>
                        <p className="text-gray-500 font-medium">Nenhum usuário encontrado</p>
                    </div>
                )}
            </div>

            {/* Modal de Confirmação de Exclusão */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full border border-gray-100 animate-in fade-in zoom-in duration-200">
                        <div className="size-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 text-center mb-2">Excluir Usuário?</h3>
                        <p className="text-gray-500 text-center mb-8 font-medium">
                            Esta ação não pode ser desfeita. O usuário perderá o acesso imediatamente.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                disabled={submitting}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {submitting ? 'Excluindo...' : 'Sim, Excluir'}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
