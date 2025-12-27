'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PasswordStrengthIndicator from '@/components/admin/PasswordStrengthIndicator'

export default function ChangePasswordPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (formData.newPassword !== formData.confirmPassword) {
            setError('As senhas não coincidem')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/users/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao alterar senha')
            }

            setSuccess('Senha alterada com sucesso!')
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })

            // Redirect to admin after 2 seconds
            setTimeout(() => {
                router.push('/admin')
            }, 2000)
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-[#0F758D]">Alterar Senha</h1>
                    <p className="text-gray-600 mt-1">Atualize sua senha de acesso</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
                        {success}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Senha Atual
                            </label>
                            <input
                                type="password"
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F758D] focus:border-transparent"
                                placeholder="Digite sua senha atual"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Nova Senha
                            </label>
                            <input
                                type="password"
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F758D] focus:border-transparent"
                                placeholder="Mínimo 8 caracteres"
                            />
                            <PasswordStrengthIndicator password={formData.newPassword} />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Confirmar Nova Senha
                            </label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F758D] focus:border-transparent"
                                placeholder="Digite a senha novamente"
                            />
                            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600">As senhas não coincidem</p>
                            )}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-[#0F758D] text-white rounded-xl font-bold hover:bg-[#0d6378] transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Alterando...' : 'Alterar Senha'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/admin')}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <h3 className="font-bold text-blue-900 mb-2">Requisitos de Senha</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Mínimo de 8 caracteres</li>
                        <li>• Deve conter letras</li>
                        <li>• Deve conter números</li>
                        <li>• Diferente da senha atual</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
