# 🚀 Deploy Manual na VPS - RenovaMente CMS

## Opção 1: Deploy Automático (Recomendado)

```bash
# Execute este comando localmente:
bash deploy.sh
```

## Opção 2: Deploy Manual Passo a Passo

### 1. Conectar ao VPS

```bash
ssh root@72.60.139.82
# Senha: ServidorMax@2021
```

### 2. Navegar ou criar diretório do projeto

```bash
cd /var/www/renovamente-cms || mkdir -p /var/www/renovamente-cms && cd /var/www/renovamente-cms
```

### 3. Clonar/Atualizar código

```bash
# Se é a primeira vez:
git init
git remote add origin https://github.com/wagnerantunes/guiomar.git

# Atualizar código:
git fetch origin main
git reset --hard origin/main
```

### 4. Configurar .env de produção

```bash
nano .env
```

Cole:

```env
DATABASE_URL="postgresql://renovamente:SenhaForte123!@localhost:5432/renovamente_cms?schema=public"
NEXTAUTH_URL="https://renovamente-guiomarmelo.com.br"
NEXTAUTH_SECRET="GERE_UMA_CHAVE_SEGURA_AQUI"
NEXT_PUBLIC_APP_URL="https://renovamente-guiomarmelo.com.br"
```

### 5. Instalar dependências

```bash
npm install
```

### 6. Configurar banco de dados

```bash
# Gerar Prisma Client
npx prisma generate

# Sincronizar schema
npx prisma db push

# Popular dados iniciais (apenas primeira vez)
npm run db:seed
```

### 7. Build da aplicação

```bash
npm run build
```

### 8. Iniciar/Reiniciar com PM2

```bash
# Se é a primeira vez:
pm2 start npm --name "renovamente-cms" -- start

# Se já existe:
pm2 restart renovamente-cms

# Salvar configuração
pm2 save

# Auto-start no boot (apenas primeira vez)
pm2 startup
# Execute o comando que aparecer
```

### 9. Verificar status

```bash
pm2 status
pm2 logs renovamente-cms --lines 50
```

## Opção 3: Deploy via SCP (se git não funcionar)

### 1. Fazer build local

```bash
npm run build
```

### 2. Criar arquivo compactado

```bash
tar -czf renovamente-cms.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=.next \
  .
```

### 3. Enviar para VPS

```bash
scp renovamente-cms.tar.gz root@72.60.139.82:/var/www/
```

### 4. No VPS, extrair e configurar

```bash
ssh root@72.60.139.82
cd /var/www
tar -xzf renovamente-cms.tar.gz -C renovamente-cms
cd renovamente-cms
npm install
npx prisma generate
npm run build
pm2 restart renovamente-cms
```

## Verificação Final

### Testar aplicação

```bash
curl http://localhost:3001
```

### Verificar logs

```bash
pm2 logs renovamente-cms
```

### Acessar site

```
https://renovamente-guiomarmelo.com.br
```

## Troubleshooting

### Erro de porta ocupada

```bash
pm2 delete renovamente-cms
pm2 start npm --name "renovamente-cms" -- start
```

### Erro de banco de dados

```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

### Erro de build

```bash
rm -rf .next node_modules
npm install
npm run build
```

### Limpar cache do PM2

```bash
pm2 flush
pm2 restart renovamente-cms
```

## Comandos Úteis

```bash
# Ver logs em tempo real
pm2 logs renovamente-cms --lines 100

# Reiniciar aplicação
pm2 restart renovamente-cms

# Parar aplicação
pm2 stop renovamente-cms

# Ver status
pm2 status

# Ver uso de recursos
pm2 monit
```

## Credenciais Admin

```
Email: admin@renovamente.com
Senha: MaxGGX5A27@Renova!984#
```

Login: https://renovamente-guiomarmelo.com.br/login
