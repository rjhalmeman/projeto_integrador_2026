//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');

exports.abrirCrudForma_pagamento = (req, res) => {
 // console.log('forma_pagamentoController - Rota /abrirCrudForma_pagamento - abrir o crudForma_pagamento');
 const usuario = req.cookies.usuarioLogado; // O cookie deve conter o nome/ID do usuário
 
 // Se o cookie 'usuario' existe (o valor é uma string/nome do usuário)
 if (usuario) {
    res.sendFile(path.join(__dirname, '../../frontend/forma_pagamento/forma_pagamento.html'));
  } else {
    // Cookie não existe. Usuário NÃO está logado.
    res.redirect('/login');
  }

}

exports.listarForma_pagamento = async (req, res) => {
  try {
    const result = await query('SELECT * FROM forma_pagamento ORDER BY id_forma_pagamento');
   //  console.log('Resultado do SELECT:', result.rows);//verifica se está retornando algo
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar forma_pagamentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


exports.criarForma_pagamento = async (req, res) => {
  //  console.log('Criando forma_pagamento com dados:', req.body);
  try {
    const { id_forma_pagamento, nome_forma_pagamento} = req.body;

    // Validação básica
    if (!nome_forma_pagamento) {
      return res.status(400).json({
        error: 'O nome do forma_pagamento é obrigatório'
      });
    }

    const result = await query(
      'INSERT INTO forma_pagamento (id_forma_pagamento, nome_forma_pagamento) VALUES ($1, $2) RETURNING *',
      [id_forma_pagamento, nome_forma_pagamento]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar forma_pagamento:', error);

   

    // Verifica se é erro de violação de constraint NOT NULL
    if (error.code === '23502') {
      return res.status(400).json({
        error: 'Dados obrigatórios não fornecidos'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.obterForma_pagamento = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

   // console.log("estou no obter forma_pagamento id="+ id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    const result = await query(
      'SELECT * FROM forma_pagamento WHERE id_forma_pagamento = $1',
      [id]
    );

    //console.log(result)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Forma_pagamento não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter forma_pagamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.atualizarForma_pagamento = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome_forma_pagamento} = req.body;

   
    // Verifica se a forma_pagamento existe
    const existingPersonResult = await query(
      'SELECT * FROM forma_pagamento WHERE id_forma_pagamento = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Forma_pagamento não encontrada' });
    }

    // Constrói a query de atualização dinamicamente para campos não nulos
    const currentPerson = existingPersonResult.rows[0];
    const updatedFields = {
      nome_forma_pagamento: nome_forma_pagamento !== undefined ? nome_forma_pagamento : currentPerson.nome_forma_pagamento     
    };

    // Atualiza a forma_pagamento
    const updateResult = await query(
      'UPDATE forma_pagamento SET nome_forma_pagamento = $1 WHERE id_forma_pagamento = $2 RETURNING *',
      [updatedFields.nome_forma_pagamento,  id]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar forma_pagamento:', error);

  
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.deletarForma_pagamento = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Verifica se a forma_pagamento existe
    const existingPersonResult = await query(
      'SELECT * FROM forma_pagamento WHERE id_forma_pagamento = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Forma_pagamento não encontrada' });
    }

    // Deleta a forma_pagamento (as constraints CASCADE cuidarão das dependências)
    await query(
      'DELETE FROM forma_pagamento WHERE id_forma_pagamento = $1',
      [id]
    );

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar forma_pagamento:', error);

    // Verifica se é erro de violação de foreign key (dependências)
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Não é possível deletar forma_pagamento com dependências associadas'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


