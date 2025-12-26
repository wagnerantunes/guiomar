#!/bin/bash

echo "🚀 Iniciando deploy do RenovaMente CMS..."

# Pull latest code
echo "📥 Baixando código mais recente..."
git pull origin main

# Install dependencies
echo "📦 Instalando dependências..."
npm install

# Run database migrations and seed
echo "🗄️ Executando migrações e sementes do banco de dados..."
npm run db:push
npm run db:seed

# Build application
echo "🔨 Limpando cache e compilando aplicação..."
rm -rf .next
npm run build

# Restart PM2
echo "🔄 Reiniciando aplicação..."
pm2 restart renovamente-cms

echo "✅ Deploy concluído com sucesso!"
