// ==================== CADASTROS.JS - FUNÃÃES PARA FORMULÃRIOS ====================

// ==================== FUNÇÕES GLOBAIS ====================

// Função para selecionar tipo de formulário (CPF/CNPJ)
function selecionarTipoFormulario(tipo, entidade) {
    const btnCPF = document.getElementById(`btnCPF_${entidade}`);
    const btnCNPJ = document.getElementById(`btnCNPJ_${entidade}`);
    
    if (btnCPF && btnCNPJ) {
        if (tipo === 'cpf') {
            btnCPF.classList.add('active');
            btnCNPJ.classList.remove('active');
        } else {
            btnCNPJ.classList.add('active');
            btnCPF.classList.remove('active');
        }
    }
    
    const inputDoc = document.getElementById(`doc_${entidade}_cadastro`);
    if (inputDoc) {
        if (tipo === 'cpf') {
            inputDoc.placeholder = "000.000.000-00";
            inputDoc.maxLength = 14;
            inputDoc.value = "";
        } else {
            inputDoc.placeholder = "00.000.000/0000-00";
            inputDoc.maxLength = 18;
            inputDoc.value = "";
        }
    }
    
    const labelNome = document.getElementById(`labelNome_${entidade}`);
    const labelData = document.getElementById(`labelData_${entidade}`);
    const labelIdade = document.getElementById(`labelIdade_${entidade}`);
    
    if (tipo === 'cpf') {
        if (labelNome) labelNome.textContent = 'Nome Completo';
        if (labelData) labelData.textContent = 'Data de Nascimento';
        if (labelIdade) labelIdade.textContent = 'Idade';
    } else {
        if (labelNome) labelNome.textContent = 'Nome da Empresa';
        if (labelData) labelData.textContent = 'Data de Abertura';
        if (labelIdade) labelIdade.textContent = 'Tempo de Empresa';
    }
}

// Função para calcular idade ou tempo de empresa
function calcularIdadeOuTempo(entidade) {
    const dataInput = document.getElementById(`data_nascimento_${entidade}`);
    
    if (!dataInput || !dataInput.value) return;
    
    const data = dataInput.value;
    const hoje = new Date();
    const dataInformada = new Date(data);
    let resultado = hoje.getFullYear() - dataInformada.getFullYear();
    const m = hoje.getMonth() - dataInformada.getMonth();
    
    if (m < 0 || (m === 0 && hoje.getDate() < dataInformada.getDate())) {
        resultado--;
    }
    
    const campoIdade = document.getElementById(`idade_${entidade}`);
    if (campoIdade) {
        campoIdade.value = resultado;
    }
}

// ==================== FUNÇÃO DE VALIDAÇÃO ====================

function validarCamposObrigatorios(formularioId, camposObrigatorios) {
    const camposVazios = [];
    
    console.log('Validando campos obrigatórios:', camposObrigatorios);
    
    camposObrigatorios.forEach(campoId => {
        const campo = document.getElementById(campoId);
        console.log(`Campo ${campoId}:`, campo ? `valor="${campo.value}" readonly=${campo.readOnly}` : 'NÃO ENCONTRADO');
        
        // Ignorar campos readonly que foram preenchidos automaticamente
        if (campo && campo.readOnly && campo.value.trim()) {
            console.log(`Campo ${campoId} é readonly e tem valor, ignorando validação`);
            campo.style.border = "";
            return;
        }
        
        if (!campo || !campo.value.trim()) {
            camposVazios.push(campoId);
            if (campo) campo.style.border = "2px solid red";
        } else {
            if (campo) campo.style.border = "";
        }
    });
    
    console.log('Campos vazios encontrados:', camposVazios);
    return camposVazios;
}

function verificarDocumentoDuplicado(documento, tipo, idAtual = null) {
    // Remove formatação para comparar apenas números
    const documentoLimpo = documento.replace(/\D/g, '');
    
    // Busca em todos os cadastros existentes
    const cadastros = JSON.parse(localStorage.getItem(tipo)) || [];
    
    // Verifica se já existe um cadastro com este documento (ignorando o próprio em caso de edição)
    const duplicado = cadastros.some(item => {
        const itemDoc = (item.documento || '').replace(/\D/g, '');
        return itemDoc === documentoLimpo && item.id !== idAtual;
    });
    
    return duplicado;
}

// ==================== FUNÇÃOPARA SALVAR ====================

function salvarDadosGenerico(entidade) {
    console.log('Iniciando salvamento para:', entidade);
    
    // Defina os campos obrigatórios para cada tipo de cadastro
    const camposObrigatorios = {
        'clientes': [`nome_${entidade}`, `doc_${entidade}_cadastro`],
        'casa_de_festas': [`nome_${entidade}`, `doc_${entidade}_cadastro`],
        'elenco': [`nome_${entidade}`, `doc_${entidade}_cadastro`],
        'motoristas': [`nome_${entidade}`, `doc_${entidade}_cadastro`, `cnh_${entidade}`],
        'fornecedores': [`nome_${entidade}`, `doc_${entidade}_cadastro`],
        'funcionarios': [`nome_${entidade}`, `doc_${entidade}_cadastro`]
    };
    
    // Validar campos obrigatórios
    const camposVazios = validarCamposObrigatorios(entidade, camposObrigatorios[entidade] || []);
    
    if (camposVazios.length > 0) {
        console.log('Campos vazios:', camposVazios);
        alert('Preencha todos os campos obrigatórios!');
        return false;
    }
    
    // Validar documento duplicado
    const documento = document.getElementById(`doc_${entidade}_cadastro`).value;
    const idAtual = document.getElementById(`ID_${entidade}`)?.value || '';
    
    if (verificarDocumentoDuplicado(documento, entidade, idAtual)) {
        alert('Já existe um cadastro com este CPF/CNPJ!');
        return false;
    }
    
    // Mapear entidade para ID do formulário
    const mapeamentoForms = {
        'clientes': 'clienteForm',
        'casa_de_festas': 'casa_de_festasForm',
        'elenco': 'elencoForm',
        'personagens': 'personagensForm',
        'motoristas': 'motoristasForm',
        'fornecedores': 'fornecedoresForm',
        'funcionarios': 'funcionariosForm'
    };
    
    const formId = mapeamentoForms[entidade] || `${entidade}Form`;
    const form = document.getElementById(formId);
    
    if (!form) {
        console.error(`Formulário ${formId} não encontrado`);
        alert(`Erro: Formulário não encontrado (${formId})`);
        return false;
    }
    
    // Gerar ID se não existir (APENAS PARA NOVOS CADASTROS)
    const idField = document.getElementById(`ID_${entidade}`);
    let id = idField ? idField.value : '';
    
    // Se não tem ID ou está vazio, é um novo cadastro
    const isNovoRegistro = !id || id === '';
    
    if (isNovoRegistro) {
        id = (typeof gerarID === 'function') ? gerarID(entidade) : `${entidade.substring(0,3).toUpperCase()}-${Date.now()}`;
        if (idField) idField.value = id;
        console.log('Novo ID gerado:', id);
    } else {
        console.log('Editando registro existente com ID:', id);
    }
    
    // Coletar todos os dados do formulário
    const campos = form.querySelectorAll('input, select, textarea');
    const dados = { 
        id: id, 
        documento: documento,
        dataCadastro: new Date().toISOString() 
    };
    
    campos.forEach(campo => {
        if (campo.id && !campo.id.startsWith('ID_') && !campo.id.startsWith('btn') && !campo.id.startsWith('loading')) {
            let valor = campo.value;
            
            // Remover formatação de documentos antes de salvar
            if (campo.id.includes('doc_') && campo.id.includes('_cadastro')) {
                valor = valor.replace(/\D/g, ''); // Remove pontos, traços e barras
            }
            
            dados[campo.id] = valor;
        }
    });
    
    console.log('Dados coletados:', dados);
    
    // Salvar no localStorage
    const chaveStorage = `${entidade}_cadastrados`;
    let registros = JSON.parse(localStorage.getItem(chaveStorage) || '[]');
    
    const index = registros.findIndex(r => r.id === id || r[`ID_${entidade}`] === id);
    
    if (index !== -1) {
        // Atualizar registro existente mantendo o ID
        registros[index] = { ...registros[index], ...dados, id: id };
        console.log('Registro atualizado no índice:', index);
    } else {
        // Adicionar novo registro
        registros.push(dados);
        console.log('Novo registro adicionado');
    }
    
    localStorage.setItem(chaveStorage, JSON.stringify(registros));
    console.log('Salvo no localStorage:', chaveStorage);
    
    // Se for elenco e faz drive, criar motorista
    if (entidade === 'elenco' && dados.faz_drive_elenco === 'sim') {
        criarMotoristaApartirElenco();
    }
    
    // Limpar formulário APENAS se for novo cadastro
    if (isNovoRegistro) {
        form.reset();
        
        // Gerar novo ID
        if (idField) {
            const novoId = (typeof gerarID === 'function') ? gerarID(entidade) : `${entidade.substring(0,3).toUpperCase()}-${Date.now()}`;
            idField.value = novoId;
        }
        
        // Resetar botões CPF/CNPJ para CPF
        const btnCPF = document.getElementById(`btnCPF_${entidade}`);
        const btnCNPJ = document.getElementById(`btnCNPJ_${entidade}`);
        if (btnCPF && btnCNPJ) {
            btnCPF.classList.add('active');
            btnCNPJ.classList.remove('active');
        }
        
        alert('Dados salvos com sucesso!');
    } else {
        // Limpar formulário também após edição
        form.reset();
        
        // Gerar novo ID para próximo cadastro
        if (idField) {
            const novoId = (typeof gerarID === 'function') ? gerarID(entidade) : `${entidade.substring(0,3).toUpperCase()}-${Date.now()}`;
            idField.value = novoId;
        }
        
        // Resetar botões CPF/CNPJ para CPF
        const btnCPF = document.getElementById(`btnCPF_${entidade}`);
        const btnCNPJ = document.getElementById(`btnCNPJ_${entidade}`);
        if (btnCPF && btnCNPJ) {
            btnCPF.classList.add('active');
            btnCNPJ.classList.remove('active');
        }
        
        alert('Dados atualizados com sucesso!');
    }
    
    return false;
}

// ==================== FUNÇOES PARA O CAMPO "FAZ DRIVE" NO ELENCO ====================

// Função para mostrar/esconder campos do motorista
function toggleCamposMotorista() {
    console.log("Função toggleCamposMotorista chamada");
    
    const selectFazDrive = document.getElementById('faz_drive_elenco');
    const camposMotorista = document.getElementById('campos_motorista');
    
    if (!selectFazDrive || !camposMotorista) {
        console.error("Elementos não encontrados");
        return;
    }
    
    const fazDrive = selectFazDrive.value;
    const inputs = camposMotorista.querySelectorAll('input');
    
    if (fazDrive === 'sim') {
        camposMotorista.style.display = 'block';
        inputs.forEach(input => {
            input.required = true;
            input.setAttribute('required', 'required');
        });
    } else {
        camposMotorista.style.display = 'none';
        inputs.forEach(input => {
            input.required = false;
            input.removeAttribute('required');
            input.value = '';
        });
    }
}

// Função para validar campos do motorista antes de salvar o elenco
function validarCamposMotorista() {
    const fazDrive = document.getElementById('faz_drive_elenco').value;
    
    if (fazDrive === 'sim') {
        const cnh = document.getElementById('cnh_motorista_elenco').value;
        const modelo = document.getElementById('modelo_carro_elenco').value;
        const placa = document.getElementById('placa_carro_elenco').value;
        
        if (!cnh || !modelo || !placa) {
            alert('Preencha todos os dados do motorista (CNH, Modelo e Placa)!');
            return false;
        }
        
        // Valida formato da placa
        const placaRegex = /^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/;
        const placaLimpa = placa.replace('-', '');
        if (!placaRegex.test(placaLimpa)) {
            alert('Formato de placa inválido! Use o formato ABC1234 ou ABC1D23');
            return false;
        }
    }
    
    return true;
}

// Função para criar cadastro de motorista automaticamente
function criarMotoristaApartirElenco() {
    const fazDrive = document.getElementById('faz_drive_elenco').value;
    
    if (fazDrive !== 'sim') {
        return true;
    }
    
    const documento = document.getElementById('doc_elenco_cadastro').value;
    const documentoLimpo = documento.replace(/\D/g, '');
    
    let motoristas = JSON.parse(localStorage.getItem('motoristas_cadastrados')) || [];
    const motoristaExistente = motoristas.find(m => 
        (m.documento || '').replace(/\D/g, '') === documentoLimpo
    );
    
    if (motoristaExistente) {
        console.log("Motorista já existe com este CPF");
        return true;
    }
    
    const novoMotorista = {
        id: gerarIdMotorista(),
        nome: document.getElementById('nome_elenco').value,
        documento: documento,
        cnh: document.getElementById('cnh_motorista_elenco').value,
        veiculo: document.getElementById('modelo_carro_elenco').value,
        placa: document.getElementById('placa_carro_elenco').value,
        telefone: document.getElementById('telefone_elenco').value,
        email: document.getElementById('email_elenco').value || '',
        origem: 'elenco',
        dataCadastro: new Date().toISOString()
    };
    
    motoristas.push(novoMotorista);
    localStorage.setItem('motoristas_cadastrados', JSON.stringify(motoristas));
    
    console.log("Motorista criado com sucesso:", novoMotorista);
    return true;
}

// Função auxiliar para gerar ID de motorista
function gerarIdMotorista() {
    const motoristas = JSON.parse(localStorage.getItem('motoristas_cadastrados')) || [];
    if (motoristas.length === 0) return 1;
    return Math.max(...motoristas.map(m => m.id)) + 1;
}

// Função específica para salvar elenco (opcional, mas pode ser usada)
function salvarElencoCompleto() {
    // Valida campos do motorista se necessário
    if (!validarCamposMotorista()) {
        return false;
    }
    
    // Chama a função genérica
    return salvarDadosGenerico('elenco');
}

// ==================== INICIALIZAÃÃO ====================

// Executar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log("Página carregada, inicializando eventos...");
    
    // Garante que os campos do motorista comecem ocultos
    const camposMotorista = document.getElementById('campos_motorista');
    if (camposMotorista) {
        camposMotorista.style.display = 'none';
    }
    
    // Adiciona evento ao select "Faz Drive" se ele existir
    const selectFazDrive = document.getElementById('faz_drive_elenco');
    if (selectFazDrive) {
        // Remove qualquer evento anterior e adiciona o novo
        selectFazDrive.removeEventListener('change', toggleCamposMotorista);
        selectFazDrive.addEventListener('change', toggleCamposMotorista);
        console.log("Evento adicionado ao select faz_drive_elenco");
    }
    
    // Adicionar eventos de cálculo automático de idade para todas as entidades
    const entidades = ['clientes', 'casa_de_festas', 'elenco', 'motoristas', 'fornecedores', 'funcionarios'];
    entidades.forEach(entidade => {
        const campoData = document.getElementById(`data_nascimento_${entidade}`);
        if (campoData) {
            campoData.addEventListener('change', function() {
                calcularIdadeOuTempo(entidade);
            });
            campoData.addEventListener('blur', function() {
                calcularIdadeOuTempo(entidade);
            });
            console.log(`Eventos de cálculo de idade adicionados para ${entidade}`);
        }
    });
});

// Exportar funções para o escopo global
window.selecionarTipoFormulario = selecionarTipoFormulario;
window.calcularIdadeOuTempo = calcularIdadeOuTempo;
window.salvarDadosGenerico = salvarDadosGenerico;
window.toggleCamposMotorista = toggleCamposMotorista;
window.validarCamposMotorista = validarCamposMotorista;
window.salvarElencoCompleto = salvarElencoCompleto;

// ==================== FUNÃÃES PARA LIMPAR FORMULÃRIOS ====================

function limparFormularioCliente() {
    const form = document.getElementById('clienteForm');
    if (form) {
        form.reset();
        
        // Gerar novo ID
        const idField = document.getElementById('ID_clientes');
        if (idField) {
            const novoId = (typeof gerarID === 'function') ? gerarID('clientes') : `CLI-${Date.now()}`;
            idField.value = novoId;
        }
        
        // Resetar botões CPF/CNPJ para CPF
        const btnCPF = document.getElementById('btnCPF_clientes');
        const btnCNPJ = document.getElementById('btnCNPJ_clientes');
        if (btnCPF && btnCNPJ) {
            btnCPF.classList.add('active');
            btnCNPJ.classList.remove('active');
        }
        
        console.log('Formulário de cliente limpo');
    }
}

function limparFormularioCasaDeFestas() {
    const form = document.getElementById('casa_de_festasForm');
    if (form) {
        form.reset();
        
        // Gerar novo ID
        const idField = document.getElementById('ID_casa_de_festas');
        if (idField) {
            const novoId = (typeof gerarID === 'function') ? gerarID('casa_de_festas') : `CAS-${Date.now()}`;
            idField.value = novoId;
        }
        
        // Resetar botões CPF/CNPJ para CPF
        const btnCPF = document.getElementById('btnCPF_casa_de_festas');
        const btnCNPJ = document.getElementById('btnCNPJ_casa_de_festas');
        if (btnCPF && btnCNPJ) {
            btnCPF.classList.add('active');
            btnCNPJ.classList.remove('active');
        }
        
        console.log('Formulário de casa de festas limpo');
    }
}

// Exportar funções de limpar
window.limparFormularioCliente = limparFormularioCliente;
window.limparFormularioCasaDeFestas = limparFormularioCasaDeFestas;

console.log('cadastros.js carregado e corrigido com sucesso');
    