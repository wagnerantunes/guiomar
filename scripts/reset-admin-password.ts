import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'admin@renovamente.com' }
    });

    if (!user) {
      console.error('❌ Usuário não encontrado!');
      process.exit(1);
    }

    const newPassword = 'MaxGGX5A27@Renova!984#';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    console.log('✅ Senha atualizada com sucesso!');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: admin@renovamente.com');
    console.log('🔑 Nova Senha: MaxGGX5A27@Renova!984#');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🌐 Login: http://localhost:3020/login');
    
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
