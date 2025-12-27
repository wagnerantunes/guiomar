import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

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

        // Check if user is admin
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { role: true },
        })

        if (currentUser?.role !== 'ADMIN') {
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

        // Check if user is admin
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { role: true },
        })

        if (currentUser?.role !== 'ADMIN') {
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

        // Check if user is admin
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { id: true, role: true },
        })

        if (currentUser?.role !== 'ADMIN') {
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

        // Check if user is admin
        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { id: true, role: true },
        })

        if (currentUser?.role !== 'ADMIN') {
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
