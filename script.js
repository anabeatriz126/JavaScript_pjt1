document.addEventListener('DOMContentLoaded', () => {
    const viagensContainer = document.getElementById('viagens-container');
    const form = document.getElementById('nova-viagem-form');
  
    const API_URL = 'http://localhost:3000/viagens';
  
    // Função para carregar e exibir todas as viagens
    function carregarViagens() {
      fetch(API_URL)
        .then(response => response.json())
        .then(viagens => {
          viagensContainer.innerHTML = '';
          viagens.forEach(viagem => {
            const viagemDiv = document.createElement('div');
            viagemDiv.classList.add('viagem');
            viagemDiv.setAttribute('data-id', viagem.id); // Adiciona o atributo data-id
            viagemDiv.innerHTML = `
              <h3>${viagem.origem} ➡️ ${viagem.destino}</h3>
              <p>De: ${viagem.dataInicio} até ${viagem.dataFim}</p>
              <p>Progresso: ${viagem.progresso}% (Meta: ${viagem.meta}%)</p>
              
              <div class="progresso">
                <div class="progresso-bar" style="width: ${viagem.progresso}%;"></div>
              </div>
              <br>
              <p>
                Alterar Progresso:
                <input type="number" class="progresso-input" min="0" max="100" value="${viagem.progresso}" />
                <button class="atualizar-progresso" onclick="atualizarProgresso(${viagem.id})">Atualizar</button>
              </p>
              <br>
              <button onclick="excluirViagem(${viagem.id})">Excluir Viagem</button>
            `;
            viagensContainer.appendChild(viagemDiv);
          });
        });
    }
  
    // Função para adicionar uma nova viagem
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const novaViagem = {
        destino: document.getElementById('destino').value,
        origem: document.getElementById('origem').value,
        dataInicio: document.getElementById('dataInicio').value,
        dataFim: document.getElementById('dataFim').value,
        progresso: 0,  // Progresso começa em 0
        meta: 100      // Meta sempre 100%
      };
  
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaViagem)
      })
      .then(response => response.json())
      .then(() => {
        carregarViagens();
        form.reset();
      });
    });
  
    // Função para excluir uma viagem
    window.excluirViagem = (id) => {
      fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })
      .then(() => carregarViagens());
    };
  
    // Função para atualizar o progresso da viagem
    window.atualizarProgresso = (id) => {
      const viagemDiv = document.querySelector(`.viagem[data-id='${id}']`);
      const progressoInput = viagemDiv.querySelector('.progresso-input');
      const novoProgresso = parseInt(progressoInput.value);
  
      if (novoProgresso >= 0 && novoProgresso <= 100) {
        fetch(`${API_URL}/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ progresso: novoProgresso })
        })
        .then(() => carregarViagens());
      } else {
        alert('O progresso deve ser um valor entre 0 e 100.');
      }
    };
  
    // Carregar viagens ao iniciar
    carregarViagens();
  });
  