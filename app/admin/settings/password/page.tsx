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
        <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-4xl mx-auto space-y-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-foreground uppercase tracking-[0.2em]">
                            Segurança da Conta
                        </h1>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-[0.2em] mt-1">
                            Gerencie sua senha e proteja seu acesso ao painel.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/admin')}
                        className="hidden md:flex items-center gap-2 px-6 py-3 text-[10px] font-black border border-border rounded-xl hover:bg-muted/5 transition-all uppercase tracking-widest bg-card"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Voltar ao Início
                    </button>
                </div>

                {error && (
                    <div className="p-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl flex items-center gap-4 animate-in zoom-in-95">
                        <span className="material-symbols-outlined">error</span>
                        <p className="text-xs font-bold uppercase tracking-wide">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="p-6 bg-primary/10 border border-primary/20 text-primary rounded-2xl flex items-center gap-4 animate-in zoom-in-95">
                        <span className="material-symbols-outlined">check_circle</span>
                        <p className="text-xs font-bold uppercase tracking-wide">{success}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8">
                        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm p-10 md:p-14">
                            <div className="flex items-center gap-4 border-b border-border pb-8 mb-10">
                                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined">lock_reset</span>
                                </div>
                                <h3 className="text-[11px] font-black text-muted uppercase tracking-[0.2em]">Redefinir Senha</h3>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">
                                        Senha Atual
                                    </label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted/30 text-lg">lock_open</span>
                                        <input
                                            type="password"
                                            value={formData.currentPassword}
                                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                            required
                                            className="w-full bg-muted/5 border border-border rounded-2xl pl-12 pr-6 py-4 text-xs font-black focus:ring-4 focus:ring-primary/10 outline-none transition-all text-foreground"
                                            placeholder="Confirme sua identidade..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">
                                        Nova Senha
                                    </label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted/30 text-lg">vpn_key</span>
                                        <input
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                            required
                                            className="w-full bg-muted/5 border border-border rounded-2xl pl-12 pr-6 py-4 text-xs font-black focus:ring-4 focus:ring-primary/10 outline-none transition-all text-foreground"
                                            placeholder="Mínimo 8 caracteres..."
                                        />
                                    </div>
                                    <PasswordStrengthIndicator password={formData.newPassword} />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">
                                        Confirmar Nova Senha
                                    </label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted/30 text-lg">verified</span>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            required
                                            className={`w-full bg-muted/5 border rounded-2xl pl-12 pr-6 py-4 text-xs font-black focus:ring-4 outline-none transition-all text-foreground ${formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                                                    ? "border-destructive focus:ring-destructive/10"
                                                    : "border-border focus:ring-primary/10"
                                                }`}
                                            placeholder="Repita a nova senha..."
                                        />
                                    </div>
                                    {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                                        <p className="mt-2 text-[10px] font-bold text-destructive uppercase tracking-wide flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">close</span>
                                            As senhas não coincidem
                                        </p>
                                    )}
                                </div>

                                <div className="pt-6 flex flex-col md:flex-row gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-10 py-4 text-[10px] font-black bg-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50"
                                    >
                                        {loading ? 'Processando...' : 'Salvar Nova Senha'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.push('/admin')}
                                        className="px-8 py-4 text-[10px] font-black text-muted border border-border rounded-2xl hover:bg-muted/5 transition-all uppercase tracking-widest"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm p-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-lg">security</span>
                                </div>
                                <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Diretrizes</h4>
                            </div>

                            <ul className="space-y-6">
                                {[
                                    { icon: 'format_size', text: 'Mínimo de 8 caracteres' },
                                    { icon: 'font_download', text: 'Use letras e números' },
                                    { icon: 'history', text: 'Diferente da anterior' },
                                    { icon: 'shield', text: 'Evite dados pessoais' }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 group">
                                        <span className="material-symbols-outlined text-muted/30 group-hover:text-primary transition-colors mt-0.5">
                                            {item.icon}
                                        </span>
                                        <span className="text-[11px] font-bold text-muted uppercase tracking-wider leading-relaxed">
                                            {item.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-primary p-10 rounded-[2.5rem] text-primary-foreground shadow-2xl shadow-primary/20 relative overflow-hidden group">
                            <div className="relative z-10">
                                <span className="material-symbols-outlined text-4xl mb-4 text-primary-foreground/40 group-hover:scale-110 transition-transform duration-500">verified_user</span>
                                <h4 className="text-sm font-black uppercase tracking-widest mb-2">Conta Segura</h4>
                                <p className="text-[10px] font-bold text-primary-foreground/60 leading-relaxed uppercase tracking-wider">
                                    Senhas fortes e atualizações periódicas garantem a integridade dos seus dados.
                                </p>
                            </div>
                            <div className="absolute -right-10 -bottom-10 size-40 bg-white/10 rounded-full blur-3xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
