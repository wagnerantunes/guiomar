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
        <div className="min-h-screen flex items-center justify-center bg-[#09090b] p-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#13ec5b]/5 blur-[120px] rounded-full opacity-30 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#13ec5b]/5 blur-[100px] rounded-full opacity-20" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-[#09090b]/40 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-black/50 p-10 md:p-14 border border-white/5 relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#13ec5b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem] pointer-events-none" />

                    <div className="text-center mb-10">
                        <div className="size-16 rounded-2xl bg-[#13ec5b]/10 text-[#13ec5b] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(19,236,91,0.2)] border border-[#13ec5b]/20">
                            <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                        </div>
                        <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-[0.2em]">RenovaMente CMS</h1>
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Painel Administrativo Seguro</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">
                                Email Corporativo
                            </label>
                            <div className="relative group/input">
                                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-[#13ec5b] transition-colors">mail</span>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-14 pr-5 py-4 bg-[#09090b]/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-[#13ec5b]/50 focus:border-[#13ec5b]/50 transition-all outline-none text-white font-medium placeholder:text-gray-600 shadow-inner"
                                    placeholder="admin@renovamente.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">
                                Senha Mestra
                            </label>
                            <div className="relative group/input">
                                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-[#13ec5b] transition-colors">lock</span>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-14 pr-5 py-4 bg-[#09090b]/50 border border-white/5 rounded-2xl focus:ring-2 focus:ring-[#13ec5b]/50 focus:border-[#13ec5b]/50 transition-all outline-none text-white font-medium placeholder:text-gray-600 shadow-inner"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#13ec5b] text-[#0d1b12] py-5 px-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#13ec5b]/20 disabled:opacity-50 disabled:cursor-not-allowed group/btn relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {loading ? 'Autenticando...' : 'Acessar Sistema'}
                                {!loading && <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>}
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 pointer-events-none" />
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                            Acesso Restrito &copy; {new Date().getFullYear()} RenovaMente
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
