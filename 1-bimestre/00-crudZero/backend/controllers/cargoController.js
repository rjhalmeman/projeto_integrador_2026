//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');

exports.abrirCrudCargo = (req, res) => {
  // console.log('cargoController - Rota /abrirCrudCargo - abrir o crudCargo');
  const usuario = req.cookies.usuarioLogado; // O cookie deve conter o nome/ID do usuário

  // Se o cookie 'usuario' existe (o valor é uma string/nome do usuário)
  if (usuario) {
    res.sendFile(path.join(__dirname, '../../frontend/cargo/cargo.html'));
  } else {
    // Cookie não existe. Usuário NÃO está logado.
    res.redirect('/login');
  }
}

exports.listarCargos = async (req, res) => {
  try {
    const result = await query('SELECT * FROM cargo ORDER BY id_cargo');
    //  console.log('Resultado do SELECT:', result.rows);//verifica se está retornando algo
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar cargos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


exports.criarCargo = async (req, res) => {
  //  console.log('Criando cargo com dados:', req.body);
  try {
    const { id_cargo, nome_cargo } = req.body;

    // Validação básica
    if (!nome_cargo) {
      return res.status(400).json({
        error: 'O nome do cargo é obrigatório'
      });
    }

    const result = await query(
      'INSERT INTO cargo (id_cargo, nome_cargo) VALUES ($1, $2) RETURNING *',
      [id_cargo, nome_cargo]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar cargo:', error);



    // Verifica se é erro de violação de constraint NOT NULL
    if (error.code === '23502') {
      return res.status(400).json({
        error: 'Dados obrigatórios não fornecidos'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.obterCargo = async (req, res) => {
  try {
    console.log(req.params.id);
    const id = parseInt(req.params.id);

    // console.log("estou no obter cargo id="+ id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    const result = await query(
      'SELECT * FROM cargo WHERE id_cargo = $1',
      [id]
    );

    //console.log(result)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cargo não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter cargo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.atualizarCargo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome_cargo } = req.body;


    // Verifica se a cargo existe
    const existingPersonResult = await query(
      'SELECT * FROM cargo WHERE id_cargo = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cargo não encontrada' });
    }

    // Constrói a query de atualização dinamicamente para campos não nulos
    const currentPerson = existingPersonResult.rows[0];
    const updatedFields = {
      nome_cargo: nome_cargo !== undefined ? nome_cargo : currentPerson.nome_cargo
    };

    // Atualiza a cargo
    const updateResult = await query(
      'UPDATE cargo SET nome_cargo = $1 WHERE id_cargo = $2 RETURNING *',
      [updatedFields.nome_cargo, id]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar cargo:', error);


    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.deletarCargo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Verifica se a cargo existe
    const existingPersonResult = await query(
      'SELECT * FROM cargo WHERE id_cargo = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cargo não encontrada' });
    }

    // Deleta a cargo (as constraints CASCADE cuidarão das dependências)
    await query(
      'DELETE FROM cargo WHERE id_cargo = $1',
      [id]
    );

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar cargo:', error);

    // Verifica se é erro de violação de foreign key (dependências)
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Não é possível deletar cargo com dependências associadas'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


