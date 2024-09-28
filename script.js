const API_URL_CLIENTES = 'http://localhost:3000/clientes';
const API_URL_VIAGENS = 'http://localhost:3000/viagens';

let usuarioLogado = null;
let viagemAtual = null;

// Login de usuário
document.getElementById('loginBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const senha = document.getElementById('senha').value;

    fetch(API_URL_CLIENTES)
        .then(response => response.json())
        .then(clientes => {
            const cliente = clientes.find(c => c.username === username && c.senha === senha);
            if (cliente) {
                usuarioLogado = cliente;
                alert('Login bem-sucedido!');
                document.getElementById('loginDiv').classList.add('hidden');
                document.getElementById('cadastroDiv').classList.add('hidden');

                document.getElementById('selecaoViagemDiv').classList.remove('hidden');
                document.getElementById('historicoDiv').classList.remove('hidden');
                carregarViagens();
                
            } else {
                alert('Usuário ou senha inválidos.');
            }
        });
});

// Cadastro de usuário
document.getElementById('cadastrarBtn').addEventListener('click', () => {
    const username = document.getElementById('novoUsuario').value;
    const senha = document.getElementById('novaSenha').value;

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
        document.getElementById('novoUsuario').value = '';
        document.getElementById('novaSenha').value = '';
    })
    .catch(error => console.error('Erro ao cadastrar usuário:', error));
});

// Carregar Viagens
function carregarViagens() {
    const selecaoViagem = document.getElementById('selecaoViagem');
    selecaoViagem.innerHTML = '';

    const loadingOption = document.createElement('option');
    loadingOption.textContent = 'Carregando viagens...';
    selecaoViagem.appendChild(loadingOption);

    fetch(API_URL_VIAGENS)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }
            return response.json();
        })
        .then(viagens => {
            selecaoViagem.innerHTML = ''; // Limpa o seletor

            if (viagens.length === 0) {
                const noOption = document.createElement('option');
                noOption.textContent = 'Nenhuma viagem disponível.';
                selecaoViagem.appendChild(noOption);
                return;
            }

            viagens.forEach(viagem => {
                const option = document.createElement('option');
                option.value = viagem.id;
                option.textContent = `De ${viagem.origem} para ${viagem.destino} - ${viagem.dataInicio} a ${viagem.dataFim}`;
                selecaoViagem.appendChild(option);
            });
        })
        .catch(error => {
            console.error(error);
            selecaoViagem.innerHTML = ''; // Limpa o seletor
            const errorOption = document.createElement('option');
            errorOption.textContent = 'Erro ao carregar viagens. Tente novamente mais tarde.';
            selecaoViagem.appendChild(errorOption);
        });
}

// Confirmar Viagem
document.getElementById('confirmarViagemBtn').addEventListener('click', () => {
    const viagemId = document.getElementById('selecaoViagem').value;

    if (!viagemId) {
        alert('Por favor, selecione uma viagem.');
        return;
    }

    fetch(`${API_URL_VIAGENS}/${viagemId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(viagem => {
            if (!viagem.assentosDisponiveis || viagem.assentosDisponiveis.length === 0) {
                alert('Nenhum assento disponível para esta viagem.');
                return;
            }

            viagemAtual = viagem;
            alert('Viagem selecionada com sucesso!');
            //document.getElementById('selecaoViagemDiv').classList.add('hidden');
            document.getElementById('selecaoAssentosDiv').classList.remove('hidden');
            
            mostrarAssentos(viagem.assentosDisponiveis);
        })
        .catch(error => {
            console.error(error);
            alert('Ocorreu um erro: ' + error.message);
        });
});

// Função para mostrar os assentos disponíveis
function mostrarAssentos(assentos) {
  const assentosContainer = document.getElementById('assentosContainer');
  assentosContainer.innerHTML = ''; // Limpa os assentos existentes

  assentos.forEach(assento => {
      const div = document.createElement('div');
      div.classList.add('assento');
      div.textContent = assento;

      // Adiciona evento de clique para selecionar o assento
      div.addEventListener('click', () => {
          div.classList.toggle('selecionado'); // Alterna a seleção do assento
      });

      assentosContainer.appendChild(div); // Adiciona o assento ao contêiner
  });
}


// Mostrar assentos
function mostrarAssentos(assentos) {
    const assentosContainer = document.getElementById('assentosContainer');
    assentosContainer.innerHTML = '';

    const tipoAssentoSelect = document.getElementById('tipoAssento');
    tipoAssentoSelect.addEventListener('change', () => {
        const tipoAssento = tipoAssentoSelect.value;
        assentosContainer.innerHTML = '';

        // Assentos por tipo
        const assentosPorTipo = {

            "leito": ["1A", "1B", "1C", "1D"],
            "semi-leito": ["2A", "2B", "2C", "2D"]
        };

        assentosPorTipo[tipoAssento].forEach(assento => {
            const div = document.createElement('div');
            div.classList.add('assento');
            div.textContent = assento;
            div.addEventListener('click', () => {
                div.classList.toggle('selecionado');
            });
            assentosContainer.appendChild(div);
        });
    });

    tipoAssentoSelect.dispatchEvent(new Event('change')); // Trigger event to load default assentos
}

// Finalizar pagamento
document.getElementById('finalizarPagamento').addEventListener('click', () => {
    const assentosSelecionados = Array.from(document.querySelectorAll('.assento.selecionado'))
        .map(assento => assento.textContent);

    if (assentosSelecionados.length === 0) {
        alert('Por favor, selecione ao menos um assento.');
        return;
    }

    const formaPagamento = document.getElementById('formaPagamento').value;

    // Aqui você pode adicionar a lógica para salvar a reserva ou pagamento
    alert(`Pagamento realizado com sucesso! Assentos: ${assentosSelecionados.join(', ')}, Forma de Pagamento: ${formaPagamento}`);

    // Resetar estado
    document.getElementById('selecaoAssentosDiv').classList.add('hidden');
    document.getElementById('historicoDiv').classList.remove('hidden');
    mostrarHistorico(assentosSelecionados, formaPagamento);
});

// Mostrar histórico
function mostrarHistorico(assentosSelecionados, formaPagamento) {
    const listaHistorico = document.getElementById('listaHistorico');
    listaHistorico.innerHTML = '';

    const li = document.createElement('li');
    li.textContent = `Viagem de ${viagemAtual.origem} para ${viagemAtual.destino} com assentos: ${assentosSelecionados.join(', ')}. Pagamento: ${formaPagamento}`;
    listaHistorico.appendChild(li);
}
