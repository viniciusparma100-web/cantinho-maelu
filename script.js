document.addEventListener('DOMContentLoaded', () => {
  let pedido = [];
  const taxaEntrega = 5;

  // Menu hambúrguer
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');
  menuBtn.addEventListener('click', () => menu.classList.toggle('show'));

  // Botões de redes sociais
  document.getElementById('btn-whatsapp').onclick = () =>
    window.open("https://wa.me/5519990149195?text=Olá! Quero fazer um pedido.", "_blank");

  document.getElementById('btn-instagram').onclick = () =>
    window.open("https://www.instagram.com/cantinhomaelu", "_blank");

  document.getElementById('btn-ifood').onclick = () =>
    window.open("https://www.ifood.com.br/delivery/santana-de-parnaiba-sp/cantinho-maelu", "_blank");

  // Mostrar apenas o cardápio do dia
  const hoje = new Date().getDay(); // 0 = domingo ... 6 = sábado

  function mostrarCardapioDoDia() {
    const itens = document.querySelectorAll(".dia-cardapio");

    itens.forEach(item => {
      const dia = Number(item.getAttribute("data-dia"));
      item.style.display = (dia === hoje) ? "block" : "none";
    });
  }

  mostrarCardapioDoDia();

  // Botões "Adicionar ao Pedido"
  document.querySelectorAll(".btn-adicionar").forEach(botao => {
    botao.addEventListener("click", () => {
      const nome = botao.dataset.nome;
      const preco = Number(botao.dataset.preco);
      adicionarItem(nome, preco);
    });
  });

  function adicionarItem(nome, preco) {
    pedido.push({ nome, preco });
    atualizarResumo();
  }

  function atualizarResumo() {
    const lista = document.getElementById("itens-pedido");
    lista.innerHTML = "";

    if (pedido.length === 0) {
      lista.innerHTML = '<li class="item-pedido-placeholder">Nenhum item adicionado ainda.</li>';
    }

    let total = 0;
    pedido.forEach((item, index) => {
      total += item.preco;

      const li = document.createElement("li");
      li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2).replace('.', ',')}`;

      const btnRemover = document.createElement("button");
      btnRemover.textContent = "X";
      btnRemover.classList.add("btn-remover");
      btnRemover.addEventListener("click", () => {
        pedido.splice(index, 1);
        atualizarResumo();
      });

      li.appendChild(btnRemover);
      lista.appendChild(li);
    });

    document.getElementById("total").textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
    document.getElementById("total-geral").textContent = `Total com entrega: R$ ${(total + taxaEntrega).toFixed(2).replace('.', ',')}`;
  }

  // Limpar pedido (se você adicionar botão)
  const btnLimpar = document.getElementById('btn-limpar-pedido');
  if (btnLimpar) {
    btnLimpar.onclick = () => {
      pedido = [];
      atualizarResumo();
    };
  }

  // Envio do pedido via WhatsApp
  const formPedido = document.getElementById('form-pedido');
  formPedido.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita recarregar a página

    const nomeCliente = document.getElementById('nome').value.trim();
    const telefoneCliente = document.getElementById('telefone').value.trim();
    const enderecoCliente = document.getElementById('endereco').value.trim();

    if (pedido.length === 0) {
      alert('Seu pedido está vazio! Por favor, adicione itens antes de enviar.');
      return;
    }

    // Montar lista de itens formatada
    const listaItens = pedido
      .map(item => `- ${item.nome} (R$ ${item.preco.toFixed(2).replace('.', ',')})`)
      .join('\n');

    // Calcular total
    const totalPedido = pedido.reduce((acc, item) => acc + item.preco, 0) + taxaEntrega;

    // Tempo estimado de entrega (fixo, por exemplo)
    const tempoEntrega = '45 minutos';

    // Montar mensagem para WhatsApp
    const mensagem = 
      `Olá, meu nome é ${nomeCliente}.
      Gostaria de fazer o pedido com os seguintes itens:
      ${listaItens}

      Endereço para entrega: ${enderecoCliente}

      Total com entrega: R$ ${totalPedido.toFixed(2).replace('.', ',')}

      Tempo estimado para entrega: ${tempoEntrega}

      Obrigado!`;

    const mensagemEncoded = encodeURIComponent(mensagem);

    // Número da empresa (fixo)
    const numeroEmpresa = '5519990149195';

    // Abre WhatsApp com mensagem pronta
    window.open(`https://wa.me/${numeroEmpresa}?text=${mensagemEncoded}`, '_blank');

    // Limpa pedido e formulário
    pedido = [];
    atualizarResumo();
    formPedido.reset();
  });

});
