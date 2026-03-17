const express = require('express');
const router = express.Router();
const multer = require('multer');
const imageController = require('../controllers/imageController.js');

// Configuração do Multer (sem salvamento direto, apenas em memória)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // Limite de 10MB
});

// Middleware GLOBAL deste router para garantir que o diretório exista
router.use(imageController.ensureUploadDir);



// O Multer é middleware de rota
// Rota 1: Upload ou Download de imagem
router.post('/upload-image', upload.single('imageFile'), imageController.uploadImage);

// Rota 2: Visualizar/Baixar a imagem
router.get('/view-image/:produtoId', imageController.viewImage);

module.exports = router;