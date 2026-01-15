import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { Resend } from 'resend'

// Validation schema for user creation
const createUserSchema = z.object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string()
        .min(8, 'Senha deve ter no mínimo 8 caracteres')
        .regex(/[A-Za-z]/, 'Senha deve conter letras')
        .regex(/[0-9]/, 'Senha deve conter números'),
    role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']),
})

// Validation schema for user update
const updateUserSchema = z.object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
    role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).optional(),
    password: z.string()
        .min(8, 'Senha deve ter no mínimo 8 caracteres')
        .regex(/[A-Za-z]/, 'Senha deve conter letras')
        .regex(/[0-9]/, 'Senha deve conter números')
        .optional(),
})

// GET - List all users (admin only)
export async function GET(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        // Check if user is admin or super admin
        const isSuperAdmin = session.user.email === 'wagnerantunes84@gmail.com' || session.user.email === 'maycon.santos.ms@gmail.com'

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { role: true },
        })

        if (!isSuperAdmin && currentUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
        }

        // Get all users
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json(
            { error: 'Erro ao buscar usuários' },
            { status: 500 }
        )
    }
}

// POST - Create new user (admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        // Check if user is admin or super admin
        const isSuperAdmin = session.user.email === 'wagnerantunes84@gmail.com' || session.user.email === 'maycon.santos.ms@gmail.com'

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { role: true },
        })

        if (!isSuperAdmin && currentUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
        }

        const body = await request.json()

        // Validate input
        const validationResult = createUserSchema.safeParse(body)
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            )
        }

        const { name, email, password, role } = validationResult.data

        // RESTRICTION: Only wagnerantunes84@gmail.com can create an ADMIN user
        if (role === 'ADMIN' && session.user.email !== 'wagnerantunes84@gmail.com') {
            return NextResponse.json(
                { error: 'Apenas Wagner Antunes pode autorizar novos administradores.' },
                { status: 403 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Usuário com este email já existe' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        })

        // EMAIL INVITATION SYSTEM
        try {
            const site = await prisma.site.findFirst({
                where: {
                    OR: [
                        { domain: "renovamente-guiomarmelo.com.br" },
                        { subdomain: "renovamente" }
                    ]
                },
                select: { resendApiKey: true }
            })

            if (site?.resendApiKey) {
                const resend = new Resend(site.resendApiKey)
                const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://renovamente-guiomarmelo.com.br'}/login`

                await resend.emails.send({
                    from: 'RenovaMente CMS <onboarding@resend.dev>',
                    to: [email],
                    subject: '🎉 Bem-vindo ao Painel RenovaMente!',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                            <h2 style="color: #0F758D;">Olá, ${name}!</h2>
                            <p>Sua conta no CMS RenovaMente foi criada com sucesso pelo administrador.</p>
                            
                            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
                                <h3 style="margin-top: 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Dados de Acesso:</h3>
                                <p style="margin: 10px 0;"><strong>Link de Acesso:</strong> <a href="${loginUrl}" style="color: #0F758D;">Acessar Painel</a></p>
                                <p style="margin: 10px 0;"><strong>E-mail:</strong> ${email}</p>
                                <p style="margin: 10px 0;"><strong>Senha Temporária:</strong> <code style="background: #eee; padding: 2px 5px; border-radius: 4px;">${password}</code></p>
                            </div>
                            
                            <p style="color: #666; font-size: 14px; line-height: 1.6;">
                                <strong>Importante:</strong> Recomendamos que você altere sua senha logo no primeiro acesso através da seção "Alterar Senha" no menu lateral do painel.
                            </p>
                            
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                            
                            <p style="color: #999; font-size: 12px; text-align: center;">
                                Este é um e-mail automático enviado pelo sistema RenovaMente CMS.
                            </p>
                        </div>
                    `
                })
            }
        } catch (emailError) {
            console.error('Error sending invitation email:', emailError)
            // Still return the user even if email fails
        }

        return NextResponse.json(newUser, { status: 201 })
    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json(
            { error: 'Erro ao criar usuário' },
            { status: 500 }
        )
    }
}

// PATCH - Update user (admin only)
export async function PATCH(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        // Check if user is admin or super admin
        const isSuperAdmin = session.user.email === 'wagnerantunes84@gmail.com' || session.user.email === 'maycon.santos.ms@gmail.com'

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { id: true, role: true },
        })

        if (!isSuperAdmin && currentUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
        }

        const body = await request.json()
        const { id, ...updateData } = body

        if (!id) {
            return NextResponse.json({ error: 'ID do usuário é obrigatório' }, { status: 400 })
        }

        // Validate input
        const validationResult = updateUserSchema.safeParse(updateData)
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.issues[0].message },
                { status: 400 }
            )
        }

        // Prevent self-demotion
        if (id === currentUser.id && updateData.role && updateData.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Você não pode alterar sua própria função administrativa' },
                { status: 400 }
            )
        }

        const data: any = { ...validationResult.data }

        // RESTRICTION: Only wagnerantunes84@gmail.com can promote someone to ADMIN
        if (data.role === 'ADMIN' && session.user.email !== 'wagnerantunes84@gmail.com') {
            return NextResponse.json(
                { error: 'Apenas Wagner Antunes pode autorizar novos administradores.' },
                { status: 403 }
            )
        }

        // Hash password if provided
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10)
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                updatedAt: true,
            },
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json(
            { error: 'Erro ao atualizar usuário' },
            { status: 500 }
        )
    }
}

// DELETE - Delete user (admin only)
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }

        // Check if user is admin or super admin
        const isSuperAdmin = session.user.email === 'wagnerantunes84@gmail.com' || session.user.email === 'maycon.santos.ms@gmail.com'

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { id: true, role: true },
        })

        if (!isSuperAdmin && currentUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID do usuário é obrigatório' }, { status: 400 })
        }

        // Prevent self-deletion
        if (id === currentUser.id) {
            return NextResponse.json(
                { error: 'Você não pode excluir sua própria conta' },
                { status: 400 }
            )
        }

        await prisma.user.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'Usuário excluído com sucesso' })
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json(
            { error: 'Erro ao excluir usuário' },
            { status: 500 }
        )
    }
}
