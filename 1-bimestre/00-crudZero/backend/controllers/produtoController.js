//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');

exports.abrirCrudProduto = (req, res) => {
  // console.log('produtoController - Rota /abrirCrudProduto - abrir o crudProduto');

  const usuario = req.cookies.usuarioLogado; // O cookie deve conter o nome/ID do usuário

  // Se o cookie 'usuario' existe (o valor é uma string/nome do usuário)
  if (usuario) {
    res.sendFile(path.join(__dirname, '../../frontend/produto/produto.html'));
  } else {
    // Cookie não existe. Usuário NÃO está logado.
    res.redirect('/login');
  }

}

exports.listarProdutos = async (req, res) => {
  try {
    const result = await query('SELECT * FROM produto ORDER BY id_produto');
    //  console.log('Resultado do SELECT:', result.rows);//verifica se está retornando algo
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


exports.criarProduto = async (req, res) => {
  //  console.log('Criando produto com dados:', req.body);
  try {
    const { id_produto, nome_produto, quantidade_estoque_produto, preco_unitario_produto } = req.body;

    // Validação básica
    if (!nome_produto) {
      return res.status(400).json({
        error: 'O nome do produto é obrigatório'
      });
    }

    const result = await query(
      'INSERT INTO produto (id_produto, nome_produto, quantidade_estoque_produto, preco_unitario_produto) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_produto, nome_produto, quantidade_estoque_produto, preco_unitario_produto]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar produto:', error);



    // Verifica se é erro de violação de constraint NOT NULL
    if (error.code === '23502') {
      return res.status(400).json({
        error: 'Dados obrigatórios não fornecidos'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.obterProduto = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // console.log("estou no obter produto id="+ id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    const result = await query(
      'SELECT * FROM produto WHERE id_produto = $1',
      [id]
    );

    //console.log(result)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.atualizarProduto = async (req, res) => {

  // console.log(req.body)
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const { nome_produto, quantidade_estoque_produto, preco_unitario_produto } = req.body;

    // Verifica se o produto existe
    const existing = await query('SELECT * FROM produto WHERE id_produto = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Monta UPDATE dinâmico apenas com campos válidos
    const updates = [];
    const values = [];
    let idx = 1;

    if (nome_produto != null && String(nome_produto).trim() !== '') {
      updates.push(`nome_produto = $${idx++}`);
      values.push(String(nome_produto).trim());
    }

    // quantidade_estoque_produto: aceitar apenas inteiro válido
    if (quantidade_estoque_produto != null && String(quantidade_estoque_produto).trim() !== '') {
      const qtyStr = String(quantidade_estoque_produto).replace(',', '.').trim();
      const qty = Number(qtyStr);
      if (!Number.isInteger(qty)) {
        return res.status(400).json({ error: 'quantidade_estoque_produto deve ser um inteiro válido' });
      }
      updates.push(`quantidade_estoque_produto = $${idx++}`);
      values.push(qty);
    }

    // preco_unitario_produto: aceitar número válido (float), >= 0
    if (preco_unitario_produto != null && String(preco_unitario_produto).trim() !== '') {
      const priceStr = String(preco_unitario_produto).replace(',', '.').trim();
      const price = Number(priceStr);
      if (!Number.isFinite(price)) {
        return res.status(400).json({ error: 'preco_unitario_produto deve ser um número válido' });
      }
      if (price < 0) {
        return res.status(400).json({ error: 'preco_unitario_produto não pode ser negativo' });
      }
      updates.push(`preco_unitario_produto = $${idx++}`);
      values.push(price);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo válido para atualizar' });
    }

    values.push(id);
    const sql = `UPDATE produto SET ${updates.join(', ')} WHERE id_produto = $${idx} RETURNING *`;

    const updateResult = await query(sql, values);
    return res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};


exports.deletarProduto = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Verifica se a produto existe
    const existingPersonResult = await query(
      'SELECT * FROM produto WHERE id_produto = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrada' });
    }

    // Deleta a produto (as constraints CASCADE cuidarão das dependências)
    await query(
      'DELETE FROM produto WHERE id_produto = $1',
      [id]
    );

    // Fazemos isso APÓS a exclusão do DB. Se o DB falhar, não apagamos o arquivo.
    // Usamos o ID do produto para encontrar o arquivo nomeado como 'id.png'
    await deletarImagemProduto(id);

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar produto:', error);

    // Verifica se é erro de violação de foreign key (dependências)
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Não é possível deletar produto com dependências associadas'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
