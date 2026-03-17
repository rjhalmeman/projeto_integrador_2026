const db = require('../database.js');


const path = require('path');

exports.abrirTelaLogin = (req, res) => {
  // console.log('loginController - Rota /login - Acessando login.html');
  res.sendFile(path.join(__dirname, '../../frontend/login/login.html'));
};

exports.abrirVisaoCliente = (req, res) => {
  console.log('loginController - Rota /login - visão do cliente');
  res.sendFile(path.join(__dirname, '../../frontend/visaoCliente/index.html'));
};

exports.abrirVisaoClienteCarrinho = (req, res) => {
  console.log('loginController - Rota /login - visão do cliente - carrinho');
  res.sendFile(path.join(__dirname, '../../frontend/visaoCliente/carrinho/carrinho.html'));

};

exports.abrirVisaoClienteFinalizar = (req, res) => {
  console.log('loginController - Rota /login - visão do cliente - finalizar');
  res.sendFile(path.join(__dirname, '../../frontend/visaoCliente/finalizar/finalizar.html'));

};


exports.abrirVisaoClientePagamento = (req, res) => {
  console.log('loginController - Rota /login - visão do cliente - pagamento');
  res.sendFile(path.join(__dirname, '../../frontend/visaoCliente/pagamento/pagamento.html'));

};


exports.verificaSeUsuarioEstaLogado = (req, res) => {
  //console.log('loginController -> verificaSeUsuarioEstaLogado - Verificando se usuário está logado via cookie');

  const usuario = req.cookies.usuarioLogado; // O cookie deve conter o nome/ID do usuário

  // Se o cookie 'usuario' existe (o valor é uma string/nome do usuário)
  if (usuario) {
    console.log('loginController -> verificaSeUsuarioEstaLogado - Usuário está logado:', usuario);
    // Usuário está logado. Retorna 'ok' e os dados do usuário.
    // É importante garantir que o valor do cookie 'usuarioLogado' seja o nome/ID do usuário.
    res.json({
      status: 'ok',
      usuario: usuario // Retorna o valor do cookie, que é o nome/ID do usuário
    });
  } else {
    // Cookie não existe. Usuário NÃO está logado.
    // res.json({
    //   status: 'nao_logado',
    //   mensagem: 'Usuário não autenticado.'
    // });

    res.redirect('/login');
  }
}
exports.verificarEmail = async (req, res) => {
  const { email } = req.body;

  const sql = 'SELECT nome_pessoa FROM pessoa WHERE email_pessoa = $1'; // Postgres usa $1, $2...

  console.log('rota verificarEmail: ', sql, email);

  try {
    const result = await db.query(sql, [email]); // igual listarPessoas

    if (result.rows.length > 0) {
      return res.json({ status: 'existe', nome: result.rows[0].nome_pessoa });
    }

    res.json({ status: 'nao_encontrado' });
  } catch (err) {
    console.error('Erro em verificarEmail:', err);
    res.status(500).json({ status: 'erro', mensagem: err.message });
  }
};


// Verificar senha
exports.verificarSenha = async (req, res) => {
  const { email, senha } = req.body;

  const sqlPessoa = `
    SELECT cpf_pessoa, nome_pessoa 
    FROM pessoa 
    WHERE email_pessoa = $1 AND senha_pessoa = $2
  `;
  const sqlCliente = `
    SELECT * 
    FROM cliente 
    WHERE pessoa_cpf_pessoa = $1
  `;

  const sqlFuncionario = `
    SELECT c.id_cargo , c.nome_cargo 
    FROM funcionario f, cargo c
    WHERE pessoa_cpf_pessoa = $1 and c.id_cargo = f.cargo_id_cargo ;`;

  //console.log('Rota verificarSenha:', sqlPessoa, email, senha);

  try {
    // 1. Verifica se existe pessoa com email/senha
    const resultPessoa = await db.query(sqlPessoa, [email, senha]);

    if (resultPessoa.rows.length === 0) {
      return res.json({ status: 'senha_incorreta' });
    }

    const { cpf_pessoa, nome_pessoa } = resultPessoa.rows[0];
    console.log('loginController -> Usuário encontrado:', resultPessoa.rows[0]);

    // 2. Verifica se é cliente
    const resultCliente = await db.query(sqlCliente, [cpf_pessoa]);

    let ehCliente = null;
    if (resultCliente.rows.length === 0) {
      ehCliente = false;
    } else {
      ehCliente = true;
    }

    // 2b. Verifica se é funcionário
    const resultFuncionario = await db.query(sqlFuncionario, [cpf_pessoa]);


    let funcionario = {};
    if (resultFuncionario.rows.length > 0) {
      funcionario = resultFuncionario.rows[0];
      console.log('Usuário é funcionário:', funcionario);
      console.log(`Cargo do funcionário: ID=${funcionario.id_cargo}, Nome=${funcionario.nome_cargo}`);
    } else {
      // Se não for funcionário, cria um objeto padrão 
      funcionario = {        
        id_cargo: -1,
        nome_cargo: 'Cliente'
      };

      console.log('loginController -> Usuário não é funcionário.');
    }


    //console.log(`loginController -> verificaSenha - Tipo de usuário - Cliente: ${ehCliente}`);
      
    
      
    const dadosUsuario = {
      cpf_pessoa: cpf_pessoa,
      nome: nome_pessoa,
      ehCliente: ehCliente,
      ehFuncionario: funcionario
    };

    // 3. Define cookie
    res.cookie('usuarioLogado', JSON.stringify(dadosUsuario), {
      sameSite: 'None',
      secure: true,
      httpOnly: true,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
    });

    console.log("Cookie 'usuarioLogado' definido com sucesso");

    // 4. Retorna dados para o frontend, o cookie será enviado ao frontend
    return res.json({
      status: 'ok',
      nome: nome_pessoa,
    });

  } catch (err) {
    console.error('Erro ao verificar senha:', err);
    return res.status(500).json({ status: 'erro', mensagem: err.message });
  }
}


// Logout
exports.logout = (req, res) => {
  res.clearCookie('usuarioLogado', {
    sameSite: 'None',
    secure: true,
    httpOnly: true,
    path: '/',
  });
  console.log("Cookie 'usuarioLogado' removido com sucesso");
  res.json({ status: 'deslogado' });
}


exports.criarPessoa = async (req, res) => {
  //  console.log('Criando pessoa com dados:', req.body);
  try {
    const { cpf_pessoa, nome_pessoa, email_pessoa, senha_pessoa, primeiro_acesso_pessoa = true, data_nascimento } = req.body;

    // Validação básica
    if (!nome_pessoa || !email_pessoa || !senha_pessoa) {
      return res.status(400).json({
        error: 'Nome, email e senha são obrigatórios'
      });
    }

    // Validação de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_pessoa)) {
      return res.status(400).json({
        error: 'Formato de email inválido'
      });
    }

    const result = await db.query(
      'INSERT INTO pessoa (cpf_pessoa, nome_pessoa, email_pessoa, senha_pessoa, primeiro_acesso_pessoa, data_nascimento) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [cpf_pessoa, nome_pessoa, email_pessoa, senha_pessoa, primeiro_acesso_pessoa, data_nascimento]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar pessoa:', error);

    // Verifica se é erro de email duplicado (constraint unique violation)
    if (error.code === '23505' && error.constraint === 'pessoa_email_pessoa_key') {
      return res.status(400).json({
        error: 'Email já está em uso'
      });
    }

    // Verifica se é erro de violação de constraint NOT NULL
    if (error.code === '23502') {
      return res.status(400).json({
        error: 'Dados obrigatórios não fornecidos'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.obterPessoa = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'loginController-obterPessoa - ID deve ser um número válido' });
    }

    const result = await db.query(
      'SELECT * FROM pessoa WHERE cpf_pessoa = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter pessoa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};


// Função adicional para buscar pessoa por email
exports.obterPessoaPorEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    const result = await db.query(
      'SELECT * FROM pessoa WHERE email_pessoa = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter pessoa por email:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Função para atualizar apenas a senha
exports.atualizarSenha = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { senha_atual, nova_senha } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    if (!senha_atual || !nova_senha) {
      return res.status(400).json({
        error: 'Senha atual e nova senha são obrigatórias'
      });
    }

    // Verifica se a pessoa existe e a senha atual está correta
    const personResult = await db.query(
      'SELECT * FROM pessoa WHERE cpf_pessoa = $1',
      [id]
    );

    if (personResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    const person = personResult.rows[0];

    // Verificação básica da senha atual (em produção, use hash)
    if (person.senha_pessoa !== senha_atual) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }

    // Atualiza apenas a senha
    const updateResult = await db.query(
      'UPDATE pessoa SET senha_pessoa = $1 WHERE cpf_pessoa = $2 RETURNING cpf_pessoa, nome_pessoa, email_pessoa, primeiro_acesso_pessoa, data_nascimento',
      [nova_senha, id]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

