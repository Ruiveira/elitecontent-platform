// admin.js - Script para o painel administrativo

// Dados simulados para o dashboard
const dashboardData = {
    revenueByMonth: [
        { month: 'Jun', revenue: 98500 },
        { month: 'Jul', revenue: 102300 },
        { month: 'Ago', revenue: 110500 },
        { month: 'Set', revenue: 118200 },
        { month: 'Out', revenue: 124600 },
        { month: 'Nov', revenue: 130800 }
    ],
    userGrowth: [
        { month: 'Jun', users: 42000 },
        { month: 'Jul', users: 45200 },
        { month: 'Ago', users: 47800 },
        { month: 'Set', users: 49500 },
        { month: 'Out', users: 52847 },
        { month: 'Nov', users: 56000 }
    ],
    recentSubscriptions: [
        {
            id: 1001,
            user: 'carlos.oliveira@email.com',
            plan: 'Anual',
            amount: 238.80,
            date: '2023-10-15',
            status: 'active'
        },
        {
            id: 1002,
            user: 'fernanda.lima@email.com',
            plan: 'Trimestral',
            amount: 74.70,
            date: '2023-10-14',
            status: 'active'
        },
        {
            id: 1003,
            user: 'roberto.santos@email.com',
            plan: 'Mensal',
            amount: 29.90,
            date: '2023-10-13',
            status: 'pending'
        },
        {
            id: 1004,
            user: 'amanda.costa@email.com',
            plan: 'Anual',
            amount: 238.80,
            date: '2023-10-12',
            status: 'active'
        },
        {
            id: 1005,
            user: 'paulo.mendes@email.com',
            plan: 'Trimestral',
            amount: 74.70,
            date: '2023-10-11',
            status: 'active'
        }
    ],
    topModels: [
        {
            id: 1,
            name: 'Sophia Rossi',
            earnings: 2847.50,
            subscribers: 1247,
            content: 980
        },
        {
            id: 2,
            name: 'Lena Wolf',
            earnings: 2150.20,
            subscribers: 987,
            content: 731
        },
        {
            id: 3,
            name: 'Mia Chen',
            earnings: 1980.75,
            subscribers: 856,
            content: 499
        },
        {
            id: 4,
            name: 'Jasmine Lee',
            earnings: 1750.30,
            subscribers: 742,
            content: 835
        },
        {
            id: 5,
            name: 'Anya Petrova',
            earnings: 1620.90,
            subscribers: 689,
            content: 597
        }
    ]
};

// Função para formatar valores monetários
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Função para formatar datas
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Função para inicializar o dashboard
function initDashboard() {
    // Atualizar estatísticas
    updateStats();
    
    // Carregar tabela de assinaturas
    loadSubscriptionsTable();
    
    // Configurar eventos
    setupEventListeners();
}

// Função para atualizar estatísticas
function updateStats() {
    // Calcular totais
    const totalRevenue = dashboardData.revenueByMonth.reduce((sum, month) => sum + month.revenue, 0);
    const totalUsers = dashboardData.userGrowth[dashboardData.userGrowth.length - 1].users;
    
    // Atualizar elementos na página
    document.querySelectorAll('.stat-card .stat-number').forEach((element, index) => {
        if (index === 0) {
            // Receita total
            element.textContent = formatCurrency(totalRevenue);
        } else if (index === 1) {
            // Usuários ativos
            element.textContent = totalUsers.toLocaleString('pt-BR');
        }
        // Outros stats já estão pré-definidos no HTML
    });
}

// Função para carregar a tabela de assinaturas
function loadSubscriptionsTable() {
    const tableBody = document.querySelector('.table-container tbody');
    
    if (!tableBody) return;
    
    // Limpar tabela
    tableBody.innerHTML = '';
    
    // Adicionar linhas com dados
    dashboardData.recentSubscriptions.forEach(sub => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${sub.user}</td>
            <td>${sub.plan}</td>
            <td>${formatCurrency(sub.amount)}</td>
            <td>${formatDate(sub.date)}</td>
            <td><span class="status ${sub.status}">${sub.status === 'active' ? 'Ativa' : 'Pendente'}</span></td>
            <td>
                <button class="btn btn-primary" data-subscription-id="${sub.id}">Detalhes</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Adicionar eventos aos botões de detalhes
    document.querySelectorAll('.btn-primary[data-subscription-id]').forEach(button => {
        button.addEventListener('click', function() {
            const subscriptionId = this.getAttribute('data-subscription-id');
            showSubscriptionDetails(subscriptionId);
        });
    });
}

// Função para mostrar detalhes da assinatura
function showSubscriptionDetails(subscriptionId) {
    const subscription = dashboardData.recentSubscriptions.find(sub => sub.id == subscriptionId);
    
    if (subscription) {
        const modalContent = `
            <div class="modal" id="subscriptionModal" style="display: flex;">
                <div class="modal-content" style="max-width: 500px;">
                    <span class="close-modal">&times;</span>
                    <h2>Detalhes da Assinatura #${subscription.id}</h2>
                    <div class="details">
                        <p><strong>Usuário:</strong> ${subscription.user}</p>
                        <p><strong>Plano:</strong> ${subscription.plan}</p>
                        <p><strong>Valor:</strong> ${formatCurrency(subscription.amount)}</p>
                        <p><strong>Data:</strong> ${formatDate(subscription.date)}</p>
                        <p><strong>Status:</strong> <span class="status ${subscription.status}">${subscription.status === 'active' ? 'Ativa' : 'Pendente'}</span></p>
                        <p><strong>ID da Transação:</strong> TXN${subscription.id}${Date.now().toString().slice(-6)}</p>
                    </div>
                    <div class="modal-actions">
                        ${subscription.status === 'pending' ? 
                            '<button class="btn btn-primary" id="approvePayment">Aprovar Pagamento</button>' : 
                            '<button class="btn btn-secondary" id="cancelSubscription">Cancelar Assinatura</button>'}
                        <button class="btn btn-secondary" id="closeModal">Fechar</button>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar modal ao corpo
        document.body.insertAdjacentHTML('beforeend', modalContent);
        
        // Configurar eventos do modal
        const modal = document.getElementById('subscriptionModal');
        const closeModal = modal.querySelector('.close-modal');
        const closeBtn = modal.querySelector('#closeModal');
        
        closeModal.addEventListener('click', () => modal.remove());
        closeBtn.addEventListener('click', () => modal.remove());
        
        // Fechar modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Evento para aprovar pagamento
        const approveBtn = modal.querySelector('#approvePayment');
        if (approveBtn) {
            approveBtn.addEventListener('click', () => {
                alert(`Pagamento da assinatura #${subscription.id} aprovado com sucesso!`);
                modal.remove();
                // Aqui normalmente atualizaríamos o status no backend
            });
        }
        
        // Evento para cancelar assinatura
        const cancelBtn = modal.querySelector('#cancelSubscription');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (confirm(`Tem certeza que deseja cancelar a assinatura #${subscription.id}?`)) {
                    alert(`Assinatura #${subscription.id} cancelada com sucesso!`);
                    modal.remove();
                    // Aqui normalmente atualizaríamos o status no backend
                }
            });
        }
    }
}

// Função para configurar eventos
function setupEventListeners() {
    // Navegação na sidebar
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe active de todos os links
            document.querySelectorAll('.sidebar-nav a').forEach(item => {
                item.classList.remove('active');
            });
            
            // Adicionar classe active ao link clicado
            this.classList.add('active');
            
            // Carregar conteúdo da página selecionada
            const pageName = this.querySelector('span').textContent;
            loadPageContent(pageName);
        });
    });
    
    // Paginação
    document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe active de todos os links
            document.querySelectorAll('.page-link').forEach(item => {
                item.classList.remove('active');
            });
            
            // Adicionar classe active ao link clicado
            this.classList.add('active');
            
            // Aqui normalmente carregaríamos a página correspondente
            const pageNum = this.textContent;
            console.log(`Carregando página ${pageNum}...`);
        });
    });
}

// Função para carregar conteúdo da página (simulação)
function loadPageContent(pageName) {
    const mainContent = document.querySelector('.main-content');
    const header = mainContent.querySelector('.header h1');
    
    // Atualizar título
    header.textContent = pageName;
    
    // Simular carregamento de conteúdo diferente
    console.log(`Carregando conteúdo da página: ${pageName}`);
    
    // Aqui normalmente faríamos uma requisição AJAX para carregar o conteúdo
    // Por enquanto, apenas mostramos uma mensagem
    if (pageName !== 'Dashboard') {
        const contentArea = mainContent.querySelector('.stats-cards, .charts, .table-container');
        if (contentArea) {
            contentArea.innerHTML = `
                <div style="text-align: center; padding: 50px; background: white; border-radius: 8px;">
                    <i class="fas fa-cog fa-spin fa-3x" style="color: #ff4081; margin-bottom: 20px;"></i>
                    <h3>Carregando ${pageName}...</h3>
                    <p>Esta funcionalidade seria implementada na versão completa.</p>
                </div>
            `;
        }
    }
}

// Inicializar dashboard quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initDashboard);