const express = require('express');
const router = express.Router();
const pedidoController = require('./../controllers/pedidoController');

// CRUD de Pedidos

router.get('/abrirCrudPedido', pedidoController.abrirCrudPedido);
router.get('/', pedidoController.listarPedidos);

// Rota para pedidos normais/físicos (ex: feitos por um funcionário)
router.post('/gerente', pedidoController.criarPedido);

// Rota exclusiva para pedidos online (AGORA COM CAMINHO ÚNICO)
router.post('/online', pedidoController.criarPedidoOnline); 

router.get('/:id', pedidoController.obterPedido);
router.put('/:id', pedidoController.atualizarPedido);
router.delete('/:id', pedidoController.deletarPedido);

module.exports = router;