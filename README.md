# RenovaMente CMS

Sistema de gerenciamento de conteúdo (CMS) completo estilo WordPress, desenvolvido com Next.js 14, TypeScript, Prisma e PostgreSQL.

## 🚀 Características

- ✅ **Painel Administrativo Completo** - Dashboard, gerenciamento de posts, categorias e mídia
- ✅ **Editor Rico (TipTap)** - Editor WYSIWYG com formatação avançada
- ✅ **Multi-tenant** - Suporte para múltiplos sites/clientes
- ✅ **Autenticação Segura** - NextAuth.js com credenciais
- ✅ **Blog Dinâmico** - Sistema completo de blog com categorias e tags
- ✅ **SEO Otimizado** - Meta tags e estrutura otimizada para SEO
- ✅ **Responsivo** - Design adaptável para todos os dispositivos

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 14+ instalado e rodando
- npm ou yarn

## 🛠️ Instalação Local

### 1. Instale as dependências
```bash
npm install
```

### 2. Configure o banco de dados

Crie um banco de dados PostgreSQL:
```sql
CREATE DATABASE renovamente_cms;
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/renovamente_cms?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Importante**: Substitua `seu_usuario` e `sua_senha` pelas credenciais do seu PostgreSQL.

### 4. Execute as migrações do banco de dados
```bash
npm run db:push
```

### 5. Popule o banco com dados iniciais
```bash
npm run db:seed
```

Isso criará:
- Usuário admin: `admin@renovamente.com` / `admin123`
- Site RenovaMente
- Categorias de exemplo
- Post de exemplo

### 6. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

Acesse: http://localhost:3000

## 🔐 Acesso ao Painel Admin

- URL: http://localhost:3000/login
- Email: `admin@renovamente.com`
- Senha: `admin123`

## 🚀 Deploy para VPS (Hostinger)

### 1. No seu VPS, instale as dependências:
```bash
# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Instalar PM2
sudo npm install -g pm2
```

### 2. Configure o PostgreSQL:
```bash
sudo -u postgres psql
CREATE DATABASE renovamente_cms;
CREATE USER renovamente WITH PASSWORD 'sua_senha_forte';
GRANT ALL PRIVILEGES ON DATABASE renovamente_cms TO renovamente;
\q
```

### 3. Clone e configure o projeto:
```bash
cd /var/www
git clone <repository-url> renovamente-cms
cd renovamente-cms
npm install
```

### 4. Configure o `.env` para produção:
```env
DATABASE_URL="postgresql://renovamente:sua_senha_forte@localhost:5432/renovamente_cms?schema=public"
NEXTAUTH_URL="https://renovamente-guiomarmelo.com.br"
NEXTAUTH_SECRET="gere-uma-chave-secreta-forte-aqui"
NEXT_PUBLIC_APP_URL="https://renovamente-guiomarmelo.com.br"
```

### 5. Execute as migrações e build:
```bash
npm run db:push
npm run db:seed
npm run build
```

### 6. Inicie com PM2:
```bash
pm2 start npm --name "renovamente-cms" -- start
pm2 save
pm2 startup
```

### 7. Configure o Nginx:
```nginx
server {
    listen 80;
    server_name renovamente-guiomarmelo.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 8. Configure SSL com Let's Encrypt:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d renovamente-guiomarmelo.com.br
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Inicia servidor de produção
- `npm run db:generate` - Gera Prisma Client
- `npm run db:push` - Sincroniza schema com banco
- `npm run db:seed` - Popula banco com dados iniciais
- `npm run db:studio` - Abre Prisma Studio (GUI do banco)
