# EliteContent - Plataforma de Conteúdo Premium

## 📋 Sobre o Projeto
Plataforma completa para conteúdo adulto premium com sistema de assinaturas via Stripe.

## 🚀 Funcionalidades

### Para Usuários
- ✅ Verificação de idade obrigatória
- ✅ Login com e-mail, Google ou X (Twitter)
- ✅ Assinaturas mensais, trimestrais e anuais
- ✅ Acesso a modelos e conteúdo exclusivo
- ✅ Sistema de notificações

### Para Criadores
- ✅ Sistema de cadastro com verificação
- ✅ Calculadora de ganhos em tempo real
- ✅ Dashboard administrativo
- ✅ Pagamentos via PIX/Stripe
- ✅ 70% de comissão sobre assinaturas

### Para Administradores
- ✅ Painel de controle completo
- ✅ Gestão de usuários e criadores
- ✅ Relatórios financeiros
- ✅ Moderação de conteúdo

## 💰 Modelo de Negócio

### Fluxo de Pagamentos:
1. **Usuário** paga R$29,90/mês → **Stripe**
2. **Stripe** processa e transfere para **EliteContent**
3. **EliteContent** retém 30% para operações
4. **EliteContent** distribui 70% para **Criadores** proporcionalmente

### Distribuição Mensal (exemplo com 100 assinantes):
- Receita total: R$ 2.990,00
- Plataforma (30%): R$ 897,00
- Criadores (70%): R$ 2.093,00
- Por criador (10 criadores): ~R$ 209,30 cada

## 🛠️ Configuração

### 1. Firebase Authentication
1. Acesse https://console.firebase.google.com
2. Crie um novo projeto
3. Ative Authentication
4. Configure provedores: Email/Password, Google, Twitter
5. Copie as credenciais para o arquivo `.env`

### 2. Stripe Configuration
1. Acesse https://dashboard.stripe.com
2. Crie suas páginas de checkout:
   - Mensal: https://buy.stripe.com/7sYbITfD4aLV7ur9TV4c80z
   - Trimestral: https://buy.stripe.com/00wdR19eGbPZ5mj1np4c80A
   - Anual: https://buy.stripe.com/28E00b76y8DN7ur4zB4c80B
3. Configure webhooks para notificações

### 3. Google Analytics
1. Acesse https://analytics.google.com
2. Crie uma nova propriedade
3. Obtenha o Measurement ID (G-XXXXXXXXXX)
4. Substitua no arquivo `index.html`

## 📁 Estrutura de Arquivos