const path = require('path');
const fs = require('fs/promises');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');

// Diretório onde as imagens finais são salvas
// Nota: __dirname refere-se ao local deste arquivo. 
// Se mudar a pasta do controller, verifique se esse caminho continua correto.
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'imagens', 'produto');

// Middleware para garantir que o diretório de upload existe
const ensureUploadDir = async (req, res, next) => {
    try {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        next();
    } catch (error) {
        console.error('Erro ao criar diretório de upload:', error);
        res.status(500).json({ error: 'Erro de configuração do servidor.' });
    }
};

// Lógica de Processamento e Upload da Imagem
const uploadImage = async (req, res) => {
    console.log('Requisição recebida para /upload-image - Body:', req.body);

    const { produtoId, imageSource, imageUrl } = req.body;

    if (!produtoId) {
        return res.status(400).json({ message: 'ID do Produto é obrigatório.' });
    }

    let imageBuffer;

    try {
        // Verifica a fonte da imagem
        if (imageSource === 'local' && req.file) {
            imageBuffer = req.file.buffer;
        } else if (imageSource === 'url' && imageUrl) {
            const response = await axios.get(imageUrl, {
                responseType: 'arraybuffer'
            });
            imageBuffer = response.data;
        } else {
            return res.status(400).json({
                message: 'Dados de imagem inválidos ou ausentes.'
            });
        }

        if (!imageBuffer || imageBuffer.length === 0) {
            return res.status(400).json({ message: 'Buffer de imagem vazio ou inválido.' });
        }

        // Conversão para PNG usando Canvas
        const image = await loadImage(imageBuffer);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);
        const pngBuffer = canvas.toBuffer('image/png');

        const finalBuffer = pngBuffer;
        const extensao = 'png';
        const filename = `${produtoId}.${extensao}`;
        const finalPath = path.join(UPLOAD_DIR, filename);

        // Salvar o buffer PNG no arquivo
        await fs.writeFile(finalPath, finalBuffer);

        res.status(200).json({
            message: 'Imagem salva com sucesso!',
            filename: filename,
            path: finalPath,
            size: finalBuffer.length,
            format: extensao.toUpperCase(),
            // Informa a URL de visualização para o frontend
            viewUrl: `/view-image/${produtoId}`
        });

    } catch (error) {
        console.error('❌ Erro ao processar imagem:', error);

        let errorMessage = 'Erro interno ao processar a imagem.';
        if (error.message && error.message.includes('Invalid image source')) {
            errorMessage = 'Formato de imagem original não suportado pelo Canvas ou corrompido.';
        } else if (error.message && error.message.includes('404')) {
            errorMessage = 'URL de imagem não encontrada ou inacessível.';
        }

        res.status(500).json({
            message: errorMessage,
            error: error.message,
            code: error.code
        });
    }
};

// Lógica de Visualização/Download da Imagem
const viewImage = async (req, res) => {
    const { produtoId } = req.params;
    const filename = `${produtoId}.png`;
    const filePath = path.join(UPLOAD_DIR, filename);

    try {
        // Verifica se o arquivo existe antes de tentar enviar
        await fs.access(filePath);

        // Envia o arquivo de imagem como resposta
        res.sendFile(filePath);
    } catch (error) {
        console.error(`Arquivo ${filename} não encontrado:`, error.message);
        // Se o arquivo não existir, retorna 404
        res.status(404).json({ message: `Imagem para o Produto ID ${produtoId} não encontrada.` });
    }
};

module.exports = {
    ensureUploadDir,
    uploadImage,
    viewImage
};