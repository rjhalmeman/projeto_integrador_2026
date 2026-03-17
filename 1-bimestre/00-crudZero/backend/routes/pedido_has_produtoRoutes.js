const express = require('express');
const router = express.Router();
const pedido_has_produtoController = require('./../controllers/pedido_has_produtoController');

// CRUD de Pedido_has_produtos
// Rotas para a PK composta: pedido_id e produto_id
router.get('/:id_pedido/:id_produto', pedido_has_produtoController.obterPedido_has_produto);
router.put('/:id_pedido/:id_produto', pedido_has_produtoController.atualizarPedido_has_produto);
router.delete('/:id_pedido/:id_produto', pedido_has_produtoController.deletarPedido_has_produto);

// Outras rotas sem a PK composta
router.get('/abrirCrudPedido_has_produto', pedido_has_produtoController.abrirCrudPedido_has_produto);
router.get('/', pedido_has_produtoController.listarPedido_has_produtos);

// Rota para obter todos os itens de um pedido específico
router.get('/:idPedido', pedido_has_produtoController.obterItensDeUmPedido_has_produto);
router.post('/', pedido_has_produtoController.criarPedido_has_produto);

// NOVA ROTA PARA INSERÇÃO EM LOTE
router.post('/lote', pedido_has_produtoController.criarItensPedidoEmLote);

module.exports = router;