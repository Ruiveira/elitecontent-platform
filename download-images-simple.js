// download-images-simple.js
const fs = require('fs');
const https = require('https');

// Criar diretórios
if (!fs.existsSync('assets/images/models')) {
    fs.mkdirSync('assets/images/models', { recursive: true });
}
if (!fs.existsSync('assets/images/general')) {
    fs.mkdirSync('assets/images/general', { recursive: true });
}

// Imagens dos modelos (6 imagens)
const modelImages = [
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=600&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&crop=face'
];

// Imagens de categoria
const categoryImages = [
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?w=300&h=300&fit=crop'
];

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                const fileStream = fs.createWriteStream(filepath);
                response.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`✅ ${filepath}`);
                    resolve();
                });
            } else {
                console.log(`❌ Erro ${response.statusCode}: ${url}`);
                resolve(); // Continua mesmo com erro
            }
        }).on('error', () => {
            console.log(`❌ Erro de conexão: ${url}`);
            resolve(); // Continua mesmo com erro
        });
    });
}

async function main() {
    console.log('📥 Baixando imagens...');
    
    // Baixar imagens dos modelos
    for (let i = 0; i < modelImages.length; i++) {
        await downloadImage(modelImages[i], `assets/images/models/model-${i+1}.jpg`);
    }
    
    // Baixar imagens de categoria
    for (let i = 0; i < categoryImages.length; i++) {
        await downloadImage(categoryImages[i], `assets/images/general/category-${i+1}.jpg`);
    }
    
    console.log('✅ Todas as imagens foram processadas!');
}

main();