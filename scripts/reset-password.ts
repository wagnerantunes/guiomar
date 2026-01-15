import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: 'wagnerantunes84@gmail.com' }
    });

    if (!user) {
      console.error('❌ Usuário não encontrado!');
      process.exit(1);
    }

    console.log('✅ Usuário encontrado:', user.email);

    // Hash new password
    const newPassword = 'MaxGGX5A27@Renova!984#';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    console.log('✅ Senha atualizada com sucesso!');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: wagnerantunes84@gmail.com');
    console.log('🔑 Nova Senha: MaxGGX5A27@Renova!984#');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('Você pode fazer login em: http://localhost:3020/login');
    
  } catch (error) {
    console.error('❌ Erro ao redefinir senha:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
