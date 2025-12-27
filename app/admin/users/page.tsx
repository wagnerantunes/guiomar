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
            <div className="p-8 space-y-8">
                <div className="flex justify-between">
                    <div className="h-10 w-48 bg-white/5 rounded-xl animate-pulse" />
                    <div className="h-10 w-32 bg-white/5 rounded-xl animate-pulse" />
                </div>
                <div className="h-96 bg-white/5 rounded-[2.5rem] animate-pulse" />
            </div>
        )
    }

    return (
        <div className="p-8 md:p-10 space-y-10 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-[0.2em]">Usuários</h1>
                    <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px]">
                        Gerencie permissões e acesso ao sistema.
                    </p>
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
                    className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-lg ${showCreateForm
                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-red-500/10'
                            : 'bg-[#13ec5b] text-[#0d1b12] shadow-[#13ec5b]/20'
                        }`}
                >
                    {showCreateForm ? 'Cancelar' : 'Novo Usuário'}
                </button>
            </div>

            {error && (
                <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex justify-between items-center text-xs font-bold uppercase tracking-widest animate-in slide-in-from-top-2">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="hover:text-red-300 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            )}

            {success && (
                <div className="p-6 bg-[#13ec5b]/10 border border-[#13ec5b]/20 text-[#13ec5b] rounded-2xl flex justify-between items-center text-xs font-bold uppercase tracking-widest animate-in slide-in-from-top-2">
                    <span>{success}</span>
                    <button onClick={() => setSuccess('')} className="hover:text-[#13ec5b]/80 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            )}

            {showCreateForm && (
                <div className="bg-[#09090b]/40 backdrop-blur-xl rounded-[3rem] shadow-2xl p-10 border border-white/5 animate-in slide-in-from-top-4 duration-300">
                    <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                        <span className="size-8 rounded-lg bg-[#13ec5b]/20 flex items-center justify-center text-[#13ec5b]">
                            <span className="material-symbols-outlined text-sm">{editingUser ? 'edit' : 'person_add'}</span>
                        </span>
                        {editingUser ? `Editar: ${editingUser.name}` : 'Criar Novo Usuário'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-[1.5rem] focus:ring-2 focus:ring-[#13ec5b]/50 focus:border-[#13ec5b]/50 transition-all outline-none text-white text-xs font-bold shadow-inner"
                                    placeholder="Ex: Ana Silva"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    Email Corporativo
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    disabled={!!editingUser}
                                    className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-[1.5rem] focus:ring-2 focus:ring-[#13ec5b]/50 focus:border-[#13ec5b]/50 transition-all outline-none text-white text-xs font-bold shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="email@renovamente.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    {editingUser ? 'Alterar Senha (opcional)' : 'Senha de Acesso'}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required={!editingUser}
                                    className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-[1.5rem] focus:ring-2 focus:ring-[#13ec5b]/50 focus:border-[#13ec5b]/50 transition-all outline-none text-white text-xs font-bold shadow-inner"
                                    placeholder={editingUser ? 'Manter senha atual' : '••••••••'}
                                />
                                <PasswordStrengthIndicator password={formData.password} />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    Nível de Acesso
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-[1.5rem] focus:ring-2 focus:ring-[#13ec5b]/50 focus:border-[#13ec5b]/50 transition-all outline-none text-white text-xs font-bold shadow-inner appearance-none cursor-pointer"
                                    >
                                        <option value="VIEWER" className="bg-[#09090b] text-gray-400">Visualizador (Apenas Leitura)</option>
                                        <option value="EDITOR" className="bg-[#09090b] text-white">Editor (Gerencia Conteúdo)</option>
                                        <option value="ADMIN" className="bg-[#09090b] text-[#13ec5b]">Administrador (Acesso Total)</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">expand_more</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-white/5">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-8 py-4 bg-[#13ec5b] text-[#0d1b12] rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] transition-all shadow-xl shadow-[#13ec5b]/20 disabled:opacity-50 active:scale-[0.98]"
                            >
                                {submitting ? 'Processando...' : editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-[#09090b]/40 backdrop-blur-md rounded-[3rem] shadow-sm overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/5">
                            <tr>
                                <th className="px-10 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    Usuário
                                </th>
                                <th className="px-6 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    Função
                                </th>
                                <th className="px-6 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    Data de Criação
                                </th>
                                <th className="px-10 py-6 text-right text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-10 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white font-black text-xs">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm">{user.name}</div>
                                                <div className="text-xs text-gray-500 font-mono mt-0.5">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${user.role === 'ADMIN'
                                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                : user.role === 'EDITOR'
                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 whitespace-nowrap text-xs text-gray-500 font-bold uppercase tracking-wider">
                                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-10 py-6 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEdit(user)}
                                                className="size-10 flex items-center justify-center text-white bg-white/5 hover:bg-[#13ec5b] hover:text-[#0d1b12] rounded-xl transition-all shadow-lg hover:shadow-[#13ec5b]/20"
                                                title="Editar"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(user.id)}
                                                className="size-10 flex items-center justify-center text-gray-400 bg-white/5 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg hover:shadow-red-500/20"
                                                title="Excluir"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="text-center py-24">
                        <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl text-white/20">group_off</span>
                        </div>
                        <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Nenhum usuário encontrado</p>
                    </div>
                )}
            </div>

            {/* Modal de Confirmação de Exclusão */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#09090b] rounded-[2.5rem] shadow-2xl p-10 max-w-sm w-full border border-white/10 animate-in zoom-in-95 duration-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 blur-[50px] rounded-full -mr-16 -mt-16 pointer-events-none" />

                        <div className="size-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mb-6 mx-auto border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                            <span className="material-symbols-outlined text-4xl">warning</span>
                        </div>
                        <h3 className="text-xl font-black text-white text-center mb-2 uppercase tracking-wide">Excluir Usuário?</h3>
                        <p className="text-gray-400 text-center mb-8 font-medium text-xs leading-relaxed px-4">
                            Esta ação é irreversível. O usuário perderá o acesso ao painel imediatamente.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                disabled={submitting}
                                className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                            >
                                {submitting ? 'Excluindo...' : 'Confirmar Exclusão'}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="w-full py-4 bg-white/5 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95"
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
