'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Email ou senha inválidos')
            } else {
                router.push('/admin')
                router.refresh()
            }
        } catch (error) {
            setError('Erro ao fazer login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F758D] via-[#0d6378] to-[#0a4f5f] p-4">
            <div className="w-full max-w-md">
                <div className="bg-[#FDF5E6] rounded-[2.5rem] shadow-2xl p-10 border border-[#0F758D]/10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-[#0F758D] mb-2 tracking-tight">RenovaMente CMS</h1>
                        <p className="text-[#0F758D]/70 font-medium text-sm">Faça login para acessar o painel</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-xs font-black text-[#0F758D]/70 uppercase tracking-widest mb-2 ml-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-5 py-3.5 border-2 border-[#0F758D]/20 bg-white rounded-xl focus:ring-4 focus:ring-[#0F758D]/20 focus:border-[#0F758D] transition-all outline-none text-[#0F758D] font-medium"
                                placeholder="seu@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-black text-[#0F758D]/70 uppercase tracking-widest mb-2 ml-1">
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-5 py-3.5 border-2 border-[#0F758D]/20 bg-white rounded-xl focus:ring-4 focus:ring-[#0F758D]/20 focus:border-[#0F758D] transition-all outline-none text-[#0F758D] font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0F758D] text-white py-4 px-6 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#0d6378] focus:outline-none focus:ring-4 focus:ring-[#0F758D]/30 transition-all shadow-lg shadow-[#0F758D]/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-xs text-[#0F758D]/60">
                        <p className="font-bold uppercase tracking-wider">Credenciais padrão:</p>
                        <p className="font-mono text-[10px] mt-2 bg-white/50 py-2 px-4 rounded-lg border border-[#0F758D]/10">admin@renovamente.com / admin123</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
