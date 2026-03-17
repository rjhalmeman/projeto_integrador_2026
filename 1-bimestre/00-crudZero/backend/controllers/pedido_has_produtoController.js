//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');

exports.abrirCrudPedido_has_produto = (req, res) => {
 // console.log('pedido_has_produtoController - Rota /abrirCrudPedido_has_produto - abrir o crudPedido_has_produto');
  res.sendFile(path.join(__dirname, '../../frontend/pedido_has_produto/pedido_has_produto.html'));
}

exports.listarPedido_has_produtos = async (req, res) => {
  try {
    const result = await query('SELECT * FROM pedido_has_produto ORDER BY pedido_id_pedido');
   // console.log('Resultado do SELECT:', result.rows);//verifica se está retornando algo
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar pedido_has_produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


/////////////////////////////////////////////////////////////////////
// Função para criar um novo item de pedido
///////////////////////////////////////////////////////////////////// 
// Função para criar um novo item de pedido no banco de dados.
exports.criarPedido_has_produto = async (req, res) => {
  try {
    const { pedido_id_pedido, produto_id_produto, quantidade, preco_unitario } = req.body;

    // Verifica se os dados necessários foram fornecidos.
    if (!pedido_id_pedido || !produto_id_produto || !quantidade || !preco_unitario) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios: pedido_id_pedido, produto_id_produto, quantidade, preco_unitario.' });
    }

    // Você pode adicionar mais verificações aqui, por exemplo,
    // se o pedido e o produto existem.

    // Executa a query de inserção.
    const result = await query(
      'INSERT INTO pedido_has_produto (pedido_id_pedido, produto_id_produto, quantidade, preco_unitario) VALUES ($1, $2, $3,$4) RETURNING *',
      [pedido_id_pedido, produto_id_produto, quantidade, preco_unitario]
    );


    // Retorna o item recém-criado.
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar pedido_has_produto:', error);

    // Trata erros de PK duplicada (se a combinação de pedido_id e produto_id já existe).
    if (error.code === '23505') {
      return res.status(409).json({ error: 'O item do pedido já existe. Use a função de atualização para modificar.' });
    }

    // Trata erros de foreign key (se o pedido ou produto não existirem).
    if (error.code === '23503') {
      return res.status(400).json({ error: 'O ID do pedido ou do produto não existe.' });
    }

    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};


/////////////////////////////////////////////////////////////////////
// função para obter itens de um pedido específico
/////////////////////////////////////////////////////////////////////

exports.obterItensDeUmPedido_has_produto = async (req, res) => {
  try {
    console.log("Requisição recebida para obter itens de um pedido especifico: rota pedido_has_produto/:idPedido");
    // 1. Extrai o ID do pedido dos parâmetros da requisição
    const { idPedido } = req.params;

    // 2. A query SQL com o parâmetro seguro ($1)
    const result = await query(
      'SELECT php.pedido_id_pedido , php.produto_id_produto , nome_produto , php.quantidade , php.preco_unitario' +
      ' FROM pedido_has_produto php, produto p ' +
      ' WHERE php.pedido_id_pedido = $1 and  php.produto_id_produto = p.id_produto ORDER BY php.produto_id_produto;',
      [idPedido]
    );

    // 4. Verifica se foram encontrados itens
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Nenhum item encontrado para este pedido.' });
    }

    // 5. Retorna os itens encontrados
    res.status(200).json(result.rows);

  } catch (error) {
    // 6. Em caso de erro, retorna uma mensagem de erro genérica
    console.error('Erro ao obter itens do pedido:', error);
    res.status(500).json({ message: 'Erro ao processar a requisição.', error: error.message });
  }
};

exports.obterPedido_has_produto = async (req, res) => {
  try {
    console.log("Requisição recebida para obter pedido_has_produto (chave composta): rota pedido_has_produto/:id_pedido/:id_produto");
    
    //chave composta id_pedido e id_produto
    const { id_pedido, id_produto } = req.params;
    const idPedido = parseInt(id_pedido);
    const idProduto = parseInt(id_produto);

    //console.log("estou no obter pedido_has_produto =>" + " IdPedido=" + idPedido + " idProduto= " + idProduto);
    // Verifica se ambos os IDs são números válidos
    if (isNaN(idPedido) || isNaN(idProduto)) {
      return res.status(400).json({ error: 'IDs devem ser números válidos' });
    }

    const result = await query(
      'SELECT php.pedido_id_pedido , php.produto_id_produto , nome_produto , php.quantidade , php.preco_unitario' +
      ' FROM pedido_has_produto php, produto p ' +
      ' WHERE php.pedido_id_pedido = $1 AND php.produto_id_produto=$2 AND php.produto_id_produto = p.id_produto;',
      [idPedido, idProduto]
    );

    //console.log(result)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido_has_produto não encontrado' });
    }

    res.json(result.rows); //retorna todos os itens do pedido
  } catch (error) {
    console.error('Erro ao obter pedido_has_produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.atualizarPedido_has_produto = async (req, res) => {
  try {
    // Imprime todos os parâmetros da requisição para debugar
    console.log("---------------rota atualizar produto ------------------------");
    // console.log("Requisição recebida para atualizar item:");
    // console.log("Parâmetros da URL (req.params):", req.params);
    // console.log("Corpo da requisição (req.body):", req.body);
    // console.log("---------------------------------------");

    // Extraímos ambos os IDs dos parâmetros da requisição, considerando a PK composta
    const { id_pedido, id_produto } = req.params;
    const dadosParaAtualizar = req.body;

    //    console.log("id_pedido:", id_pedido, "id_produto:", id_produto);
    //    console.log("dadosParaAtualizar:", dadosParaAtualizar);

    // Verifica se ambos os IDs são números válidos
    if (isNaN(parseInt(id_pedido)) || isNaN(parseInt(id_produto))) {
      return res.status(400).json({ error: 'IDs devem ser números válidos' });
    }

    // Verifica se a pedido_has_produto existe  


    // Verifica se a pedido_has_produto existe
    const existingPersonResult = await query(
      'SELECT * FROM pedido_has_produto WHERE pedido_id_pedido = $1 AND produto_id_produto = $2',
      [id_pedido, id_produto]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido_has_produto não encontrado' });
    }

    // Constrói a query de atualização dinamicamente para campos id_pedido, id_produto, quantidade, preco_unitario  
    const updatedFields = {};
    if (dadosParaAtualizar.quantidade !== undefined) {
      updatedFields.quantidade = dadosParaAtualizar.quantidade;
    }
    if (dadosParaAtualizar.preco_unitario !== undefined) {
      updatedFields.preco_unitario = dadosParaAtualizar.preco_unitario;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo válido para atualizar' });
    }

    // console.log("Campos a serem atualizados:", updatedFields);
    //  console.log("ID da pedido_has_produto a ser atualizada:", id_pedido, id_produto);


    // Atualiza a pedido_has_produto
    const updateResult = await query( // Ajuste na query para considerar a PK composta
      'UPDATE pedido_has_produto SET quantidade = $1, preco_unitario = $2 WHERE pedido_id_pedido = $3 AND produto_id_produto = $4 RETURNING *',
      [updatedFields.quantidade, updatedFields.preco_unitario, id_pedido, id_produto]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar pedido_has_produto:', error);


    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.deletarPedido_has_produto = async (req, res) => {
  try {
    // 1. Extraímos ambos os IDs da chave primária composta da URL
    const { id_pedido, id_produto } = req.params;

    // Imprime os IDs para depuração
    console.log("---------------- rota deletar pedido -----------------------");
    // console.log("Requisição recebida para deletar item:");
    // console.log("Parâmetros da URL (req.params):", req.params);
    // console.log("---------------------------------------");

    // 2. Verifica se ambos os IDs são números válidos
    if (isNaN(parseInt(id_pedido)) || isNaN(parseInt(id_produto))) {
      return res.status(400).json({ error: 'IDs de pedido e produto devem ser números válidos.' });
    }

    // 3. Verifica se o item do pedido existe antes de tentar deletar
    const existingItemResult = await query(
      'SELECT * FROM pedido_has_produto WHERE pedido_id_pedido = $1 AND produto_id_produto = $2',
      [id_pedido, id_produto]
    );

    if (existingItemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item do pedido não encontrado.' });
    }

    // 4. Deleta o item usando a chave primária composta
    const deleteResult = await query(
      'DELETE FROM pedido_has_produto WHERE pedido_id_pedido = $1 AND produto_id_produto = $2',
      [id_pedido, id_produto]
    );

    // Se a deleção foi bem-sucedida (uma linha afetada), retorna 204
    if (deleteResult.rowCount > 0) {
      res.status(204).send();
    } else {
      // Caso raro, se a verificação inicial passou mas a deleção não afetou nenhuma linha
      res.status(404).json({ error: 'Item do pedido não encontrado para exclusão.' });
    }

  } catch (error) {
    console.error('Erro ao deletar item do pedido:', error);

    // A maioria dos erros aqui será interna, já que a verificação de FK não se aplica
    // diretamente, pois a tabela de junção não tem dependentes.
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// ... código anterior do controller ...

/////////////////////////////////////////////////////////////////////
// Função para criar múltiplos itens de pedido em lote 
///////////////////////////////////////////////////////////////////// 
exports.criarItensPedidoEmLote = async (req, res) => {

  console.log("Rota criarItensPedidoEmLote chamada: /pedido_has_produto/lote");

  
  try {
    const itens = req.body; // Espera-se um array de objetos aqui
    
    // 1. Validação
    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ error: 'O corpo da requisição deve ser um array não vazio de itens de pedido.' });
    }

    // 2. Preparar a query de inserção em massa
    let values = []; // Array para armazenar os valores
    let placeholders = []; // Array para armazenar os placeholders ($1, $2, ...)
    let parameterIndex = 1;

    for (const item of itens) {
      // Verifica se o objeto item possui os campos mínimos necessários
      if (!item.id_pedido || !item.id_produto || !item.quantidade || !item.preco) {
        return res.status(400).json({ error: 'Cada item deve conter id_pedido, id_produto, quantidade e preco.' });
      }

      // Adiciona os valores na ordem correta: pedido_id_pedido, produto_id_produto, quantidade, preco_unitario
      // Nota: o campo 'preco' no seu JSON de exemplo deve mapear para 'preco_unitario' na sua tabela.
      values.push(item.id_pedido, item.id_produto, item.quantidade, item.preco);

      // Constrói a string de placeholders para o item: ($1, $2, $3, $4)
      placeholders.push(`($${parameterIndex++}, $${parameterIndex++}, $${parameterIndex++}, $${parameterIndex++})`);
    }

    // 3. Constrói a query final
    const sql = `
      INSERT INTO pedido_has_produto 
      (pedido_id_pedido, produto_id_produto, quantidade, preco_unitario) 
      VALUES ${placeholders.join(', ')} 
      RETURNING *
    `;

    // 4. Executa a query
    const result = await query(sql, values);

    // 5. Retorna os itens recém-criados
    res.status(201).json({ 
      message: `${result.rowCount} itens inseridos com sucesso!`, 
      itens_criados: result.rows 
    });
  } catch (error) {
    console.error('Erro ao criar itens de pedido em lote:', error);
    
    // Tratamento de erros (adaptado da sua função anterior)
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Um ou mais itens do pedido já existem (chave duplicada).' });
    }
    if (error.code === '23503') {
      return res.status(400).json({ error: 'O ID do pedido ou do produto em um dos itens não existe.' });
    }

    res.status(500).json({ error: 'Erro interno do servidor ao processar o lote.' });
  }
};
// ... restante do código do controller ...