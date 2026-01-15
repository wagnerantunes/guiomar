#!/bin/bash

# Deploy Script para VPS Hostinger
# RenovaMente CMS

set -e

echo "🚀 Iniciando deploy do RenovaMente CMS..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configurações
VPS_HOST="72.60.139.82"
VPS_USER="root"
APP_DIR="/var/www/renovamente-cms"
REPO_URL="https://github.com/wagnerantunes/guiomar.git"

echo -e "${YELLOW}📡 Conectando ao VPS...${NC}"

ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
set -e

echo "✅ Conectado ao VPS"

# Verificar se o diretório existe
if [ ! -d "/var/www/renovamente-cms" ]; then
    echo "📁 Criando diretório do projeto..."
    mkdir -p /var/www/renovamente-cms
    cd /var/www/renovamente-cms
    git init
    git remote add origin https://github.com/wagnerantunes/guiomar.git
else
    cd /var/www/renovamente-cms
fi

echo "📥 Baixando código atualizado..."
git fetch origin main
git reset --hard origin/main

echo "📦 Instalando dependências..."
npm install

echo "🗄️  Sincronizando banco de dados..."
npx prisma generate
npx prisma db push

echo "🏗️  Buildando aplicação..."
npm run build

echo "🔄 Reiniciando PM2..."
pm2 restart renovamente-cms || pm2 start npm --name "renovamente-cms" -- start

echo "✅ Deploy concluído!"
pm2 status

ENDSSH

echo -e "${GREEN}✅ Deploy finalizado com sucesso!${NC}"
echo -e "${YELLOW}🌐 Acesse: https://renovamente-guiomarmelo.com.br${NC}"
