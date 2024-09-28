const API_URL_CLIENTES = 'http://localhost:3000/clientes';

// Cadastro de usuários
function cadastrarUsuario(username, senha) {
    fetch(API_URL_CLIENTES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, senha })
    })
    .then(response => response.json())
    .then(cliente => {
        alert('Usuário cadastrado com sucesso!');
        // Aqui você pode redirecionar para o login ou já logar o usuário
    })
    .catch(error => console.error('Erro ao cadastrar usuário:', error));
}
