# 🔐 Como Fazer Push para GitHub com Personal Access Token

## Problema

O git push está travando porque o GitHub não aceita mais senha via HTTPS. Você precisa usar um Personal Access Token (PAT).

## Solução Rápida

### 1. Criar Personal Access Token no GitHub

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Configure:
   - **Note**: "RenovaMente CMS Deploy"
   - **Expiration**: 90 days (ou No expiration)
   - **Scopes**: Marque apenas `repo` (acesso completo aos repositórios)
4. Clique em **"Generate token"**
5. **COPIE O TOKEN** (você só verá uma vez!)

### 2. Fazer Push com o Token

Execute este comando (substitua `SEU_TOKEN` pelo token copiado):

```bash
git push https://SEU_TOKEN@github.com/wagnerantunes/guiomar.git main
```

**Exemplo:**

```bash
git push https://ghp_abc123XYZ456...@github.com/wagnerantunes/guiomar.git main
```

### 3. Salvar Credenciais (Opcional)

Para não precisar digitar toda vez:

```bash
# Configurar credential helper
git config --global credential.helper store

# Fazer push (vai pedir username e password)
git push origin main
# Username: wagnerantunes
# Password: SEU_TOKEN_AQUI

# Próximos pushes serão automáticos
```

## Alternativa: GitHub CLI

### Instalar GitHub CLI

```bash
# Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

### Autenticar e Fazer Push

```bash
# Login
gh auth login

# Push
git push origin main
```

## Verificar se Funcionou

```bash
git log --oneline -5
git remote -v
```

## Troubleshooting

### Erro: "Support for password authentication was removed"

→ Você está usando senha ao invés de token. Use o PAT criado acima.

### Erro: "Permission denied"

→ Verifique se o token tem permissão `repo`.

### Push muito lento

→ Pode ser problema de rede. Tente:

```bash
git config --global http.postBuffer 524288000
git push origin main
```

## Status Atual

✅ Deploy na VPS: **CONCLUÍDO**
⏳ Push para GitHub: **PENDENTE** (aguardando PAT)

O código já está rodando na VPS em:
https://renovamente-guiomarmelo.com.br

O push para GitHub é apenas para backup/versionamento.
