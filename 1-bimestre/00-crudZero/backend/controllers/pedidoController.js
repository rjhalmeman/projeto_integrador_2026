//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');

exports.abrirCrudPedido = (req, res) => {
  // console.log('pedidoController - Rota /abrirCrudPedido - abrir o crudPedido');
  
  const usuario = req.cookies.usuarioLogado; // O cookie deve conter o nome/ID do usuário
  
  // Se o cookie 'usuario' existe (o valor é uma string/nome do usuário)
  if (usuario) {
   res.sendFile(path.join(__dirname, '../../frontend/pedido/pedido.html'));   
  } else {
    // Cookie não existe. Usuário NÃO está logado.
    res.redirect('/login');
  }
  
}

exports.listarPedidos = async (req, res) => {
  try {
    const result = await query('SELECT * FROM pedido ORDER BY id_pedido');
    //  console.log('Resultado do SELECT:', result.rows);//verifica se está retornando algo
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


exports.criarPedido = async (req, res) => {
    console.log('Criando pedido visao gerente com dados:', req.body);
  try {
    const { id_pedido, data_pedido, cliente_pessoa_cpf_pessoa, funcionario_pessoa_cpf_pessoa } = req.body;

    const result = await query(
      'INSERT INTO pedido (id_pedido, data_pedido, cliente_pessoa_cpf_pessoa, funcionario_pessoa_cpf_pessoa) VALUES ($1, $2, $3,$4) RETURNING *',
      [id_pedido, data_pedido, cliente_pessoa_cpf_pessoa, funcionario_pessoa_cpf_pessoa]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);



    // Verifica se é erro de violação de constraint NOT NULL
    if (error.code === '23502') {
      return res.status(400).json({
        error: 'Dados obrigatórios não fornecidos'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// FUNÇÃO 2: CRIAR PEDIDO ONLINE (E-COMMERCE - Utiliza CPF de Funcionário Padrão)
exports.criarPedidoOnline = async (req, res) => {
  console.log('Criando pedido ONLINE com dados:', req.body);
  const cpf_funcionario_default = '00000000000'; // CPF default para pedidos online (deve existir no banco)
  
  try {
    const { data_pedido, cliente_pessoa_cpf_pessoa } = req.body;

    // CORREÇÃO: Usamos o keyword DEFAULT para que o PostgreSQL force o uso da sequência (autoincremento).
    const sql = 'INSERT INTO pedido (id_pedido, data_pedido, cliente_pessoa_cpf_pessoa, funcionario_pessoa_cpf_pessoa) VALUES (DEFAULT, $1, $2, $3) RETURNING *';

    console.log('SQL a ser executado:', sql);

    const result = await query(
      sql,  [data_pedido, cliente_pessoa_cpf_pessoa, cpf_funcionario_default]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar pedido (online):', error);

    // Verifica se é erro de violação de constraint NOT NULL
    if (error.code === '23502') {
      return res.status(400).json({
        error: 'Dados obrigatórios não fornecidos'
      });
    }
    
    // IMPORTANTE: Se o CPF default não existir na tabela 'funcionario', 
    // o erro '23503' (Foreign Key Violation) será lançado aqui.
    if (error.code === '23503') {
      return res.status(400).json({
        error: `CPF de funcionário padrão (${cpf_funcionario_default}) não encontrado. Certifique-se de que ele existe na tabela 'funcionario'.`
      });
    }


    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


exports.obterPedido = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // console.log("estou no obter pedido id="+ id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    const result = await query(
      'SELECT * FROM pedido WHERE id_pedido = $1',
      [id]
    );

    //console.log(result)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.atualizarPedido = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const { data_pedido, cliente_pessoa_cpf_pessoa, funcionario_pessoa_cpf_pessoa } = req.body;

    // Verifica se o pedido existe
    const existing = await query('SELECT * FROM pedido WHERE id_pedido = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    // Atualiza o pedido
    const sql = `
      UPDATE pedido
      SET data_pedido = $1,
          cliente_pessoa_cpf_pessoa = $2,
          funcionario_pessoa_cpf_pessoa = $3
      WHERE id_pedido = $4
      RETURNING *
    `;
    const values = [data_pedido, cliente_pessoa_cpf_pessoa, funcionario_pessoa_cpf_pessoa, id];

    const updateResult = await query(sql, values);
    return res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};


exports.deletarPedido = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Verifica se a pedido existe
    const existingPersonResult = await query(
      'SELECT * FROM pedido WHERE id_pedido = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrada' });
    }

    // Deleta a pedido (as constraints CASCADE cuidarão das dependências)
    await query(
      'DELETE FROM pedido WHERE id_pedido = $1',
      [id]
    );

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);

    // Verifica se é erro de violação de foreign key (dependências)
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Não é possível deletar pedido com dependências associadas'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


