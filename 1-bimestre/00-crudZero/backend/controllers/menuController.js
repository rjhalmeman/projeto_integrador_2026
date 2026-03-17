
// menuController.js
const path = require('path');

exports.abrirMenu = (req, res) => {
 //   console.log('menuController - Rota / - Menu Acessando menu.html');

    const usuario = req.cookies.usuarioLogado; // aqui o backend lê o cookie
    // Se o cookie 'usuario' existe (o valor é uma string/nome do usuário)
    if (usuario) {
        res.sendFile(path.join(__dirname, '../../frontend/menu.html'));
    } else {
        // Cookie não existe. Usuário NÃO está logado.
        res.redirect('/login');
    }

};


exports.logout = (req, res) => {
    // Implementação da rota logout
    res.send('Rota logout');
};





// app.get('/inicio', (req, res) => {
//     console.log('rota menu/inicio - Acessando index.html');
//     res.sendFile(path.join(__dirname, '../index.html'));
// });

// let mnemonicoProfessorGlobal = null;
// // Rota de menu (protege via cookie) - checkAuth 
// app.get('/usuarioLogado', (req, res) => {
//     console.log('Acessando rota /usuarioLogado');
//     const nome = req.cookies.usuarioLogado;
//     if (nome) {
//         res.json({ status: 'ok', nome, mnemonicoProfessor: mnemonicoProfessorGlobal });
//     } else {
//         res.json({ status: 'nao_logado' });
//     }
// });


// // Rota de logout
// app.post('/logout', (req, res) => {
//     console.log('Rota de logout acessada');
//     res.clearCookie('usuarioLogado');
//     mnemonicoProfessorGlobal = null;
//     res.json({ status: 'ok', message: 'Usuário deslogado com sucesso' });
// });