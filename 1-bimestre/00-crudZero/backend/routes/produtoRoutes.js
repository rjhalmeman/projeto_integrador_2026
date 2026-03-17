const express = require('express');
const router = express.Router();
const produtoController = require('./../controllers/produtoController');

// CRUD de Produtos

router.get('/abrirCrudProduto', produtoController.abrirCrudProduto);
router.get('/', produtoController.listarProdutos);
router.post('/', produtoController.criarProduto);
router.get('/:id', produtoController.obterProduto);
router.put('/:id', produtoController.atualizarProduto);
router.delete('/:id', produtoController.deletarProduto);

module.exports = router;
