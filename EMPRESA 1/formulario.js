// ==================== FORMULARIO.JS - SISTEMA DE CÁLCULOS ====================

// Variáveis globais para controle
let reservaConfigurada = false;

// Função para alternar entre CPF e CNPJ
function selecionarTipoFormulario(tipo, modulo) {
    // Pega os elementos
    const btnCpf = document.getElementById(`btnCpf_${modulo}`);
    const btnCnpj = document.getElementById(`btnCnpj_${modulo}`);
    const inputDoc = document.getElementById(`doc_${modulo}_cadastro`);
    
    // Remove a classe 'active' de ambos os botões
    btnCpf.classList.remove('active');
    btnCnpj.classList.remove('active');
    
    // Adiciona a classe 'active' apenas no botão clicado
    if (tipo === 'cpf') {
        btnCpf.classList.add('active');
        // Muda placeholder e maxlength para CPF
        inputDoc.placeholder = '000.000.000-00';
        inputDoc.maxLength = 14;
        inputDoc.value = ''; // Limpa o campo
    } else {
        btnCnpj.classList.add('active');
        // Muda placeholder e maxlength para CNPJ
        inputDoc.placeholder = '00.000.000/0000-00';
        inputDoc.maxLength = 18;
        inputDoc.value = ''; // Limpa o campo
    }
}

// Função para converter valor monetário string para número
function converterParaNumero(valorString) {
    if (!valorString || valorString.trim() === '') return 0;
    
    try {
        // Remove tudo exceto números, vírgula e ponto
        let valorLimpo = valorString.toString().replace(/[^\d,.-]/g, '');
        
        // Se terminar com vírgula ou ponto, remove
        valorLimpo = valorLimpo.replace(/[,.]$/, '');
        
        // Se tiver vírgula como separador decimal
        if (valorLimpo.includes(',') && !valorLimpo.includes('.')) {
            // Substitui vírgula por ponto para parseFloat
            valorLimpo = valorLimpo.replace(',', '.');
        }
        // Se tiver ponto como separador de milhar e vírgula como decimal
        else if (valorLimpo.includes('.') && valorLimpo.includes(',')) {
            // Remove pontos de milhar, mantém vírgula como decimal
            valorLimpo = valorLimpo.replace(/\./g, '').replace(',', '.');
        }
        
        const numero = parseFloat(valorLimpo);
        return isNaN(numero) ? 0 : numero;
    } catch (error) {
        console.error('Erro ao converter para número:', error, valorString);
        return 0;
    }
}

// Função para formatar número para moeda brasileira
function formatarParaMoeda(numero) {
    if (isNaN(numero)) numero = 0;
    return numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Função para formatar input enquanto digita
function formatarMoeda(input) {
    if (!input || !input.value) return;
    
    let value = input.value.replace(/\D/g, '');
    
    if (value === '') {
        input.value = '';
        return;
    }
    
    // Converte para número
    let numero = parseInt(value) / 100;
    
    // Formata como moeda brasileira
    input.value = numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Função para formatar input de moeda enquanto digita mantendo cursor
function formatarMoedaInput(input) {
    // Salva a posição do cursor
    const cursorPos = input.selectionStart;
    const originalLength = input.value.length;
    
    // Formata o valor
    formatarMoeda(input);
    
    // Restaura a posição do cursor (ajustada para a nova formatação)
    const newLength = input.value.length;
    const lengthDiff = newLength - originalLength;
    input.setSelectionRange(cursorPos + lengthDiff, cursorPos + lengthDiff);
}

// Função para obter valor do personagem do localStorage
function obterValorPersonagem(personagemId) {
    try {
        const personagens = JSON.parse(localStorage.getItem('personagens') || '[]');
        const personagem = personagens.find(p => 
            String(p.id) === String(personagemId) || 
            String(p.ID) === String(personagemId) ||
            String(p.codigo) === String(personagemId)
        );
        
        if (personagem) {
            // Retorna o valor do personagem
            if (personagem.valor_hora) return converterParaNumero(personagem.valor_hora);
            if (personagem.valor) return converterParaNumero(personagem.valor);
            if (personagem.preco) return converterParaNumero(personagem.preco);
        }
    } catch (error) {
        console.error('Erro ao obter valor do personagem:', error);
    }
    
    return 0;
}

// Função principal para calcular todos os valores - CORRIGIDA
function calcularValoresEvento() {
    console.log('CALCULANDO VALORES DO EVENTO');
    
    try {
        let valorTotal = 0;
        let valorAReceber = 0;
        
        // 1. SOMA DOS PERSONAGENS
        const personagensDivs = document.querySelectorAll('#personagensSelecionados .personagem-item');
        console.log(`Personagens encontrados: ${personagensDivs.length}`);
        
        personagensDivs.forEach((div, index) => {
            const personagemId = div.getAttribute('data-personagem-id');
            if (personagemId) {
                const valor = obterValorPersonagem(personagemId);
                valorTotal += valor;
                console.log(`   Personagem ${index + 1} (ID: ${personagemId}): ${formatarParaMoeda(valor)}`);
            }
        });
        
        // 2. ADICIONA DESLOCAMENTO
        const deslocamentoInput = document.getElementById('deslocamento');
        if (deslocamentoInput) {
            const deslocamento = converterParaNumero(deslocamentoInput.value);
            valorTotal += deslocamento;
            if (deslocamento > 0) {
                console.log(`   Deslocamento: +${formatarParaMoeda(deslocamento)}`);
            }
        }
        
        // 3. SUBTRAI DESCONTO
        const descontoInput = document.getElementById('desconto');
        if (descontoInput) {
            const desconto = converterParaNumero(descontoInput.value);
            valorTotal -= desconto;
            if (desconto > 0) {
                console.log(`   Desconto: -${formatarParaMoeda(desconto)}`);
            }
        }
        
        // Garante que o total não seja negativo
        valorTotal = Math.max(0, valorTotal);
        
        // VALOR A RECEBER COMEÇA IGUAL AO TOTAL
        valorAReceber = valorTotal;
        console.log(`VALOR TOTAL: ${formatarParaMoeda(valorTotal)}`);
        
        // 4. SUBTRAI SINAL SE PAGO
        const sinalPagoSelect = document.getElementById('sinal_pago_status');
        const valorSinalInput = document.getElementById('valor_sinal');
        
        if (sinalPagoSelect && valorSinalInput) {
            const isSinalPago = sinalPagoSelect.value === 'true';
            const valorSinal = converterParaNumero(valorSinalInput.value);
            
            if (isSinalPago && valorSinal > 0) {
                valorAReceber -= valorSinal;
                console.log(`   Sinal pago (SIM): -${formatarParaMoeda(valorSinal)}`);
            }
        }
        
        // 5. SUBTRAI VALOR AVULSO
         const valorAvulsoPagoSelect = document.getElementById('valor_avulso_pago');
        const valorAvulsoInput = document.getElementById('valor_avulso');

        if (valorAvulsoPagoSelect && valorAvulsoInput) {
            const isValorAvulsoPago = valorAvulsoPagoSelect.value === 'true';
            const valorAvulso = converterParaNumero(valorAvulsoInput.value);

            if (isValorAvulsoPago && valorAvulso > 0) {
                valorAReceber -= valorAvulso;
                console.log(`   Valor avulso (SIM): -${formatarParaMoeda(valorAvulso)}`);
            } else if (!isValorAvulsoPago) {
                console.log(`   Valor avulso (NÃO): Não subtraído`);
            }
        }
        
        // 6. SUBTRAI VALOR RESTANTE SE RECEBIDO
        const restanteRecebidoSelect = document.getElementById('valor_restante_recebido');
const valorRestanteInput = document.getElementById('valor_restante');

if (restanteRecebidoSelect && valorRestanteInput) {
    const isRestanteRecebido = restanteRecebidoSelect.value === 'true';
    const valorRestante = converterParaNumero(valorRestanteInput.value);
    
    if (isRestanteRecebido) {
        // Quando SIM é selecionado, subtrai o valor restante completo
        // Isso zera o "Valor que Falta Receber"
        valorAReceber = 0;
        console.log(`   Restante recebido (SIM): Valor a receber ZERADO`);
    } else {
        // Quando NÃO é selecionado, não subtrai nada
        console.log(`   Restante recebido (NÃO): Mantém valor atual`);
    }
}
        
        // Garante que não fique negativo
        valorAReceber = Math.max(0, valorAReceber);
        
        console.log(`VALOR A RECEBER: ${formatarParaMoeda(valorAReceber)}`);
        
        // ATUALIZA OS CAMPOS (APENAS LEITURA)
        const valorTotalField = document.getElementById('valor_total');
        const valorAReceberField = document.getElementById('valor_falta_receber');
        
        if (valorTotalField) {
            valorTotalField.value = formatarParaMoeda(valorTotal);
            console.log(`Campo "Total" atualizado: ${valorTotalField.value}`);
        }
        
        if (valorAReceberField) {
            valorAReceberField.value = formatarParaMoeda(valorAReceber);
            console.log(`Campo "Valor que Falta Receber" atualizado: ${valorAReceberField.value}`);
        }
        
        return { valorTotal, valorAReceber };
        
    } catch (error) {
        console.error('Erro Ação calcular valores:', error);
        return { valorTotal: 0, valorAReceber: 0 };
    }
}

// Função para adicionar personagem Ação evento
function adicionarPersonagemEvento() {
    console.log('ADICIONANDO PERSONAGEM');
    
    const select = document.getElementById('personagem_select');
    if (!select || !select.value) {
        alert('Selecione um personagem');
        return;
    }
    
    const personagemId = select.value;
    const personagemNome = select.options[select.selectedIndex].text;
    
    // Busca informações do localStorage
    const personagens = JSON.parse(localStorage.getItem('personagens') || '[]');
    const personagem = personagens.find(p => 
        String(p.id) === String(personagemId) || 
        String(p.ID) === String(personagemId)
    );
    
    // Cria elemento do personagem
    const container = document.getElementById('personagensSelecionados');
    if (!container) {
        console.error('Container de personagens não encontrado!');
        return;
    }
    
    // Verifica se o personagem já foi adicionado
    const personagemExistente = Array.from(container.querySelectorAll('.personagem-item'))
        .some(div => div.getAttribute('data-personagem-id') === personagemId);
    
    if (personagemExistente) {
        alert('Este personagem já foi adicionado Ação evento!');
        return;
    }
    
    const div = document.createElement('div');
    div.className = 'personagem-item';
    div.setAttribute('data-personagem-id', personagemId);
    
    let valorTexto = '';
    let valorNumero = 0;
    let tema = '';
    let figurino = '';
    
    if (personagem) {
        // Obtém valor
        if (personagem.valor_hora) {
            valorNumero = converterParaNumero(personagem.valor_hora);
            valorTexto = formatarParaMoeda(valorNumero);
        } else if (personagem.valor) {
            valorNumero = converterParaNumero(personagem.valor);
            valorTexto = formatarParaMoeda(valorNumero);
        }
        
        // Obtém tema e figurino
        tema = personagem.tema || personagem.Tema || '';
        figurino = personagem.figurino || personagem.Figurino || '';
        
        // Atualiza campos de tema e figurino
        const temaField = document.getElementById('tema_evento');
        const figurinoField = document.getElementById('figurino_evento');
        
        if (temaField && !temaField.value) temaField.value = tema;
        if (figurinoField && !figurinoField.value) figurinoField.value = figurino;
    }
    
    // HTML do personagem
    div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; 
                    padding: 10px; margin: 5px 0; background: #f8f9fa; border-radius: 5px; border: 1px solid #ddd;">
            <div style="flex: 1;">
                <strong style="display: block;">${personagemNome}</strong>
                <small style="display: block; color: #666;">Tema: ${tema} | Figurino: ${figurino}</small>
                ${valorTexto ? `<div style="color: #28a745; font-weight: bold; margin-top: 5px;">Valor: ${valorTexto}</div>` : ''}
            </div>
            <button type="button" onclick="removerPersonagem(this)" 
                    style="background: #dc3545; color: white; border: none; padding: 5px 10px; 
                           border-radius: 3px; cursor: pointer; font-size: 12px; margin-left: 10px;">
                Remover
            </button>
        </div>
    `;
    
    container.appendChild(div);
    
    // Limpa seleção
    select.value = '';
    
    // Limpa os campos de detalhes
    const temaPersonagemField = document.getElementById('tema_personagem');
    const figurinoPersonagemField = document.getElementById('figurino_personagem');
    if (temaPersonagemField) temaPersonagemField.value = '';
    if (figurinoPersonagemField) figurinoPersonagemField.value = '';
    
    // Atualiza cálculos
    calcularValoresEvento();
    
    console.log(`Personagem "${personagemNome}" adicionado com sucesso! Valor: ${valorTexto}`);
}

// Função para remover personagem
function removerPersonagem(button) {
    const div = button.closest('.personagem-item');
    if (div) {
        div.remove();
        calcularValoresEvento();
        console.log('Personagem removido');
    }
}

// Função para mostrar detalhes do personagem no select
function mostrarDetalhesPersonagem() {
    const select = document.getElementById('personagem_select');
    const temaField = document.getElementById('tema_personagem');
    const figurinoField = document.getElementById('figurino_personagem');
    
    if (!select || !select.value) {
        if (temaField) temaField.value = '';
        if (figurinoField) figurinoField.value = '';
        return;
    }
    
    const personagemId = select.value;
    const personagens = JSON.parse(localStorage.getItem('personagens') || '[]');
    const personagem = personagens.find(p => 
        p.id == personagemId || 
        p.ID == personagemId || 
        p.codigo == personagemId
    );
    
    if (personagem) {
        if (temaField) temaField.value = personagem.tema || personagem.Tema || '';
        if (figurinoField) figurinoField.value = personagem.figurino || personagem.Figurino || '';
    } else {
        if (temaField) temaField.value = '';
        if (figurinoField) figurinoField.value = '';
    }
}

// Configura todos os listeners para a página de reserva
function configurarReservaEvento() {
    if (reservaConfigurada) {
        console.log('Reserva já configurada, ignorando...');
        return;
    }
    
    console.log('CONFIGURANDO SISTEMA DE CÁLCULOS PARA RESERVA');
    
    // Verifica se estamos na página correta
    const paginaReserva = document.getElementById('reservar_evento');
    if (!paginaReserva) {
        console.log('Página de reserva não encontrada');
        return;
    }
    
    // Configura listeners para campos monetários (que disparam cálculos)
    const camposMonetarios = [
        'deslocamento',
        'desconto',
        'valor_sinal',
        'valor_avulso'
    ];
    
    camposMonetarios.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            console.log(`Configurando campo: ${id}`);
            
            // Formata valor inicial se existir
            if (campo.value) {
                formatarMoeda(campo);
            }
            
            // Adiciona listener para input
            campo.addEventListener('input', function() {
                formatarMoedaInput(this);
                setTimeout(calcularValoresEvento, 50);
            });
            
            // Adiciona listener para blur (quando sai do campo)
            campo.addEventListener('blur', function() {
                calcularValoresEvento();
            });
            
            // Adiciona listener para change (para selects)
            campo.addEventListener('change', function() {
                setTimeout(calcularValoresEvento, 50);
            });
        } else {
            console.warn(`Campo não encontrado: ${id}`);
        }
    });
    
    // Configura listeners para selects
    const selects = ['sinal_pago_status', 'valor_restante_recebido', 'valor_avulso_pago'];
    selects.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            console.log(`Configurando select: ${id}`);
            select.addEventListener('change', calcularValoresEvento);
        }
    });
    
    // Configura observer para monitorar mudanças na lista de personagens
    const containerPersonagens = document.getElementById('personagensSelecionados');
    if (containerPersonagens) {
        const observer = new MutationObserver(function() {
            setTimeout(calcularValoresEvento, 100);
        });
        
        observer.observe(containerPersonagens, { childList: true });
        console.log('Observer configurado para personagens');
    }
    
    // Torna os campos de total e valor a receber somente leitura
    const valorTotalField = document.getElementById('valor_total');
    const valorAReceberField = document.getElementById('valor_falta_receber');
    
    if (valorTotalField) {
        valorTotalField.readOnly = true;
        valorTotalField.style.backgroundColor = '#f8f9fa';
        valorTotalField.style.cursor = 'not-allowed';
        valorTotalField.style.color = '#057001';
        valorTotalField.style.fontWeight = 'bold';
        console.log('Campo "Total" configurado como somente leitura');
    }
    
    if (valorAReceberField) {
        valorAReceberField.readOnly = true;
        valorAReceberField.style.backgroundColor = '#f8f9fa';
        valorAReceberField.style.cursor = 'not-allowed';
        valorAReceberField.style.color = '#da040d';
        valorAReceberField.style.fontWeight = 'bold';
        console.log('Campo "Valor que Falta Receber" configurado como somente leitura');
    }
    
    // Carrega personagens no select
    const selectPersonagens = document.getElementById('personagem_select');
    if (selectPersonagens) {
        try {
            const personagens = JSON.parse(localStorage.getItem('personagens') || '[]');
            if (personagens.length > 0) {
                // Salva a opção padrão
                const defaultOption = selectPersonagens.querySelector('option[value=""]');
                selectPersonagens.innerHTML = '';
                if (defaultOption) {
                    selectPersonagens.appendChild(defaultOption);
                }
                
                // Adiciona personagens
                personagens.forEach(p => {
                    const option = document.createElement('option');
                    const id = p.id || p.ID || '';
                    const nome = p.nome || p.Nome || 'Personagem sem nome';
                    const valor = p.valor_hora || p.valor || '';
                    
                    option.value = id;
                    option.textContent = `${nome} ${valor ? `(${valor})` : ''}`;
                    selectPersonagens.appendChild(option);
                });
                
                console.log(`${personagens.length} personagens carregados`);
            }
        } catch (error) {
            console.error('Erro Ação carregar personagens:', error);
        }
    }
    
    // Adiciona listener para o botão de adicionar personagem
    const addPersonagemBtn = document.getElementById('addPersonagemBtn');
    if (addPersonagemBtn) {
        addPersonagemBtn.addEventListener('click', adicionarPersonagemEvento);
    }
    
    // Adiciona listener para mudanças no select de personagens
    if (selectPersonagens) {
        selectPersonagens.addEventListener('change', mostrarDetalhesPersonagem);
    }
    
    // Executa cálculo inicial
    setTimeout(calcularValoresEvento, 500);
    
    reservaConfigurada = true;
    console.log('SISTEMA DE CÁLCULOS CONFIGURADO COM SUCESSO!');
}
  // ==================== FUNÇÕES PARA PREVIEW DE IMAGENS ====================
function previewFotoPersonagem(input) {
    const previewContainer = document.getElementById('previewContainer');
    const fotoPreview = document.getElementById('fotoPreview');
    const previewText = document.getElementById('previewText');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Mostra a imagem
            fotoPreview.src = e.target.result;
            fotoPreview.style.display = 'block';
            previewText.style.display = 'none';
            
            // Adiciona estilos Ã  imagem de preview
            fotoPreview.style.maxWidth = '100%';
            fotoPreview.style.maxHeight = '100%';
            fotoPreview.style.objectFit = 'cover';
            
            // Ajusta o container
            previewContainer.style.border = '2px solid #4361ee';
            previewContainer.style.padding = '5px';
        }
        
        reader.readAsDataURL(input.files[0]);
    } else {
        // Se não houver arquivo, volta Ação estado inicial
        fotoPreview.src = '';
        fotoPreview.style.display = 'none';
        previewText.style.display = 'block';
        previewContainer.style.border = '2px dashed #ccc';
        previewContainer.style.padding = '0';
    }
}

// ==================== SALVAR PERSONAGEM COM FOTO ====================
function salvarPersonagem() {
    const form = document.getElementById('personagensForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coleta dados do formulário
        const nome = document.getElementById('nome_personagens').value;
        const figurino = document.getElementById('figurino').value;
        const tema = document.getElementById('tema').value;
        const quantidade = document.getElementById('quantidade').value;
        const valor = document.getElementById('valor_personagens').value;
        const fotoInput = document.getElementById('foto_personagem');
        
        // Validações básicas
        if (!nome) {
            alert('Preencha o nome do personagem');
            return;
        }
        
        // Gera ID único
        const id = gerarID('personagens');
        
        // Processa a foto (se houver)
        let fotoBase64 = '';
        if (fotoInput.files && fotoInput.files[0]) {
            const file = fotoInput.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                fotoBase64 = e.target.result;
                salvarPersonagemNoLocalStorage();
            }
            
            reader.readAsDataURL(file);
        } else {
            salvarPersonagemNoLocalStorage();
        }
        
        function salvarPersonagemNoLocalStorage() {
            // Cria objeto do personagem
            const personagem = {
                id: id,
                nome: nome,
                figurino: figurino,
                tema: tema,
                quantidade: parseInt(quantidade) || 1,
                valor: valor,
                valor_hora: valor, // Para compatibilidade com o sistema de reservas
                foto: fotoBase64,
                data_cadastro: new Date().toISOString()
            };
            
            // Recupera personagens existentes
            let personagens = JSON.parse(localStorage.getItem('personagens') || '[]');
            
            // Adiciona novo personagem
            personagens.push(personagem);
            
            // Salva no localStorage
            localStorage.setItem('personagens', JSON.stringify(personagens));
            
            // Mostra mensagem de sucesso
            const successDiv = document.getElementById('personagensSuccess');
            if (successDiv) {
                successDiv.textContent = 'Personagem cadastrado com sucesso!';
                successDiv.style.display = 'block';
                successDiv.style.color = '#28a745';
                successDiv.style.padding = '10px';
                successDiv.style.marginTop = '10px';
                successDiv.style.borderRadius = '4px';
                successDiv.style.backgroundColor = '#d4edda';
            }
            
            // Limpa formulário após 2 segundos
            setTimeout(() => {
                form.reset();
                if (successDiv) successDiv.style.display = 'none';
                
                // Limpa preview da foto
                const fotoPreview = document.getElementById('fotoPreview');
                const previewText = document.getElementById('previewText');
                const previewContainer = document.getElementById('previewContainer');
                
                if (fotoPreview) {
                    fotoPreview.src = '';
                    fotoPreview.style.display = 'none';
                }
                if (previewText) {
                    previewText.style.display = 'block';
                }
                if (previewContainer) {
                    previewContainer.style.border = '2px dashed #ccc';
                    previewContainer.style.padding = '0';
                }
            }, 2000);
            
            console.log('Personagem salvo:', personagem);
        }
    });
}

// ==================== CONFIGURAR LISTENERS PARA FORMULÁRIOS ====================
function configurarFormularios() {
    // Personagens
    const formPersonagens = document.getElementById('personagensForm');
    if (formPersonagens) {
        formPersonagens.addEventListener('submit', function(e) {
            e.preventDefault();
            salvarPersonagem();
        });
    }
    
    // Outros formulários (clientes, elenco, etc.)
    const forms = ['clientesForm', 'casaDeFestasForm', 'elencoForm', 'motoristasForm', 'fornecedoresForm', 'funcionariosForm'];
    
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                salvarCadastroGenerico(formId.replace('Form', ''));
            });
        }
    });
}

// ==================== FUNÇÃO GENÉRICA PARA SALVAR CADASTROS ====================
function salvarCadastroGenerico(tipo) {
    const form = document.getElementById(`${tipo}Form`);
    if (!form) return;
    
    // Coleta dados dos campos (ajuste conforme seu formulário)
    const inputs = form.querySelectorAll('input, select, textarea');
    const dados = {};
    
    inputs.forEach(input => {
        if (input.id && !input.id.includes('ID_')) {
            const campo = input.id.replace(`${tipo}_`, '');
            dados[campo] = input.value;
        }
    });
    
    // Gera ID
    const id = gerarID(tipo);
    dados.id = id;
    dados.data_cadastro = new Date().toISOString();
    
    // Recupera dados existentes
    let cadastros = JSON.parse(localStorage.getItem(tipo) || '[]');
    
    // Adiciona novo
    cadastros.push(dados);
    
    // Salva no localStorage
    localStorage.setItem(tipo, JSON.stringify(cadastros));
    
    // Mostra mensagem
    alert(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} cadastrado com sucesso!`);
    
    // Limpa formulário
    form.reset();
    
    console.log('${tipo} salvo:`, dados);
}
// Função para calcular idade ou tempo de empresa
function calcularIdadeOuTempo(entidade) {
    const dataInput = document.getElementById(`data_nascimento_${entidade}`) || 
                      document.getElementById(`data_abertura_${entidade}`);
    
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
// ==================== FUNÇÕES PARA RELATÓRIOS ====================

// Função para posicionar formulários no topo - Relatório Checklist
function posicionarFormularioChecklistTopo() {
    const section = document.getElementById('relatorios_checklist');
    if (!section) return;
    
    // Como os .card wrappers foram removidos, a estrutura já está direta na section
    // h2 (índice 0) -> p (índice 1) -> filtros -> totais -> tabela
    // Mantém a ordem como está definida no HTML
    // Nenhuma reordenação necessária
}

// Função para posicionar formulários no topo - Relatório Equipe
function posicionarFormularioEquipeTopo() {
    const section = document.getElementById('relatorios_equipe');
    if (!section) return;
    
    // Como os .card wrappers foram removidos, a estrutura já está direta na section
    // h2 (índice 0) -> p (índice 1) -> abas -> conteúdo das abas
    // Mantém a ordem como está definida no HTML
    // Nenhuma reordenação necessária
}

// Função principal para inicializar relatórios
function inicializarRelatorios() {
    // Verifica se está na página de relatórios
    const paginaAtual = document.querySelector('.page.active')?.id;
    
    if (paginaAtual === 'relatorios_checklist') {
        posicionarFormularioChecklistTopo();
    }
    
    if (paginaAtual === 'relatorios_equipe') {
        posicionarFormularioEquipeTopo();
    }
}

// Inicialização quando a página carrega
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarRelatorios);
} else {
    inicializarRelatorios();
}
// ==================== OBSERVER PARA MUDANÇAS DE PÁGINA ====================
// Observer para detectar mudanças de página e reposicionar formulários
const observerRelatorios = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const target = mutation.target;
            if (target.classList.contains('page') && target.classList.contains('active')) {
                // Pequeno delay para garantir que o DOM foi atualizado
                setTimeout(() => {
                    if (target.id === 'relatorios_checklist') {
                        posicionarFormularioChecklistTopo();
                    }
                    if (target.id === 'relatorios_equipe') {
                        posicionarFormularioEquipeTopo();
                    }
                }, 100);
            }
        }
    });
});

// Inicia o observer
if (document.body) {
    observerRelatorios.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class']
    });
}

// ==================== FUNÇÃO PARA INTEGRAÇÃO COM SISTEMA DE NAVEGAÇÃO ====================
// Função para ser chamada pelo sistema de navegação principal
function ajustarFormulariosRelatorios(pageId) {
    if (pageId === 'relatorios_checklist') {
        setTimeout(() => posicionarFormularioChecklistTopo(), 50);
    }
    
    if (pageId === 'relatorios_equipe') {
        setTimeout(() => posicionarFormularioEquipeTopo(), 50);
    }
}

// Exporta a função para uso global
window.ajustarFormulariosRelatorios = ajustarFormulariosRelatorios;

// ==================== RELATORIOS.JS - FUNÇÃO ATUALIZADA ====================
function carregarRelatorio(pageId) {
    console.log('Carregando relatório:', pageId);
    
    // Mapeamento de páginas para tipos
    const mapeamentoPaginas = {
        'lista_personagens': { tipo: 'personagens', titulo: 'Catálogo de Personagens' },
        'lista_clientes': { tipo: 'clientes', titulo: 'Lista de Clientes' },
        'lista_elenco': { tipo: 'elenco', titulo: 'Lista do Elenco' },
        'lista_motoristas': { tipo: 'motoristas', titulo: 'Lista de Motoristas' },
        'lista_funcionarios': { tipo: 'funcionarios', titulo: 'Lista de Funcionários' },
        'lista_casas_festa': { tipo: 'casa_de_festas', titulo: 'Lista de Casas de Festa' },
        'lista_fornecedores': { tipo: 'fornecedores', titulo: 'Lista de Fornecedores' },
        'lista_checklists': { tipo: 'checklists', titulo: 'Lista de Checklists' }
    };
    
    // Mapeamento de tipos para chaves de storage
    const mapeamentoStorage = {
        'personagens': 'personagens_cadastrados',
        'clientes': 'clientes_cadastrados',
        'elenco': 'elenco_cadastrado',
        'motoristas': 'motoristas_cadastrados',
        'funcionarios': 'funcionarios_cadastrados',
        'casa_de_festas': 'casas_festa_cadastradas',
        'fornecedores': 'fornecedores_cadastrados',
        'checklists': 'checklists_cadastradas'
    };
    
    const config = mapeamentoPaginas[pageId];
    if (!config) {
        console.warn('Página não mapeada:', pageId);
        return;
    }
    
    const chaveStorage = mapeamentoStorage[config.tipo];
    if (!chaveStorage) {
        console.error('Chave de storage não encontrada para:', config.tipo);
        return;
    }
    
    // Carregar dados
    const dados = JSON.parse(localStorage.getItem(chaveStorage) || '[]');
    console.log(`Dados carregados de ${chaveStorage}:`, dados.length);
    
    // Gerar HTML da tabela
    const html = gerarTabelaRelatorio(config.tipo, dados);
    
    // Atualizar página
    const container = document.getElementById(pageId);
    if (container) {
        const card = container.querySelector('.card') || container;
        card.innerHTML = `<h2>${config.titulo}</h2>${html}`;
    }
}

// Função atualizada para gerar tabelas
function gerarTabelaRelatorio(tipo, dados) {
    if (dados.length === 0) {
        return `
            <div class="sem-dados">
                <div style="text-align: center; padding: 40px; color: #666;">
                    <div style="font-size: 48px; margin-bottom: 20px;">📋</div>
                    <h3 style="margin-bottom: 10px;">Nenhum registro encontrado</h3>
                    <p>Cadastre dados na seção correspondente</p>
                </div>
            </div>
        `;
    }
    
    // Configuração das colunas por tipo
    const configs = {
        'clientes': {
            colunas: ['ID', 'Nome', 'Documento', 'Telefone', 'Email', 'Cidade', 'Data Cadastro', 'Ações'],
            renderizar: (item) => `
                <tr>
                    <td>${item.id || '--'}</td>
                    <td><strong>${item.nome_cliente || item.nome || '--'}</strong></td>
                    <td>${formatarDocumento(item.doc_cliente_cadastro || item.documento)}</td>
                    <td>${formatarTelefone(item.telefone_cliente || item.telefone)}</td>
                    <td>${item.email_cliente || item.email || '--'}</td>
                    <td>${item.cidade_cliente || item.cidade || '--'}</td>
                    <td>${formatarData(item.data_cadastro)}</td>
                    <td>
                        <button class="btn small" onclick="editarItem('clientes', '${item.id}')">
                            Editar
                        </button>
                    </td>
                </tr>
            `
        },
        'personagens': {
            colunas: ['ID', 'Nome', 'Documento', 'Telefone', 'Email', 'Data Cadastro', 'Ações'],
            renderizar: (item) => `
                <tr>
                    <td>${item.id || '--'}</td>
                    <td><strong>${item.nome_personagem || item.nome || '--'}</strong></td>
                    <td>${formatarDocumento(item.doc_personagem || item.documento)}</td>
                    <td>${formatarTelefone(item.telefone_personagem || item.telefone)}</td>
                    <td>${item.email_personagem || item.email || '--'}</td>
                    <td>${formatarData(item.data_cadastro)}</td>
                    <td>
                        <button class="btn small" onclick="editarItem('personagens', '${item.id}')">
                            Editar
                        </button>
                    </td>
                </tr>
            `
        }
    };
    
    const config = configs[tipo] || {
        colunas: ['ID', 'Nome', 'Documento', 'Telefone', 'Data Cadastro', 'Ações'],
        renderizar: (item) => {
            const nomeField = Object.keys(item).find(k => k.includes('nome'));
            const docField = Object.keys(item).find(k => k.includes('doc') || k.includes('cpf') || k.includes('cnpj'));
            const telField = Object.keys(item).find(k => k.includes('telefone') || k.includes('celular'));
            
            return `
                <tr>
                    <td>${item.id || '--'}</td>
                    <td><strong>${item[nomeField] || '--'}</strong></td>
                    <td>${formatarDocumento(item[docField])}</td>
                    <td>${formatarTelefone(item[telField])}</td>
                    <td>${formatarData(item.data_cadastro)}</td>
                    <td>
                        <button class="btn small" onclick="editarItem('${tipo}', '${item.id}')">
                            Editar
                        </button>
                    </td>
                </tr>
            `;
        }
    };
    
    let html = `
        <div class="relatorio-info">
            <span>Total: ${dados.length} registro${dados.length !== 1 ? 's' : ''}</span>
            <button onclick="exportarDados('${tipo}')" class="btn">
                Exportar CSV
            </button>
        </div>
        
        <div class="table-container">
            <table class="tabela-relatorio">
                <thead>
                    <tr>
    `;
    
    config.colunas.forEach(coluna => {
        html += `<th>${coluna}</th>`;
    });
    
    html += `
                    </tr>
                </thead>
                <tbody>
    `;
    
    dados.forEach(item => {
        html += config.renderizar(item);
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

// Funções auxiliares de formatação
function formatarDocumento(doc) {
    if (!doc) return '--';
    const limpo = doc.replace(/\D/g, '');
    if (limpo.length === 11) {
        return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (limpo.length === 14) {
        return limpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return doc;
}

function formatarTelefone(tel) {
    if (!tel) return '--';
    const limpo = tel.replace(/\D/g, '');
    if (limpo.length === 11) {
        return limpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (limpo.length === 10) {
        return limpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return tel;
}

function formatarData(data) {
    if (!data) return '--';
    try {
        const d = new Date(data);
        return d.toLocaleDateString('pt-BR');
    } catch {
        return data;
    }
}

function editarItem(tipo, id) {
    console.log(`Editar ${tipo} com ID: ${id}`);
    alert('Função de edição em desenvolvimento');
}

function exportarDados(tipo) {
    console.log(`Exportar dados de ${tipo}`);
    alert('Função de exportação em desenvolvimento');
}'Lista do Elenco' },
        'lista_motoristas': { tipo: 'motoristas', titulo: 'Lista de Motoristas' },
        'lista_funcionarios': { tipo: 'funcionarios', titulo: 'Lista de Funcionários' },
        'lista_casas_festa': { tipo: 'casa_de_festas', titulo: 'Lista de Casas de Festa' },
        'lista_fornecedores': { tipo: 'fornecedores', titulo: 'Lista de Fornecedores' },
        'lista_checklists': { tipo: 'checklists', titulo: 'Lista de Checklists' }
    };
    
    // Mapeamento de tipos para chaves de storage
    const mapeamentoStorage = {
        'personagens': 'personagens_cadastrados',
        'clientes': 'clientes_cadastrados',
        'elenco': 'elenco_cadastrado',
        'motoristas': 'motoristas_cadastrados',
        'funcionarios': 'funcionarios_cadastrados',
        'casa_de_festas': 'casas_festa_cadastradas',
        'fornecedores': 'fornecedores_cadastrados',
        'checklists': 'checklists_cadastradas'
    };
    
    const config = mapeamentoPaginas[pageId];
    if (!config) {
        console.warn('Página não mapeada:', pageId);
        return;
    }
    
    const chaveStorage = mapeamentoStorage[config.tipo];
    if (!chaveStorage) {
        console.error('Chave de storage não encontrada para:', config.tipo);
        return;
    }
    
    // Carregar dados
    const dados = JSON.parse(localStorage.getItem(chaveStorage) || '[]');
    console.log(`Dados carregados de ${chaveStorage}:`, dados.length);
    
    // Gerar HTML da tabela
    const html = gerarTabelaRelatorio(config.tipo, dados);
    
    // Atualizar página
    const container = document.getElementById(pageId);
    if (container) {
        const card = container.querySelector('.card') || container;
        card.innerHTML = `<h2>${config.titulo}</h2>${html}`;
    }
}

// Função atualizada para gerar tabelas
function gerarTabelaRelatorio(tipo, dados) {
    if (dados.length === 0) {
        return `
            <div class="sem-dados">
                <div style="text-align: center; padding: 40px; color: #666;">
                    <div style="font-size: 48px; margin-bottom: 20px;">📋­</div>
                    <h3 style="margin-bottom: 10px;">Nenhum registro encontrado</h3>
                    <p>Cadastre dados na seção correspondente</p>
                </div>
            </div>
        `;
    }
    
    // Configuração das colunas por tipo
    const configs = {
        'clientes': {
            colunas: ['ID', 'Nome', 'Documento', 'Telefone', 'Email', 'Cidade', 'Data Cadastro', 'Ações'],
            renderizar: (item) => `
                <tr>
                    <td>${item.id || '--'}</td>
                    <td><strong>${item.nome_cliente || item.nome || '--'}</strong></td>
                    <td>${formatarDocumento(item.doc_cliente_cadastro || item.documento)}</td>
                    <td>${formatarTelefone(item.telefone_cliente || item.telefone)}</td>
                    <td>${item.email_cliente || item.email || '--'}</td>
                    <td>${item.cidade_cliente || item.cidade || '--'}</td>
                    <td>${formatarData(item.data_cadastro)}</td>
                    <td>
                        <button class="btn small" onclick="editarItem('clientes', '${item.id}')">
                            Editar
                        </button>
                    </td>
                </tr>
            `
        },
        'personagens': {
            colunas: ['ID', 'Nome', 'Documento', 'Telefone', 'Email', 'Data Cadastro', 'Ações'],
            renderizar: (item) => `
                <tr>
                    <td>${item.id || '--'}</td>
                    <td><strong>${item.nome_personagem || item.nome || '--'}</strong></td>
                    <td>${formatarDocumento(item.doc_personagem || item.documento)}</td>
                    <td>${formatarTelefone(item.telefone_personagem || item.telefone)}</td>
                    <td>${item.email_personagem || item.email || '--'}</td>
                    <td>${formatarData(item.data_cadastro)}</td>
                    <td>
                        <button class="btn small" onclick="editarItem('personagens', '${item.id}')">
                            Editar
                        </button>
                    </td>
                </tr>
            `
        },
        // Adicione configurações para outros tipos conforme necessário
    };
    
    const config = configs[tipo] || {
        colunas: ['ID', 'Nome', 'Documento', 'Telefone', 'Data Cadastro', 'Ações'],
        renderizar: (item) => {
            const nomeField = Object.keys(item).find(k => k.includes('nome'));
            const docField = Object.keys(item).find(k => k.includes('doc') || k.includes('cpf') || k.includes('cnpj'));
            const telField = Object.keys(item).find(k => k.includes('telefone') || k.includes('celular'));
            
            return `
                <tr>
                    <td>${item.id || '--'}</td>
                    <td><strong>${item[nomeField] || '--'}</strong></td>
                    <td>${formatarDocumento(item[docField])}</td>
                    <td>${formatarTelefone(item[telField])}</td>
                    <td>${formatarData(item.data_cadastro)}</td>
                    <td>
                        <button class="btn small" onclick="editarItem('${tipo}', '${item.id}')">
                            Editar
                        </button>
                    </td>
                </tr>
            `;
        }
    };
    
    let html = `
        <div class="relatorio-info">
            <span>Total: ${dados.length} registro${dados.length !== 1 ? 's' : ''}</span>
            <button onclick="exportarDados('${tipo}')" class="btn">
                Exportar CSV
            </button>
        </div>
        
        <div class="table-container">
            <table class="tabela-relatorio">
                <thead>
                    <tr>
    `;
    
    config.colunas.forEach(coluna => {
        html += `<th>${coluna}</th>`;
    });
    
    html += `
                    </tr>
                </thead>
                <tbody>
    `;
    
    dados.forEach(item => {
        html += config.renderizar(item);
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

