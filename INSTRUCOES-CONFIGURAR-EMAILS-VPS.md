# 🔧 Instruções para Configurar Emails na VPS

## ❌ Problema Identificado

As configurações de email **não estão salvas no banco de dados da VPS**!

```
Email TO: null
Email BCC: null
Resend API Key: ❌ NÃO CONFIGURADA
```

Por isso os emails não estão sendo enviados, mesmo que os leads estejam sendo criados corretamente.

---

## ✅ Solução: Configurar via Painel Admin

### Passo 1: Acessar o Painel Admin

1. Acesse: **https://renovamente-guiomarmelo.com.br/admin**
2. Faça login com suas credenciais

### Passo 2: Ir para Configurações

1. No menu lateral, clique em **"Configurações"** ou **"Settings"**
2. Role até a seção **"Notificações por E-mail"**

### Passo 3: Preencher os Campos

Configure os seguintes campos:

1. **E-mail de Destino (TO):**
   ```
   renova@renovamente-guiomarmelo.com.br
   ```

2. **E-mail em Cópia Oculta (BCC):**
   ```
   wagnerantunes84@gmail.com
   ```

3. **Resend API Key:**
   - Acesse: https://resend.com/api-keys
   - Copie sua API Key
   - Cole no campo "Resend API Key"

### Passo 4: Salvar

1. Clique em **"Salvar Alterações"**
2. Aguarde a confirmação de sucesso

---

## 🧪 Passo 5: Testar

Após salvar as configurações:

1. Acesse: **https://renovamente-guiomarmelo.com.br**
2. Preencha o formulário Hero ou de Contato
3. Verifique se os emails chegaram em:
   - `renova@renovamente-guiomarmelo.com.br`
   - `wagnerantunes84@gmail.com`

---

## 🔍 Verificar se Funcionou

Execute este comando na VPS para confirmar que as configurações foram salvas:

```bash
ssh root@wagnerantunes.com.br "cd /var/www/renovamente-cms && npx tsx scripts/check-vps-emails.ts"
```

Você deve ver:
```
Email TO: renova@renovamente-guiomarmelo.com.br
Email BCC: wagnerantunes84@gmail.com
Resend API Key: ✅ Configurada
```

---

## 📝 Observações

- As configurações são salvas no banco de dados PostgreSQL
- Cada site pode ter configurações diferentes
- A Resend API Key é necessária para enviar emails
- O domínio `contato@renovamente-guiomarmelo.com.br` já está verificado no Resend

---

**Após configurar, teste novamente e me avise se funcionou!** 📧
