# 🚀 Próximos Passos - RenovaMente CMS

## Para Testar Localmente

### 1. Configure o PostgreSQL
```bash
# Crie o banco de dados
createdb renovamente_cms

# Ou via psql:
psql -U postgres
CREATE DATABASE renovamente_cms;
\q
```

### 2. Configure o arquivo .env
Crie um arquivo `.env` na raiz do projeto com:
```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/renovamente_cms?schema=public"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="qualquer-string-secreta-aqui"
NEXT_PUBLIC_APP_URL="http://localhost:3001"
```

**Importante**: Substitua `seu_usuario` e `sua_senha` pelas suas credenciais do PostgreSQL.

### 3. Execute os comandos
```bash
# Sincronizar schema com banco
npm run db:push

# Popular com dados iniciais
npm run db:seed

# Iniciar servidor de desenvolvimento
npm run dev
```

### 4. Acesse o sistema
- **Homepage**: http://localhost:3001
- **Blog**: http://localhost:3001/blog
- **Login Admin**: http://localhost:3001/login
  - Email: `admin@renovamente.com`
  - Senha: `admin123`

---

## Para Deploy no VPS Hostinger

### 1. Conecte ao VPS
```bash
ssh root@72.60.139.82
# Senha: ServidorMax@2021
```

### 2. Instale as dependências necessárias
```bash
# Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# PM2
sudo npm install -g pm2

# Nginx (se ainda não instalado)
sudo apt-get install nginx
```

### 3. Configure o PostgreSQL
```bash
sudo -u postgres psql
CREATE DATABASE renovamente_cms;
CREATE USER renovamente WITH PASSWORD 'SenhaForte123!';
GRANT ALL PRIVILEGES ON DATABASE renovamente_cms TO renovamente;
\q
```

### 4. Clone o projeto
```bash
cd /var/www
git init renovamente-cms
cd renovamente-cms

# Configure o repositório Git
git remote add origin <seu-repositorio-github>
git pull origin main

# Ou copie os arquivos via SCP/FTP
```

### 5. Configure o .env de produção
```bash
nano .env
```

Cole:
```env
DATABASE_URL="postgresql://renovamente:SenhaForte123!@localhost:5432/renovamente_cms?schema=public"
NEXTAUTH_URL="https://renovamente-guiomarmelo.com.br"
NEXTAUTH_SECRET="gere-uma-chave-muito-segura-aqui-min-32-chars"
NEXT_PUBLIC_APP_URL="https://renovamente-guiomarmelo.com.br"
```

### 6. Instale e configure
```bash
# Instalar dependências
npm install

# Sincronizar banco
npm run db:push

# Popular dados iniciais
npm run db:seed

# Build produção
npm run build
```

### 7. Configure o PM2
```bash
# Iniciar aplicação
pm2 start npm --name "renovamente-cms" -- start

# Salvar configuração
pm2 save

# Auto-start no boot
pm2 startup
# Execute o comando que aparecer
```

### 8. Configure o Nginx
```bash
sudo nano /etc/nginx/sites-available/renovamente
```

Cole:
```nginx
server {
    listen 80;
    server_name renovamente-guiomarmelo.com.br;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ative o site:
```bash
sudo ln -s /etc/nginx/sites-available/renovamente /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 9. Configure SSL (HTTPS)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d renovamente-guiomarmelo.com.br
```

### 10. Verifique
```bash
# Status do PM2
pm2 status

# Logs
pm2 logs renovamente-cms

# Acesse o site
curl http://renovamente-guiomarmelo.com.br
```

---

## Comandos Úteis

### Desenvolvimento Local
```bash
npm run dev          # Servidor de desenvolvimento
npm run db:studio    # Interface visual do banco (Prisma Studio)
npm run db:push      # Sincronizar schema
npm run db:seed      # Popular dados
```

### Produção (VPS)
```bash
pm2 status                    # Ver status
pm2 logs renovamente-cms      # Ver logs
pm2 restart renovamente-cms   # Reiniciar
pm2 stop renovamente-cms      # Parar
pm2 delete renovamente-cms    # Remover

# Deploy automático
bash deploy.sh
```

### PostgreSQL
```bash
# Conectar ao banco
psql -U renovamente -d renovamente_cms

# Backup
pg_dump renovamente_cms > backup.sql

# Restore
psql renovamente_cms < backup.sql
```

---

## Troubleshooting

### Erro de conexão com banco
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Reiniciar PostgreSQL
sudo systemctl restart postgresql

# Verificar credenciais no .env
```

### Aplicação não inicia
```bash
# Ver logs detalhados
pm2 logs renovamente-cms --lines 100

# Verificar porta 3001
sudo netstat -tulpn | grep 3001

# Rebuild
npm run build
pm2 restart renovamente-cms
```

### Erro 502 Bad Gateway (Nginx)
```bash
# Verificar se app está rodando
pm2 status

# Verificar configuração Nginx
sudo nginx -t

# Ver logs Nginx
sudo tail -f /var/log/nginx/error.log
```

---

## Replicar para Novo Cliente

### 1. Criar novo site no banco
```sql
INSERT INTO sites (id, name, domain, description, created_at, updated_at)
VALUES (
  'novo_id_unico',
  'Nome do Cliente',
  'cliente.com.br',
  'Descrição do site',
  NOW(),
  NOW()
);
```

### 2. Associar usuário ao site
```sql
INSERT INTO site_users (id, site_id, user_id, role, created_at)
VALUES (
  'novo_id_unico',
  'id_do_site',
  'id_do_usuario',
  'ADMIN',
  NOW()
);
```

### 3. Configurar domínio no Nginx
Criar novo arquivo de configuração para o domínio do cliente.

### 4. Pronto!
O sistema automaticamente isolará os dados de cada cliente.

---

## 📞 Suporte

Se encontrar problemas, verifique:
1. Logs do PM2: `pm2 logs`
2. Logs do Nginx: `/var/log/nginx/error.log`
3. Conexão com banco de dados
4. Variáveis de ambiente (.env)
