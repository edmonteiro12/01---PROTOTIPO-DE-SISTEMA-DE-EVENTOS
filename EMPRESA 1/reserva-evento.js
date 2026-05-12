// ==================== RESERVA DE EVENTO ====================

// Carregar casas de festa no select
function carregarCasasDeFesta() {
    const casas = JSON.parse(localStorage.getItem('casa_de_festas_cadastrados') || '[]');
    const select = document.getElementById('casa_festa_select');
    
    if (!select) return;
    
    select.innerHTML = '<option value="">selecione</option>';
    
    casas.forEach(casa => {
        const option = document.createElement('option');
        option.value = casa.id || casa.ID_casa_de_festas;
        option.textContent = casa.nome_casa_de_festas || 'Casa sem nome';
        option.dataset.casa = JSON.stringify(casa);
        select.appendChild(option);
    });
}

// Carregar personagens no select
function carregarPersonagens() {
    const personagens = JSON.parse(localStorage.getItem('personagens_cadastrados') || '[]');
    const select = document.getElementById('personagem_select');
    
    if (!select) return;
    
    select.innerHTML = '<option value="">selecione</option>';
    
    personagens.forEach(personagem => {
        const option = document.createElement('option');
        option.value = personagem.id || personagem.ID_personagens;
        option.textContent = personagem.nome_personagens || 'Personagem sem nome';
        option.dataset.personagem = JSON.stringify(personagem);
        select.appendChild(option);
    });
}

// Calcular hora de saída automaticamente
function calcularHoraSaida() {
    const horaEvento = document.getElementById('hora_evento').value;
    const duracao = parseFloat(document.getElementById('duracao').value) || 0;
    
    if (!horaEvento || duracao <= 0) {
        document.getElementById('hora_saida').value = '';
        return;
    }
    
    const [horas, minutos] = horaEvento.split(':').map(Number);
    const totalMinutos = (horas * 60) + minutos + (duracao * 60);
    
    const novasHoras = Math.floor(totalMinutos / 60) % 24;
    const novosMinutos = totalMinutos % 60;
    
    const horaSaida = `${String(novasHoras).padStart(2, '0')}:${String(novosMinutos).padStart(2, '0')}`;
    document.getElementById('hora_saida').value = horaSaida;
}

// Mostrar detalhes do personagem selecionado
function mostrarDetalhesPersonagem() {
    const select = document.getElementById('personagem_select');
    const selectedOption = select.options[select.selectedIndex];
    
    if (!selectedOption.value) {
        document.getElementById('tema_personagem').value = '';
        document.getElementById('figurino_personagem').value = '';
        return;
    }
    
    const personagem = JSON.parse(selectedOption.dataset.personagem);
    
    document.getElementById('tema_personagem').value = personagem.tema || '';
    document.getElementById('figurino_personagem').value = personagem.figurino || '';
    
    const campoValor = document.getElementById('valor_personagem');
    if (campoValor && personagem.valor_personagens) {
        campoValor.value = personagem.valor_personagens;
    }
}

// Adicionar casa selecionada
function adicionarCasaSelecionada() {
    const select = document.getElementById('casa_festa_select');
    const dadosContainer = document.getElementById('dadosCasaSelecionada');
    
    if (!select || !dadosContainer) return;
    
    const selectedOption = select.options[select.selectedIndex];
    
    if (!selectedOption.value) {
        alert('Selecione uma casa de festa!');
        return;
    }
    
    const casa = JSON.parse(selectedOption.dataset.casa);
    
    dadosContainer.innerHTML = `
        <div style="background: #e8f4fd; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
            <h4>Casa Selecionada:</h4>
            <p><strong>Nome:</strong> ${casa.nome_casa_de_festas || '-'}</p>
            <p><strong>Telefone:</strong> ${casa.telefone_casa_de_festas || '-'}</p>
            <p><strong>Endereço:</strong> ${casa.logradouro_casa_de_festas || ''}, ${casa.numero_casa_de_festas || ''} - ${casa.cidade_casa_de_festas || ''}</p>
            <button class="btn" onclick="removerCasaSelecionada()">Remover</button>
        </div>
    `;
    
    // Ocultar outro local
    document.getElementById('outro_local_container').style.display = 'none';
}

// Remover casa selecionada
function removerCasaSelecionada() {
    document.getElementById('dadosCasaSelecionada').innerHTML = '';
    document.getElementById('casa_festa_select').value = '';
}

// Toggle outro local
function toggleOutroLocal() {
    const container = document.getElementById('outro_local_container');
    
    if (container.style.display === 'none' || !container.style.display) {
        container.style.display = 'block';
        // Limpar casa selecionada
        removerCasaSelecionada();
    } else {
        container.style.display = 'none';
    }
}

// Alternar entre CPF e CNPJ em Reservar Evento
function selecionarTipoFormulario(tipo, modulo) {
    const btnCpf = document.getElementById(`btnCpf_${modulo}`);
    const btnCnpj = document.getElementById(`btnCnpj_${modulo}`);
    const inputCpf = document.getElementById(`doc_${modulo}_cadastros_cpf`);
    const inputCnpj = document.getElementById(`doc_${modulo}_cadastros_cnpj`);
    
    if (!btnCpf || !btnCnpj) return;
    
    btnCpf.classList.remove('active');
    btnCnpj.classList.remove('active');
    
    if (tipo === 'cpf') {
        btnCpf.classList.add('active');
        if (inputCpf) {
            inputCpf.style.display = 'inline-block';
            inputCpf.value = '';
        }
        if (inputCnpj) {
            inputCnpj.style.display = 'none';
            inputCnpj.value = '';
        }
    } else {
        btnCnpj.classList.add('active');
        if (inputCpf) {
            inputCpf.style.display = 'none';
            inputCpf.value = '';
        }
        if (inputCnpj) {
            inputCnpj.style.display = 'inline-block';
            inputCnpj.value = '';
        }
    }
}

// Formatar documento enquanto digita
function formatDocumentFormulario(modulo) {
    const inputCpf = document.getElementById(`doc_${modulo}_cadastros_cpf`);
    const inputCnpj = document.getElementById(`doc_${modulo}_cadastros_cnpj`);
    
    if (inputCpf && inputCpf.style.display !== 'none') {
        let valor = inputCpf.value.replace(/\D/g, '');
        if (valor.length <= 11) {
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        inputCpf.value = valor;
    }
    
    if (inputCnpj && inputCnpj.style.display !== 'none') {
        let valor = inputCnpj.value.replace(/\D/g, '');
        if (valor.length <= 14) {
            valor = valor.replace(/(\d{2})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d)/, '$1/$2');
            valor = valor.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
        }
        inputCnpj.value = valor;
    }
}

// Buscar cliente por documento
function searchClientes() {
    const inputCpf = document.getElementById('doc_evento_cadastros_cpf');
    const inputCnpj = document.getElementById('doc_evento_cadastros_cnpj');
    
    let docValue = '';
    if (inputCpf && inputCpf.style.display !== 'none') {
        docValue = inputCpf.value;
    } else if (inputCnpj && inputCnpj.style.display !== 'none') {
        docValue = inputCnpj.value;
    }
    
    if (!docValue) {
        alert('Digite um CPF ou CNPJ!');
        return;
    }
    
    const doc = docValue.replace(/\D/g, '');
    const clientes = JSON.parse(localStorage.getItem('clientes_cadastrados') || '[]');
    
    const cliente = clientes.find(c => {
        const docCliente = (c.doc_clientes_cadastro || c.doc_clientes_cadastros_cpf || c.doc_clientes_cadastros_cnpj || '').replace(/\D/g, '');
        return docCliente === doc;
    });
    
    const clienteInfo = document.getElementById('clienteInfo');
    const clienteNotFound = document.getElementById('clienteNotFound');
    const dadosClienteEvento = document.getElementById('dadosClienteEvento');
    
    if (cliente) {
        // Cliente encontrado
        if (clienteNotFound) clienteNotFound.style.display = 'none';
        if (clienteInfo) clienteInfo.style.display = 'none';
        if (dadosClienteEvento) dadosClienteEvento.style.display = 'block';
        
        // Mostrar dados completos na tela
        if (dadosClienteEvento) {
            dadosClienteEvento.innerHTML = `
                <h5 style="margin:0 0 0.5rem 0;">Dados do Cliente:</h5>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.5rem;">
                    <div class="form-group">
                        <label>Nome Completo</label>
                        <input type="text" id="nome_cliente_evento" value="${cliente.nome_clientes || ''}" readonly style="background:#f8f9fa;" />
                    </div>
                    <div class="form-group">
                        <label>Documento</label>
                        <input type="text" value="${cliente.doc_clientes_cadastro || cliente.doc_clientes_cadastros_cpf || cliente.doc_clientes_cadastros_cnpj || ''}" readonly style="background:#f8f9fa;" />
                    </div>
                    <div class="form-group">
                        <label>Telefone</label>
                        <input type="text" id="telefone_cliente_evento" value="${cliente.telefone_cliente || ''}" readonly style="background:#f8f9fa;" />
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="text" id="email_cliente_evento" value="${cliente.email_cliente || ''}" readonly style="background:#f8f9fa;" />
                    </div>
                    <div class="form-group">
                        <label>CEP</label>
                        <input type="text" value="${cliente.cep_cliente || ''}" readonly style="background:#f8f9fa;" />
                    </div>
                    <div class="form-group">
                        <label>Endereço</label>
                        <input type="text" value="${cliente.logradouro_cliente || ''}, ${cliente.numero_cliente || ''}" readonly style="background:#f8f9fa;" />
                    </div>
                    <div class="form-group">
                        <label>Bairro</label>
                        <input type="text" value="${cliente.bairro_cliente || ''}" readonly style="background:#f8f9fa;" />
                    </div>
                    <div class="form-group">
                        <label>Cidade/Estado</label>
                        <input type="text" value="${cliente.cidade_cliente || ''} - ${cliente.estado_cliente || ''}" readonly style="background:#f8f9fa;" />
                    </div>
                </div>
            `;
        }
        
        alert('Cliente encontrado!');
    } else {
        // Cliente não encontrado
        if (clienteInfo) clienteInfo.style.display = 'none';
        if (dadosClienteEvento) dadosClienteEvento.style.display = 'none';
        if (clienteNotFound) clienteNotFound.style.display = 'block';
    }
}

// Inicializar Ação carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Carregar casas de festa e personagens quando a página de eventos for aberta
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.id === 'reservar_evento' && mutation.target.classList.contains('active')) {
                carregarCasasDeFesta();
                carregarPersonagens();
            }
        });
    });
    
    const reservarEvento = document.getElementById('reservar_evento');
    if (reservarEvento) {
        observer.observe(reservarEvento, { attributes: true, attributeFilter: ['class'] });
        
        // Carregar imediatamente se já estiver ativa
        if (reservarEvento.classList.contains('active')) {
            carregarCasasDeFesta();
            carregarPersonagens();
        }
    }
});

// Formatar moeda com R$
function formatarMoeda(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = (parseInt(valor) / 100).toFixed(2);
    input.value = 'R$ ' + valor.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Calcular valores do evento automaticamente
function calcularValoresEvento() {
    const valorPersonagem = parseFloat(document.getElementById('valor_personagem')?.value || 0);
    const desconto = parseFloat(document.getElementById('desconto')?.value.replace(/[^0-9,]/g, '').replace(',', '.') || 0);
    const deslocamento = parseFloat(document.getElementById('deslocamento')?.value.replace(/[^0-9,]/g, '').replace(',', '.') || 0);
    const sinal = parseFloat(document.getElementById('valor_sinal')?.value.replace(/[^0-9,]/g, '').replace(',', '.') || 0);
    const valorAvulso = parseFloat(document.getElementById('valor_avulso')?.value.replace(/[^0-9,]/g, '').replace(',', '.') || 0);
    const sinalPago = document.getElementById('sinal_pago_status')?.value === 'true';
    const avulsoPago = document.getElementById('valor_avulso_pago')?.value === 'true';
    
    // Calcular total: valor do personagem - desconto + deslocamento
    const valorTotal = valorPersonagem - desconto + deslocamento;
    
    // Calcular valor que falta receber: total - sinal pago - avulso pago
    let valorFalta = valorTotal;
    if (sinalPago) valorFalta -= sinal;
    if (avulsoPago) valorFalta -= valorAvulso;
    
    // Atualizar campos
    document.getElementById('valor_total').value = 'R$ ' + valorTotal.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    document.getElementById('valor_falta_receber').value = 'R$ ' + valorFalta.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Exportar funções
window.calcularHoraSaida = calcularHoraSaida;
window.carregarCasasDeFesta = carregarCasasDeFesta;
window.carregarPersonagens = carregarPersonagens;
window.mostrarDetalhesPersonagem = mostrarDetalhesPersonagem;
window.adicionarCasaSelecionada = adicionarCasaSelecionada;
window.removerCasaSelecionada = removerCasaSelecionada;
window.toggleOutroLocal = toggleOutroLocal;
window.searchClientes = searchClientes;
window.selecionarTipoFormulario = selecionarTipoFormulario;
window.formatDocumentFormulario = formatDocumentFormulario;
window.formatarMoeda = formatarMoeda;
window.calcularValoresEvento = calcularValoresEvento;

console.log('reserva-evento.js carregado');

