document.addEventListener('DOMContentLoaded', function() {
    const statusLink = document.getElementById('acompanhar-status-link');
    const statusPopup = document.getElementById('status-popup');
    const closePopupBtn = document.getElementById('close-popup');
    const protocoloForm = document.getElementById('protocolo-form');
    const statusResults = document.getElementById('status-results');
    const protocoloExibido = document.getElementById('protocolo-exibido');
    const denunciaForm = document.getElementById('denuncia-form');

    function gerarProtocolo() {
        const agora = new Date();

        const ano = agora.getFullYear();
        const mes = String(agora.getMonth() + 1).padStart(2, '0');
        const dia = String(agora.getDate()).padStart(2, '0');

        const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);

        return `${ano}${mes}${dia}-${numeroAleatorio}`;
    }

    function openPopup() {
        if (statusPopup) statusPopup.style.display = 'flex';
        if (statusResults) statusResults.classList.add('hidden');
    }

    function closePopup() {
        if (statusPopup) statusPopup.style.display = 'none';
    }

    if (statusLink) {
        statusLink.addEventListener('click', function(event) {
            event.preventDefault();
            openPopup();
        });
    }

    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', closePopup);
    }

    if (statusPopup) {
        statusPopup.addEventListener('click', function(event) {
            if (event.target === statusPopup) {
                closePopup();
            }
        });
    }

    if (protocoloForm) {
        protocoloForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const inputProtocolo = document.getElementById('protocolo-number').value.trim();

            if (inputProtocolo === "") {
                alert("Por favor, digite um número de protocolo.");
                return;
            }

            const protocolosSalvos = JSON.parse(localStorage.getItem('protocolos')) || [];

            const encontrado = protocolosSalvos.find(p => p.codigo === inputProtocolo);

            if (encontrado) {
                statusResults.classList.remove('hidden');
                protocoloExibido.innerText = encontrado.codigo;
            } else {
                alert("Protocolo inválido.");
                statusResults.classList.add('hidden');
            }
        });
    }

    if (denunciaForm) {
        denunciaForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const bairro = document.getElementById('bairro').value.trim();
            const rua = document.getElementById('rua').value.trim();
            const descricao = document.getElementById('descricao').value.trim();

            //  NOVO: pegar categoria
            const categoriaSelecionada = document.querySelector('input[name="categoria"]:checked');

            if (!categoriaSelecionada) {
                alert("Por favor, selecione o tipo de denúncia.");
                return;
            }

            const categoria = categoriaSelecionada.value;

            if (bairro === "" || rua === "" || descricao === "") {
                alert("Por favor, preencha Bairro, Rua e a Descrição.");
                return;
            }

            const novoProtocolo = gerarProtocolo();

            //  AGORA SALVA OBJETO (com categoria)
            const protocolosSalvos = JSON.parse(localStorage.getItem('protocolos')) || [];

            const novaDenuncia = {
                codigo: novoProtocolo,
                categoria: categoria,
                bairro: bairro,
                rua: rua,
                descricao: descricao,
                status: "Em análise"
            };

            protocolosSalvos.push(novaDenuncia);
            localStorage.setItem('protocolos', JSON.stringify(protocolosSalvos));

            alert(`Denúncia enviada com sucesso!\nCategoria: ${categoria}\nProtocolo: ${novoProtocolo}`);

            if (protocoloExibido) protocoloExibido.innerText = novoProtocolo;

            openPopup();
            if (statusResults) statusResults.classList.remove('hidden');

            denunciaForm.reset();
        });
    }

    const attachmentBlocks = document.querySelectorAll('.attachment-block');
    attachmentBlocks.forEach(block => {
        block.addEventListener('click', function() {
            const attachmentType = this.querySelector('span').innerText.split(' ')[1];
            alert(`Simulação de anexo: O arquivo de ${attachmentType.toLowerCase()} foi "anexado".`);
        });
    });
});

// CONSULTA GLOBAL (FUNCIONA NA STATUS.HTML)
window.consultarStatusGeral = function() {
    const protocolo = document.getElementById('input-busca-protocolo').value.trim();
    const resultado = document.getElementById('status-resultado-final');

    const protocolosSalvos = JSON.parse(localStorage.getItem('protocolos')) || [];

    const encontrado = protocolosSalvos.find(p => p.codigo === protocolo);

    if (encontrado) {
        resultado.classList.remove('hidden');
        document.getElementById('span-protocolo').innerText = encontrado.codigo;
    } else {
        alert("Protocolo inválido.");
        resultado.classList.add('hidden');
    }
}