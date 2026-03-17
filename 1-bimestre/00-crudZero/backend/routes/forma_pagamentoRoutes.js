const express = require('express');
const router = express.Router();
const forma_pagamentoController = require('./../controllers/forma_pagamentoController');

// CRUD de Forma_pagamentos

router.get('/abrirCrudForma_pagamento', forma_pagamentoController.abrirCrudForma_pagamento);
router.get('/', forma_pagamentoController.listarForma_pagamento);
router.post('/', forma_pagamentoController.criarForma_pagamento);
router.get('/:id', forma_pagamentoController.obterForma_pagamento);
router.put('/:id', forma_pagamentoController.atualizarForma_pagamento);
router.delete('/:id', forma_pagamentoController.deletarForma_pagamento);

module.exports = router;
