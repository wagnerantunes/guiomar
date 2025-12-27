import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validation schema for password change
const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: z.string()
        .min(8, 'Nova senha deve ter no mínimo 8 caracteres')
        .regex(/[A-Za-z]/, 'Nova senha deve conter letras')
        .regex(/[0-9]/, 'Nova senha deve conter números'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
})

// POST - Change password
export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        const body = await request.json()

        // Validate input
        const validationResult = changePasswordSchema.safeParse(body)
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            )
        }

        const { currentPassword, newPassword } = validationResult.data

        // Get current user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
        })

        if (!user || !user.password) {
            return NextResponse.json(
                { error: 'Usuário não encontrado' },
                { status: 404 }
            )
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Senha atual incorreta' },
                { status: 400 }
            )
        }

        // Check if new password is different from current
        const isSamePassword = await bcrypt.compare(newPassword, user.password)
        if (isSamePassword) {
            return NextResponse.json(
                { error: 'A nova senha deve ser diferente da senha atual' },
                { status: 400 }
            )
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update password
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        })

        return NextResponse.json({ message: 'Senha alterada com sucesso' })
    } catch (error) {
        console.error('Error changing password:', error)
        return NextResponse.json(
            { error: 'Erro ao alterar senha' },
            { status: 500 }
        )
    }
}
