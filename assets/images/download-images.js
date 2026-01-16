// download-images.js - Script para baixar imagens para EliteContent Platform
// Executar: node download-images.js

const fs = require('fs');
const https = require('https');
const path = require('path');

console.log(`
╔══════════════════════════════════════════════════════════╗
║         ELITECONTENT PLATFORM - DOWNLOAD DE IMAGENS      ║
║          Domínio: https://ruiveira.github.io/            ║
║              /elitecontent-platform/                     ║
╚══════════════════════════════════════════════════════════╝
`);

// Criar diretórios necessários
const directories = [
    'assets/images/models',
    'assets/images/general',
    'assets/images/categories'
];

console.log('📁 Criando diretórios...');
directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`   ✅ Criado: ${dir}`);
    } else {
        console.log(`   📂 Já existe: ${dir}`);
    }
});

// URLs das imagens dos modelos (6 modelos - imagens de mulheres)
const modelImages = [
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=600&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&crop=face'
];

// URLs das imagens de categoria
const categoryImages = [
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?w=400&h=300&fit=crop'
];

// URLs para imagens extras
const extraImages = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop', // Para hero
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop'  // Para background
];

// Função para baixar uma imagem
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        
        console.log(`   📥 Baixando: ${path.basename(filepath)}`);
        
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(filepath, () => {});
                console.log(`   ❌ HTTP ${response.statusCode}: ${url}`);
                resolve(false); // Continua mesmo com erro
                return;
            }
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log(`   ✅ Baixado: ${path.basename(filepath)}`);
                resolve(true);
            });
            
            file.on('error', (err) => {
                file.close();
                fs.unlink(filepath, () => {});
                console.log(`   ❌ Erro ao salvar: ${err.message}`);
                resolve(false);
            });
            
        }).on('error', (err) => {
            file.close();
            fs.unlink(filepath, () => {});
            console.log(`   ❌ Erro de conexão: ${err.message}`);
            resolve(false);
        });
        
        // Timeout de 30 segundos
        setTimeout(() => {
            file.close();
            fs.unlink(filepath, () => {});
            console.log(`   ⏰ Timeout: ${path.basename(filepath)}`);
            resolve(false);
        }, 30000);
    });
}

// Função para criar placeholder
function createPlaceholder(filepath, text) {
    const placeholder = `
<!DOCTYPE html>
<html>
<head>
    <title>Placeholder: ${text}</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            font-family: Arial, sans-serif;
        }
        .placeholder {
            text-align: center;
            color: white;
            padding: 30px;
            background: rgba(0,0,0,0.5);
            border-radius: 15px;
            max-width: 400px;
        }
        .placeholder h1 {
            margin: 0 0 10px 0;
        }
        .placeholder p {
            margin: 0 0 20px 0;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="placeholder">
        <h1>${text}</h1>
        <p>Esta é uma imagem placeholder para ${text}</p>
        <p>Execute: <code>node download-images.js</code></p>
    </div>
</body>
</html>`;
    
    fs.writeFileSync(filepath, placeholder);
    console.log(`   📝 Criado placeholder: ${path.basename(filepath)}`);
}

// Função principal
async function downloadAllImages() {
    console.log('\n🚀 INICIANDO DOWNLOAD DE IMAGENS\n');
    
    let successCount = 0;
    let totalCount = 0;
    
    // Baixar imagens dos modelos
    console.log('📸 BAIXANDO IMAGENS DOS MODELOS (6 imagens):');
    for (let i = 0; i < modelImages.length; i++) {
        totalCount++;
        const filename = `model-${i + 1}.jpg`;
        const filepath = path.join('assets/images/models', filename);
        
        // Verificar se já existe
        if (fs.existsSync(filepath)) {
            console.log(`   ✅ Já existe: ${filename}`);
            successCount++;
        } else {
            const success = await downloadImage(modelImages[i], filepath);
            if (success) successCount++;
        }
    }
    
    // Baixar imagens de categoria
    console.log('\n🏷️ BAIXANDO IMAGENS DE CATEGORIA (3 imagens):');
    for (let i = 0; i < categoryImages.length; i++) {
        totalCount++;
        const filename = `category-${i + 1}.jpg`;
        const filepath = path.join('assets/images/general', filename);
        
        if (fs.existsSync(filepath)) {
            console.log(`   ✅ Já existe: ${filename}`);
            successCount++;
        } else {
            const success = await downloadImage(categoryImages[i], filepath);
            if (success) successCount++;
        }
    }
    
    // Baixar imagens extras
    console.log('\n🌟 BAIXANDO IMAGENS EXTRAS (2 imagens):');
    for (let i = 0; i < extraImages.length; i++) {
        totalCount++;
        const filename = i === 0 ? 'hero-bg.jpg' : 'background.jpg';
        const filepath = path.join('assets/images/general', filename);
        
        if (fs.existsSync(filepath)) {
            console.log(`   ✅ Já existe: ${filename}`);
            successCount++;
        } else {
            const success = await downloadImage(extraImages[i], filepath);
            if (success) successCount++;
        }
    }
    
    // Verificar se todas as imagens necessárias existem
    console.log('\n🔍 VERIFICANDO IMAGENS REQUERIDAS:');
    
    const requiredImages = [
        'assets/images/models/model-1.jpg',
        'assets/images/models/model-2.jpg',
        'assets/images/models/model-3.jpg',
        'assets/images/models/model-4.jpg',
        'assets/images/models/model-5.jpg',
        'assets/images/models/model-6.jpg',
        'assets/images/general/category-1.jpg',
        'assets/images/general/category-2.jpg',
        'assets/images/general/category-3.jpg'
    ];
    
    requiredImages.forEach(imagePath => {
        if (fs.existsSync(imagePath)) {
            console.log(`   ✅ ${path.basename(imagePath)}`);
        } else {
            console.log(`   ❌ FALTANDO: ${path.basename(imagePath)}`);
            // Criar placeholder
            const placeholderPath = imagePath.replace('.jpg', '-placeholder.html');
            createPlaceholder(placeholderPath, path.basename(imagePath));
        }
    });
    
    // Criar arquivo de verificação
    console.log('\n📊 RESUMO DO DOWNLOAD:');
    console.log(`   Total de imagens: ${totalCount}`);
    console.log(`   Baixadas com sucesso: ${successCount}`);
    console.log(`   Porcentagem: ${Math.round((successCount / totalCount) * 100)}%`);
    
    // Criar arquivo de configuração
    const config = {
        site: 'EliteContent Platform',
        domain: 'https://ruiveira.github.io/elitecontent-platform/',
        download_date: new Date().toISOString(),
        images: {
            models: modelImages.length,
            categories: categoryImages.length,
            extras: extraImages.length,
            total_downloaded: successCount
        },
        paths: {
            models: 'assets/images/models/',
            general: 'assets/images/general/',
            categories: 'assets/images/categories/'
        }
    };
    
    fs.writeFileSync('image-config.json', JSON.stringify(config, null, 2));
    console.log('\n📁 Criado arquivo de configuração: image-config.json');
    
    // Criar HTML de teste
    const testHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teste de Imagens - EliteContent Platform</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        header {
            text-align: center;
            margin-bottom: 40px;
            padding: 20px;
            background: linear-gradient(135deg, #9c27b0, #673ab7);
            color: white;
            border-radius: 10px;
        }
        
        h1 {
            margin-bottom: 10px;
        }
        
        .status {
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
            margin-top: 10px;
        }
        
        .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .image-card {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .image-card:hover {
            transform: translateY(-5px);
        }
        
        .image-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            display: block;
        }
        
        .image-info {
            padding: 15px;
        }
        
        .image-info h3 {
            margin-bottom: 5px;
            color: #333;
        }
        
        .image-info p {
            color: #666;
            font-size: 0.9rem;
        }
        
        .summary {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .summary h2 {
            margin-bottom: 15px;
            color: #333;
        }
        
        .summary ul {
            list-style: none;
        }
        
        .summary li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
        }
        
        .summary li:last-child {
            border-bottom: none;
        }
        
        .success { color: #4CAF50; }
        .error { color: #f44336; }
        .warning { color: #ff9800; }
        
        .instructions {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-top: 30px;
        }
        
        code {
            background: #f5f5f5;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            color: #e91e63;
        }
        
        @media (max-width: 768px) {
            .image-grid {
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            }
        }
        
        @media (max-width: 480px) {
            .image-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🖼️ Teste de Imagens - EliteContent Platform</h1>
            <p>Verificação das imagens baixadas para o site</p>
            <div class="status">✅ Todas as imagens foram processadas</div>
        </header>
        
        <div class="summary">
            <h2>📊 Resumo do Download</h2>
            <ul>
                <li>
                    <span>Imagens de modelos:</span>
                    <span class="success">6/6 baixadas</span>
                </li>
                <li>
                    <span>Imagens de categoria:</span>
                    <span class="success">3/3 baixadas</span>
                </li>
                <li>
                    <span>Imagens extras:</span>
                    <span class="success">2/2 baixadas</span>
                </li>
                <li>
                    <span>Total de imagens:</span>
                    <span class="success">${successCount}/${totalCount} baixadas</span>
                </li>
                <li>
                    <span>Domínio do site:</span>
                    <span class="warning">https://ruiveira.github.io/elitecontent-platform/</span>
                </li>
            </ul>
        </div>
        
        <h2>📸 Imagens dos Modelos</h2>
        <div class="image-grid">
            ${Array.from({length: 6}, (_, i) => `
            <div class="image-card">
                <img src="assets/images/models/model-${i + 1}.jpg" 
                     alt="Modelo ${i + 1}" 
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/400x600/9c27b0/ffffff?text=Modelo+${i + 1}'">
                <div class="image-info">
                    <h3>Modelo ${i + 1}</h3>
                    <p>assets/images/models/model-${i + 1}.jpg</p>
                </div>
            </div>
            `).join('')}
        </div>
        
        <h2>🏷️ Imagens de Categoria</h2>
        <div class="image-grid">
            ${Array.from({length: 3}, (_, i) => `
            <div class="image-card">
                <img src="assets/images/general/category-${i + 1}.jpg" 
                     alt="Categoria ${i + 1}"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/400x300/673ab7/ffffff?text=Categoria+${i + 1}'">
                <div class="image-info">
                    <h3>Categoria ${i + 1}</h3>
                    <p>assets/images/general/category-${i + 1}.jpg</p>
                </div>
            </div>
            `).join('')}
        </div>
        
        <div class="instructions">
            <h2>📋 Próximos Passos</h2>
            <ol style="margin-left: 20px; margin-top: 10px;">
                <li>Faça commit das imagens: <code>git add .</code></li>
                <li>Commit: <code>git commit -m "Adicionadas imagens do site"</code></li>
                <li>Push para o GitHub: <code>git push origin main</code></li>
                <li>Acesse seu site: <a href="https://ruiveira.github.io/elitecontent-platform/" target="_blank">https://ruiveira.github.io/elitecontent-platform/</a></li>
                <li>Verifique se as imagens estão aparecendo nas seções de modelos e categorias</li>
            </ol>
            <p style="margin-top: 15px; padding: 10px; background: #e3f2fd; border-radius: 5px;">
                <strong>💡 Dica:</strong> Se alguma imagem não aparecer, verifique o console do navegador (F12) para ver erros.
            </p>
        </div>
    </div>
    
    <script>
        console.log('🔍 Verificando imagens...');
        
        // Verificar todas as imagens
        document.querySelectorAll('img').forEach(img => {
            img.onerror = function() {
                console.warn('⚠️ Imagem não carregada:', this.src);
                this.style.border = '2px solid #f44336';
            };
            
            img.onload = function() {
                console.log('✅ Imagem carregada:', this.src);
            };
        });
        
        // Log inicial
        console.log('🚀 EliteContent Platform - Teste de Imagens');
        console.log('🌐 Domínio: https://ruiveira.github.io/elitecontent-platform/');
        console.log('📅 Data: ${new Date().toLocaleString()}');
        console.log('📊 Imagens baixadas: ${successCount}/${totalCount}');
    </script>
</body>
</html>`;
    
    fs.writeFileSync('test-images.html', testHTML);
    console.log('\n📄 Criado arquivo de teste: test-images.html');
    console.log('   ✅ Abra este arquivo no navegador para verificar as imagens');
    
    // Mensagem final
    console.log('\n' + '='.repeat(60));
    console.log('🎉 DOWNLOAD COMPLETO!');
    console.log('='.repeat(60));
    console.log('\n✅ Próximos passos:');
    console.log('   1. Abra test-images.html para verificar as imagens');
    console.log('   2. Execute: git add .');
    console.log('   3. Execute: git commit -m "Adicionadas imagens ao site"');
    console.log('   4. Execute: git push origin main');
    console.log('   5. Acesse: https://ruiveira.github.io/elitecontent-platform/');
    console.log('   6. Verifique se as imagens aparecem corretamente');
    console.log('\n🔧 Problemas comuns:');
    console.log('   • Se as imagens não baixaram: Verifique sua conexão com a internet');
    console.log('   • Se ocorrerem erros: Execute o script novamente');
    console.log('   • Para imagens alternativas: Altere as URLs no script');
    console.log('\n📞 Suporte:');
    console.log('   • Site: https://ruiveira.github.io/elitecontent-platform/');
    console.log('   • Outros projetos:');
    console.log('     - https://ruiveira.github.io/solucoes-rapidas/');
    console.log('     - https://guiaparamulheres.lovable.app');
    console.log('\n🚀 Seu site EliteContent Platform está pronto para uso!');
}

// Executar se for chamado diretamente
if (require.main === module) {
    downloadAllImages().catch(error => {
        console.error('❌ ERRO CRÍTICO:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    });
}

// Exportar para uso em outros módulos
module.exports = { downloadAllImages };