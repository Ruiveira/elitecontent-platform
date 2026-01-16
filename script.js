// ==================== CONFIGURAÇÕES GERAIS ====================

// Configuração do SEU Firebase real
const firebaseConfig = {
    apiKey: "AIzaSyAnFayPiwd4dhHdPIcPzzxZ4GhLMVDrBQk",
    authDomain: "elitecontent-rui.firebaseapp.com",
    projectId: "elitecontent-rui",
    storageBucket: "elitecontent-rui.firebasestorage.app",
    messagingSenderId: "1032387803482",
    appId: "1:1032387803482:web:3c7d31dafa979aafd19b63"
};

// Dados dos modelos
const models = [
    {
        id: 1,
        name: "Sophia Rossi",
        category: "Latina",
        videos: 124,
        photos: 856,
        isOnline: true,
        rating: 4.9,
        subscribers: 1247,
        monthlyEarnings: 2847.50
    },
    {
        id: 2,
        name: "Lena Wolf",
        category: "Europeia",
        videos: 89,
        photos: 642,
        isOnline: false,
        rating: 4.8,
        subscribers: 987,
        monthlyEarnings: 2150.20
    },
    {
        id: 3,
        name: "Mia Chen",
        category: "Asiática",
        videos: 67,
        photos: 432,
        isOnline: true,
        rating: 4.7,
        subscribers: 856,
        monthlyEarnings: 1980.75
    },
    {
        id: 4,
        name: "Chloe Dubois",
        category: "Europeia",
        videos: 112,
        photos: 789,
        isOnline: false,
        rating: 4.8,
        subscribers: 742,
        monthlyEarnings: 1750.30
    },
    {
        id: 5,
        name: "Sakura Tanaka",
        category: "Asiática",
        videos: 78,
        photos: 512,
        isOnline: true,
        rating: 4.9,
        subscribers: 689,
        monthlyEarnings: 1620.90
    },
    {
        id: 6,
        name: "Zara Johnson",
        category: "Afro",
        videos: 87,
        photos: 634,
        isOnline: true,
        rating: 4.6,
        subscribers: 856,
        monthlyEarnings: 1980.75
    }
];

// Dados dos planos Stripe
const stripePlans = {
    monthly: {
        name: "Plano Mensal",
        price: "29,90",
        period: "mês",
        fullPrice: "29,90",
        stripeUrl: "https://buy.stripe.com/7sYbITfD4aLV7ur9TV4c80z"
    },
    quarterly: {
        name: "Plano Trimestral",
        price: "24,90",
        period: "mês",
        fullPrice: "74,70",
        stripeUrl: "https://buy.stripe.com/00wdR19eGbPZ5mj1np4c80A"
    },
    yearly: {
        name: "Plano Anual",
        price: "19,90",
        period: "mês",
        fullPrice: "238,80",
        stripeUrl: "https://buy.stripe.com/28E00b76y8DN7ur4zB4c80B"
    }
};

// Estado da aplicação
let currentUser = null;
let selectedPlan = null;
let ageVerified = false;
let firebaseAuth = null;

// DOM Elements
const ageVerification = document.getElementById('ageVerification');
const confirmAgeBtn = document.getElementById('confirmAge');
const denyAgeBtn = document.getElementById('denyAge');
const modelsGrid = document.getElementById('modelsGrid');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginBtn = document.getElementById('loginBtn');
const signupLink = document.querySelector('.signup-link');
const loginLink = document.querySelector('.login-link');
const togglePassword = document.getElementById('togglePassword');
const successNotification = document.getElementById('successNotification');
const pageLoader = document.getElementById('pageLoader');
const subscribersRange = document.getElementById('subscribersRange');
const subscribersValue = document.getElementById('subscribersValue');
const monthlyEarnings = document.getElementById('monthlyEarnings');
const yearlyEarnings = document.getElementById('yearlyEarnings');

// ==================== GOOGLE ANALYTICS 4 ====================

// Função para rastrear eventos no GA4
function trackGAEvent(eventName, eventParams = {}) {
    try {
        // Verificar se gtag está disponível
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventParams);
            
            // Log para debug
            gaDebug({
                message: `Evento GA4: ${eventName}`,
                data: eventParams,
                type: 'success'
            });
            
            // Adicionar animação de feedback visual
            const eventElement = event.target || document.body;
            eventElement.classList.add('event-tracked');
            setTimeout(() => eventElement.classList.remove('event-tracked'), 500);
            
            return true;
        } else {
            gaDebug({
                message: `GA4 não carregado - Evento: ${eventName}`,
                type: 'error'
            });
            return false;
        }
    } catch (error) {
        console.error('Erro ao rastrear evento GA4:', error);
        gaDebug({
            message: `Erro GA4: ${error.message}`,
            type: 'error'
        });
        return false;
    }
}

// Função para debug do GA4
function gaDebug(log) {
    try {
        const debugConsole = document.getElementById('gaDebugConsole');
        if (!debugConsole) {
            const consoleDiv = document.createElement('div');
            consoleDiv.id = 'gaDebugConsole';
            consoleDiv.className = 'active';
            document.body.appendChild(consoleDiv);
        }
        
        const logEntry = document.createElement('div');
        logEntry.className = `debug-log ${log.type || 'info'}`;
        
        const timestamp = new Date().toLocaleTimeString();
        let logMessage = `[${timestamp}] ${log.message}`;
        
        if (log.data) {
            logMessage += ` - ${JSON.stringify(log.data)}`;
        }
        
        logEntry.textContent = logMessage;
        debugConsole.appendChild(logEntry);
        
        // Manter apenas os últimos 20 logs
        while (debugConsole.children.length > 20) {
            debugConsole.removeChild(debugConsole.firstChild);
        }
        
        // Scroll para o final
        debugConsole.scrollTop = debugConsole.scrollHeight;
        
        // Também log no console
        if (log.type === 'error') {
            console.error(log.message, log.data || '');
        } else if (log.type === 'success') {
            console.log(log.message, log.data || '');
        } else {
            console.info(log.message, log.data || '');
        }
    } catch (error) {
        console.error('Erro no debug do GA:', error);
    }
}

// Mostrar status do GA4
function showGAStatus(message, type = 'info') {
    try {
        let statusDiv = document.getElementById('gaStatus');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'gaStatus';
            statusDiv.className = 'ga-status';
            document.body.appendChild(statusDiv);
        }
        
        statusDiv.textContent = message;
        statusDiv.className = `ga-status ${type} active`;
        
        // Auto-esconder após 3 segundos
        setTimeout(() => {
            statusDiv.classList.remove('active');
        }, 3000);
        
        gaDebug({
            message: `Status GA4: ${message}`,
            type: type
        });
    } catch (error) {
        console.error('Erro ao mostrar status GA:', error);
    }
}

// Inicializar Google Analytics
function initGoogleAnalytics() {
    try {
        // Verificar se o GA está carregado
        if (typeof gtag === 'undefined') {
            throw new Error('GA4 não carregado');
        }
        
        // Configurar dados do usuário se estiver logado
        if (currentUser) {
            gtag('set', 'user_properties', {
                'user_id': currentUser.email,
                'sign_up_date': currentUser.joinDate,
                'account_type': currentUser.isSocialLogin ? 'social' : 'email'
            });
        }
        
        // Rastrear evento de inicialização
        trackGAEvent('app_initialized', {
            'age_verified': ageVerified,
            'user_logged_in': !!currentUser,
            'screen_resolution': `${window.screen.width}x${window.screen.height}`,
            'device_type': /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
        });
        
        showGAStatus('Analytics conectado com sucesso', 'success');
        gaDebug({
            message: 'GA4 inicializado com Measurement ID: G-50YVJJ0MEC',
            type: 'success'
        });
        
        return true;
    } catch (error) {
        console.error('Erro ao inicializar GA4:', error);
        showGAStatus('Erro no Analytics', 'error');
        gaDebug({
            message: `Falha ao inicializar GA4: ${error.message}`,
            type: 'error'
        });
        return false;
    }
}

// ==================== FUNÇÕES DO SITE ====================

// Verificação de Idade
function checkAgeVerification() {
    const ageConfirmed = localStorage.getItem('ageVerified');
    if (ageConfirmed === 'true') {
        ageVerified = true;
        ageVerification.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Rastrear no GA4
        trackGAEvent('age_verification_remembered');
    } else {
        ageVerification.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function confirmAge() {
    localStorage.setItem('ageVerified', 'true');
    ageVerified = true;
    ageVerification.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Rastrear no GA4
    trackGAEvent('age_verified', {
        'event_category': 'Engagement',
        'event_label': 'Age Gate Approved'
    });
    
    showGAStatus('Idade verificada com sucesso', 'success');
}

function denyAge() {
    // Rastrear no GA4
    trackGAEvent('age_verification_denied', {
        'event_category': 'Engagement',
        'event_label': 'Age Gate Denied'
    });
    
    window.location.href = 'https://www.google.com';
}

// Carregar modelos
function loadModels() {
    if (!modelsGrid) return;
    
    modelsGrid.innerHTML = '';
    
    models.forEach(model => {
        const modelCard = document.createElement('div');
        modelCard.className = 'model-card-preview';
        modelCard.setAttribute('data-id', model.id);
        
        modelCard.innerHTML = `
            <div class="model-image" style="background: linear-gradient(135deg, #${['ff4081','9c27b0','2196F3','4CAF50','FF9800','E91E63'][model.id % 6]}, #${['e91e63','7b1fa2','1976D2','388E3C','FF5722','C2185B'][model.id % 6]}); display: flex; align-items: center; justify-content: center; color: white; font-size: 3.5rem; position: relative;">
                <i class="fas fa-user-circle"></i>
                ${model.isOnline ? '<span class="online-badge">● ONLINE</span>' : ''}
            </div>
            <div class="model-info">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <h3 class="model-name">${model.name}</h3>
                        <span class="model-category">${model.category}</span>
                    </div>
                    <div class="model-rating">
                        <i class="fas fa-star"></i> ${model.rating}
                    </div>
                </div>
                <div class="model-stats">
                    <span><i class="fas fa-video"></i> ${model.videos} vídeos</span>
                    <span><i class="fas fa-camera"></i> ${model.photos} fotos</span>
                    <span><i class="fas fa-users"></i> ${model.subscribers} assinantes</span>
                </div>
                <div class="model-earnings">
                    <i class="fas fa-money-bill-wave"></i> Ganha R$ ${model.monthlyEarnings.toFixed(2)}/mês
                </div>
                <button class="btn-view-model" data-id="${model.id}" onclick="trackGAEvent('view_model', {model_id: ${model.id}, model_name: '${model.name}'})">
                    <i class="fas fa-eye"></i> Ver Perfil
                </button>
            </div>
        `;
        
        modelsGrid.appendChild(modelCard);
    });
}

// Funções de notificação
function showNotification(message, type = 'info') {
    const notification = document.getElementById('successNotification');
    const icon = notification.querySelector('i');
    const text = notification.querySelector('span');
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(45deg, #4CAF50, #2e7d32)';
        icon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(45deg, #f44336, #c62828)';
        icon.className = 'fas fa-exclamation-circle';
    } else if (type === 'warning') {
        notification.style.background = 'linear-gradient(45deg, #ff9800, #ef6c00)';
        icon.className = 'fas fa-exclamation-triangle';
    } else {
        notification.style.background = 'linear-gradient(45deg, #2196F3, #1565c0)';
        icon.className = 'fas fa-info-circle';
    }
    
    text.textContent = message;
    notification.style.display = 'flex';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Funções de modal
function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Rastrear abertura de modal no GA4
    const modalType = modal.id === 'loginModal' ? 'login' : 
                     modal.id === 'signupModal' ? 'signup' : 'modal';
    trackGAEvent(`open_${modalType}_modal`);
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Menu mobile
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Função para inicializar Firebase Auth
async function initFirebaseAuth() {
    try {
        // Verificar se Firebase já está carregado
        if (typeof window.firebaseAuth !== 'undefined') {
            firebaseAuth = window.firebaseAuth;
            console.log('Firebase Auth carregado com sucesso');
            return true;
        }
        
        // Tentar carregar dinamicamente se não estiver disponível
        const firebaseModule = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const authModule = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        
        const app = firebaseModule.initializeApp(firebaseConfig);
        firebaseAuth = authModule.getAuth(app);
        
        console.log('Firebase Auth inicializado dinamicamente');
        return true;
    } catch (error) {
        console.warn('Firebase Auth não disponível, usando modo simulado:', error.message);
        return false;
    }
}

// Autenticação com Firebase
async function handleEmailLogin(e) {
    if (e) e.preventDefault();
    
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;
    
    if (!email || !password) {
        showNotification('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    try {
        // Tentar usar Firebase real se disponível
        if (await initFirebaseAuth() && firebaseAuth) {
            const authModule = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            const userCredential = await authModule.signInWithEmailAndPassword(firebaseAuth, email, password);
            
            currentUser = {
                email: userCredential.user.email,
                name: userCredential.user.email.split('@')[0],
                uid: userCredential.user.uid,
                joinDate: new Date().toISOString(),
                isSocialLogin: false
            };
            
            showNotification(`Bem-vindo de volta, ${currentUser.name}!`, 'success');
        } else {
            // Fallback para simulação
            currentUser = {
                email: email,
                name: email.split('@')[0],
                joinDate: new Date().toISOString(),
                isSocialLogin: false
            };
            
            showNotification(`Bem-vindo de volta, ${currentUser.name}! (modo simulado)`, 'success');
        }
        
        localStorage.setItem('premiumContentUser', JSON.stringify(currentUser));
        
        // Rastrear login no GA4
        trackGAEvent('login', {
            'method': 'email',
            'user_id': email
        });
        
        closeModal(loginModal);
        updateUserInterface();
        
    } catch (error) {
        console.error('Erro no login:', error);
        
        // Fallback para simulação em caso de erro
        currentUser = {
            email: email,
            name: email.split('@')[0],
            joinDate: new Date().toISOString(),
            isSocialLogin: false
        };
        
        localStorage.setItem('premiumContentUser', JSON.stringify(currentUser));
        
        showNotification(`Bem-vindo de volta, ${currentUser.name}! (modo offline)`, 'success');
        closeModal(loginModal);
        updateUserInterface();
    }
}

async function handleEmailSignup(e) {
    if (e) e.preventDefault();
    
    const email = document.getElementById('signupEmail')?.value;
    const password = document.getElementById('signupPassword')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    const ageConfirm = document.getElementById('ageConfirm')?.checked;
    const terms = document.getElementById('terms')?.checked;
    
    // Validações
    if (!email || !password || !confirmPassword) {
        showNotification('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Por favor, insira um e-mail válido.', 'error');
        return;
    }
    
    if (password.length < 8) {
        showNotification('A senha deve ter pelo menos 8 caracteres.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('As senhas não coincidem.', 'error');
        return;
    }
    
    if (!ageConfirm) {
        showNotification('Você deve confirmar que tem 18 anos ou mais.', 'error');
        return;
    }
    
    if (!terms) {
        showNotification('Você deve aceitar os Termos de Serviço.', 'error');
        return;
    }
    
    try {
        // Tentar usar Firebase real se disponível
        if (await initFirebaseAuth() && firebaseAuth) {
            const authModule = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            const userCredential = await authModule.createUserWithEmailAndPassword(firebaseAuth, email, password);
            
            currentUser = {
                email: userCredential.user.email,
                name: userCredential.user.email.split('@')[0],
                uid: userCredential.user.uid,
                joinDate: new Date().toISOString(),
                isNew: true,
                isSocialLogin: false
            };
            
            showNotification(`Cadastro realizado com sucesso! Bem-vindo(a) ${currentUser.name}!`, 'success');
        } else {
            // Fallback para simulação
            currentUser = {
                email: email,
                name: email.split('@')[0],
                joinDate: new Date().toISOString(),
                isNew: true,
                isSocialLogin: false
            };
            
            showNotification(`Cadastro realizado com sucesso! Bem-vindo(a) ${currentUser.name}! (modo simulado)`, 'success');
        }
        
        localStorage.setItem('premiumContentUser', JSON.stringify(currentUser));
        
        // Rastrear cadastro no GA4
        trackGAEvent('sign_up', {
            'method': 'email',
            'user_id': email
        });
        
        closeModal(signupModal);
        updateUserInterface();
        
    } catch (error) {
        console.error('Erro no cadastro:', error);
        
        if (error.code === 'auth/email-already-in-use') {
            showNotification('Este e-mail já está em uso. Tente fazer login.', 'error');
        } else if (error.code === 'auth/weak-password') {
            showNotification('A senha é muito fraca. Use pelo menos 6 caracteres.', 'error');
        } else {
            // Fallback para simulação em caso de erro
            currentUser = {
                email: email,
                name: email.split('@')[0],
                joinDate: new Date().toISOString(),
                isNew: true,
                isSocialLogin: false
            };
            
            localStorage.setItem('premiumContentUser', JSON.stringify(currentUser));
            
            showNotification(`Cadastro realizado com sucesso! Bem-vindo(a) ${currentUser.name}! (modo offline)`, 'success');
            closeModal(signupModal);
            updateUserInterface();
        }
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Atualizar interface do usuário
function updateUserInterface() {
    const navActions = document.querySelector('.nav-actions');
    
    if (currentUser) {
        navActions.innerHTML = `
            <div class="user-dropdown">
                <button class="user-menu-btn" onclick="trackGAEvent('open_user_menu')">
                    <i class="fas fa-user-circle"></i>
                    <span>${currentUser.name}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="user-dropdown-menu">
                    <a href="#" onclick="trackGAEvent('click_profile')"><i class="fas fa-user"></i> Meu Perfil</a>
                    <a href="#" onclick="trackGAEvent('click_history')"><i class="fas fa-history"></i> Histórico</a>
                    <a href="#" onclick="trackGAEvent('click_settings')"><i class="fas fa-cog"></i> Configurações</a>
                    <a href="#" id="logoutBtn" onclick="trackGAEvent('click_logout')"><i class="fas fa-sign-out-alt"></i> Sair</a>
                </div>
            </div>
        `;
        
        // Adicionar evento de logout
        document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
        setupUserDropdown();
    } else {
        navActions.innerHTML = `
            <a href="#" class="btn-login" id="loginBtn"><i class="fas fa-sign-in-alt"></i> Entrar</a>
            <a href="#pricing" class="btn-subscribe"><i class="fas fa-gem"></i> Assinar Agora</a>
        `;
        
        document.getElementById('loginBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(loginModal);
        });
    }
}

function setupUserDropdown() {
    const userMenuBtn = document.querySelector('.user-menu-btn');
    const userDropdown = document.querySelector('.user-dropdown-menu');
    
    userMenuBtn?.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdown?.classList.toggle('show');
    });
    
    document.addEventListener('click', function() {
        userDropdown?.classList.remove('show');
    });
}

async function handleLogout(e) {
    if (e) e.preventDefault();
    
    try {
        // Tentar logout no Firebase se disponível
        if (firebaseAuth) {
            const authModule = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            await authModule.signOut(firebaseAuth);
        }
    } catch (error) {
        console.log('Logout Firebase não disponível, continuando...');
    }
    
    // Rastrear logout no GA4
    trackGAEvent('logout', {
        'user_id': currentUser?.email
    });
    
    currentUser = null;
    localStorage.removeItem('premiumContentUser');
    
    showNotification('Você saiu da sua conta.', 'info');
    updateUserInterface();
}

// Rastrear conversões
function trackConversion(planType) {
    if (!ageVerified) {
        showNotification('Por favor, verifique sua idade primeiro.', 'warning');
        ageVerification.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        return false;
    }
    
    // Rastrear início do checkout no GA4
    const planValue = planType === 'monthly' ? 29.90 : planType === 'quarterly' ? 74.70 : 238.80;
    
    trackGAEvent('begin_checkout', {
        'currency': 'BRL',
        'value': planValue,
        'items': [{
            'item_id': planType,
            'item_name': stripePlans[planType]?.name || planType,
            'price': planValue,
            'quantity': 1
        }],
        'user_id': currentUser?.email || 'guest'
    });
    
    // Salvar dados temporários
    localStorage.setItem('lastSelectedPlan', planType);
    localStorage.setItem('checkoutTimestamp', Date.now());
    
    showNotification('Redirecionando para o pagamento seguro...', 'info');
    return true;
}

// Configurar links do Stripe
function setupStripeLinks() {
    document.querySelectorAll('a[href*="stripe.com"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const planType = this.getAttribute('data-plan');
            
            if (!trackConversion(planType)) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                // Adicionar parâmetros de referência
                const baseUrl = this.getAttribute('href');
                const referrer = encodeURIComponent(window.location.href);
                const userEmail = currentUser?.email ? encodeURIComponent(currentUser.email) : '';
                
                let finalUrl = baseUrl;
                const params = new URLSearchParams();
                params.append('referrer', referrer);
                params.append('client_reference_id', userEmail || 'guest');
                params.append('prefilled_email', userEmail || '');
                
                finalUrl += (baseUrl.includes('?') ? '&' : '?') + params.toString();
                this.setAttribute('href', finalUrl);
            }
        });
    });
}

// Verificar retorno do Stripe
function checkStripeReturn() {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const canceled = urlParams.get('canceled');
    const sessionId = urlParams.get('session_id');
    
    if (success === 'true' && sessionId) {
        // Rastrear compra no GA4
        const planType = localStorage.getItem('lastSelectedPlan');
        if (planType) {
            const planValue = planType === 'monthly' ? 29.90 : planType === 'quarterly' ? 74.70 : 238.80;
            
            trackGAEvent('purchase', {
                'transaction_id': sessionId,
                'currency': 'BRL',
                'value': planValue,
                'items': [{
                    'item_id': planType,
                    'item_name': stripePlans[planType]?.name || planType,
                    'price': planValue,
                    'quantity': 1
                }]
            });
            
            localStorage.removeItem('lastSelectedPlan');
            localStorage.removeItem('checkoutTimestamp');
        }
        
        showNotification('Pagamento realizado com sucesso! Acesse seu conteúdo.', 'success');
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (canceled === 'true') {
        trackGAEvent('checkout_cancelled');
        showNotification('Pagamento cancelado. Você pode tentar novamente quando quiser.', 'warning');
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Calculadora de ganhos
function setupEarningsCalculator() {
    if (!subscribersRange) return;
    
    function updateEarnings() {
        const subscribers = parseInt(subscribersRange.value);
        subscribersValue.textContent = `${subscribers} assinantes`;
        
        const monthlyPerSubscriber = 29.90 * 0.70;
        const monthlyTotal = subscribers * monthlyPerSubscriber;
        const yearlyTotal = monthlyTotal * 12;
        
        monthlyEarnings.textContent = `R$ ${monthlyTotal.toFixed(2)}`;
        yearlyEarnings.textContent = `R$ ${yearlyTotal.toFixed(2)}`;
    }
    
    subscribersRange.addEventListener('input', updateEarnings);
    updateEarnings();
}

// Inicializar eventos
function initEventListeners() {
    // Verificação de idade
    confirmAgeBtn?.addEventListener('click', confirmAge);
    denyAgeBtn?.addEventListener('click', denyAge);
    
    // Menu mobile
    hamburger?.addEventListener('click', toggleMobileMenu);
    
    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Botão de login
    loginBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(loginModal);
    });
    
    // Fechar modais
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Formulários
    loginForm?.addEventListener('submit', handleEmailLogin);
    signupForm?.addEventListener('submit', handleEmailSignup);
    
    // Alternar senha visível/invisível
    togglePassword?.addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
    
    // Links entre modais
    signupLink?.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(signupModal);
    });
    
    loginLink?.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(signupModal);
        openModal(loginModal);
    });
    
    // Configurar links do Stripe
    setupStripeLinks();
    
    // Configurar calculadora de ganhos
    setupEarningsCalculator();
    
    // Suavizar rolagem
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Rastrear cliques em categorias
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            trackGAEvent('view_category', {category: category});
        });
    });
}

// Inicializar a página
function init() {
    // Mostrar loader
    pageLoader.style.display = 'flex';
    
    // Verificar idade
    checkAgeVerification();
    
    // Verificar usuário salvo
    const savedUser = localStorage.getItem('premiumContentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
        } catch (e) {
            console.error('Erro ao carregar usuário:', e);
            localStorage.removeItem('premiumContentUser');
        }
    }
    
    // Inicializar Google Analytics
    setTimeout(() => {
        initGoogleAnalytics();
    }, 1500);
    
    // Carregar modelos
    loadModels();
    
    // Inicializar eventos
    initEventListeners();
    
    // Verificar retorno do Stripe
    checkStripeReturn();
    
    // Atualizar interface
    updateUserInterface();
    
    // Esconder loader
    setTimeout(() => {
        pageLoader.style.display = 'none';
        
        // Rastrear página carregada
        trackGAEvent('page_loaded', {
            'page_title': document.title,
            'page_path': window.location.pathname
        });
    }, 1000);
    
    // Inicializar contadores animados
    initAnimatedCounters();
}

// Contadores animados
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const text = counter.textContent;
        const target = parseInt(text.replace('+', ''));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current) + '+';
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Inicializar quando o DOM carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Exportar funções para uso global
window.trackGAEvent = trackGAEvent;
window.gaDebug = gaDebug;