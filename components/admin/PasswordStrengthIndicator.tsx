'use client'

import { useState } from 'react'

interface PasswordStrengthIndicatorProps {
    password: string
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
    const getPasswordStrength = (pwd: string) => {
        if (!pwd) return { strength: 0, label: '', color: 'bg-gray-200' }

        let score = 0
        const requirements = {
            length: pwd.length >= 8,
            hasUpper: /[A-Z]/.test(pwd),
            hasLower: /[a-z]/.test(pwd),
            hasNumber: /[0-9]/.test(pwd),
            hasSpecial: /[^A-Za-z0-9]/.test(pwd)
        }

        if (requirements.length) score += 1
        if (requirements.hasUpper && requirements.hasLower) score += 1
        if (requirements.hasNumber) score += 1
        if (requirements.hasSpecial) score += 1
        if (pwd.length >= 12) score += 1

        if (score <= 2) return { strength: 1, label: 'Fraca', color: 'bg-red-500', requirements }
        if (score <= 4) return { strength: 2, label: 'Média', color: 'bg-yellow-500', requirements }
        return { strength: 3, label: 'Forte', color: 'bg-green-500', requirements }
    }

    const { strength, label, color, requirements } = getPasswordStrength(password)

    if (!password) return null

    return (
        <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3].map((step) => (
                        <div
                            key={step}
                            className={`h-full flex-1 transition-all duration-500 ${strength >= step ? color : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider ${strength === 1 ? 'text-red-500' : strength === 2 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                    {label}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <RequirementItem fulfilled={requirements?.length} text="Mínimo 8 caracteres" />
                <RequirementItem fulfilled={requirements?.hasNumber} text="Contém números" />
                <RequirementItem fulfilled={requirements?.hasUpper && requirements?.hasLower} text="Maiúsculas e minúsculas" />
                <RequirementItem fulfilled={requirements?.hasSpecial} text="Símbolo especial" />
            </div>
        </div>
    )
}

function RequirementItem({ fulfilled, text }: { fulfilled: boolean | undefined, text: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`size-4 rounded-full flex items-center justify-center transition-colors ${fulfilled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                <span className="material-symbols-outlined text-[10px] font-bold">
                    {fulfilled ? 'check' : 'close'}
                </span>
            </div>
            <span className={`text-[10px] font-bold transition-colors ${fulfilled ? 'text-green-700' : 'text-gray-400'
                }`}>
                {text}
            </span>
        </div>
    )
}
