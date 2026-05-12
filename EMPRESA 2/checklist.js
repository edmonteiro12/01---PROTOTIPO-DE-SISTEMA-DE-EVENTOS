// ==================== FUNÇÕES PARA LISTA DE CHECKLIST ====================
console.log('checklist.js carregado!');

// Teste se as funções estão disponíveis globalmente
window.salvarNomeChecklist = salvarNomeChecklist;
window.salvarTituloChecklist = salvarTituloChecklist;
window.selecionarNomeChecklist = selecionarNomeChecklist;
window.selecionarTituloChecklist = selecionarTituloChecklist;
window.adicionarNovoItem = adicionarNovoItem;
window.removerItem = removerItem;
window.salvarChecklist = salvarChecklist;
window.limparFormularioChecklist = limparFormularioChecklist;
window.mostrarFotoPersonagem = mostrarFotoPersonagem;
window.filtrarChecklist = filtrarChecklist;
window.resetarFiltrosChecklist = resetarFiltrosChecklist;
window.exportarChecklist = exportarChecklist;

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado - inicializando páginas...');
    
    // Verificar se estamos na página de criar checklist
    const criarChecklistPage = document.getElementById('criar_checklist');
    if (criarChecklistPage && criarChecklistPage.classList.contains('active')) {
        console.log('Página criar_checklist ativa');
        inicializarCriarChecklist();
    }
    
    // Verificar se estamos na página de lista de checklist
    const listaChecklistPage = document.getElementById('lista_checklist');
    if (listaChecklistPage && listaChecklistPage.classList.contains('active')) {
        console.log('Página lista_checklist ativa');
        inicializarListaChecklist();
    }
});

// Configurar evento para quando a página for mostrada
document.addEventListener('pageChanged', function(event) {
    console.log('Página mudou para:', event.detail.page);
    
    if (event.detail.page === 'criar_checklist') {
        inicializarCriarChecklist();
    }
    if (event.detail.page === 'lista_checklist') {
        inicializarListaChecklist();
    }
});

// ==================== FUNÇÕES PARA CRIAR CHECKLIST ====================

// Inicializar página de criar checklist
function inicializarCriarChecklist() {
    console.log('Inicializando Criar Checklist...');
    atualizarDropdownNomes();
    atualizarDropdownTitulos();
    carregarPersonagensChecklist();
    
    // Carregar dados para edição se existir
    const editarId = sessionStorage.getItem('editarChecklistId');
    if (editarId) {
        carregarChecklistParaEdicAção(editarId);
    }
}

// Salvar nome do checklist
function salvarNomeChecklist() {
    console.log('Salvando nome do checklist...');
    
    const input = document.getElementById('novoNomeChecklist');
    if (!input) {
        console.error('Campo novoNomeChecklist não encontrado!');
        return;
    }
    
    const nome = input.value.trim();
    
    if (!nome) {
        alert('Por favor, digite um nome para o checklist!');
        input.focus();
        return;
    }
    
    let nomes = JSON.parse(localStorage.getItem('nomesChecklist') || '[]');
    
    // Verificar se já existe
    if (!nomes.includes(nome)) {
        nomes.push(nome);
        localStorage.setItem('nomesChecklist', JSON.stringify(nomes));
        
        // Atualizar dropdown
        atualizarDropdownNomes();
        
        // Selecionar o nome recém-salvo
        document.getElementById('checklistNome').value = nome;
        
        // Limpar o campo de input
        input.value = '';
        
        alert('Nome salvo com sucesso!');
    } else {
        alert('Este nome já existe!');
        // Selecionar o nome existente
        document.getElementById('checklistNome').value = nome;
        input.value = '';
    }
}

// Salvar título do checklist
function salvarTituloChecklist() {
    console.log('Salvando título do checklist...');
    
    const input = document.getElementById('novoTituloChecklist');
    if (!input) {
        console.error('Campo novoTituloChecklist não encontrado!');
        return;
    }
    
    const titulo = input.value.trim();
    
    if (!titulo) {
        alert('Por favor, digite um título para o checklist!');
        input.focus();
        return;
    }
    
    let titulos = JSON.parse(localStorage.getItem('titulosChecklist') || '[]');
    
    // Verificar se já existe
    if (!titulos.includes(titulo)) {
        titulos.push(titulo);
        localStorage.setItem('titulosChecklist', JSON.stringify(titulos));
        
        // Atualizar dropdown
        atualizarDropdownTitulos();
        
        // Selecionar o título recém-salvo
        document.getElementById('checklistTitulo').value = titulo;
        
        // Limpar o campo de input
        input.value = '';
        
        alert('Título salvo com sucesso!');
    } else {
        alert('Este título já existe!');
        // Selecionar o título existente
        document.getElementById('checklistTitulo').value = titulo;
        input.value = '';
    }
}

// Selecionar nome do checklist
function selecionarNomeChecklist(nome) {
    if (nome) {
        // Limpar o campo de input
        const input = document.getElementById('novoNomeChecklist');
        if (input) input.value = '';
    }
}

// Selecionar título do checklist
function selecionarTituloChecklist(titulo) {
    if (titulo) {
        // Limpar o campo de input
        const input = document.getElementById('novoTituloChecklist');
        if (input) input.value = '';
    }
}

// ==================== FUNÇÕES PARA ITENS DO CHECKLIST ====================

// Adicionar novo item
function adicionarNovoItem() {
    console.log('=== ADICIONAR NOVO ITEM INICIADO ===');
    
    const input = document.getElementById('novoItemInput');
    
    if (!input) {
        console.error('Elemento novoItemInput não encontrado!');
        alert('Erro: Campo de item não encontrado!');
        return;
    }
    
    console.log('📋 Input encontrado');
    console.log('📋 Valor do input:', input.value);
    
    // Verificar se o campo está vazio
    if (!input.value || input.value.trim() === '') {
        console.log('Campo vazio ou apenas espaços');
        alert('Por favor, digite um item!');
        input.focus();
        return;
    }
    
    const item = input.value.trim();
    console.log('Item para adicionar:', item);
    
    const container = document.getElementById('listaItensContainer');
    
    if (!container) {
        console.error('Elemento listaItensContainer não encontrado!');
        alert('Erro: Container de itens não encontrado!');
        return;
    }
    
    console.log('Container encontrado');
    
    // Verificar se já existe
    const itensExistentes = document.querySelectorAll('.item-texto');
    let itemJaExiste = false;
    
    for (let elemento of itensExistentes) {
        const textoExistente = elemento.textContent.trim();
        if (textoExistente === item) {
            itemJaExiste = true;
            break;
        }
    }
    
    if (itemJaExiste) {
        console.log('Item já existe');
        alert('Este item já foi adicionado!');
        input.value = '';
        input.focus();
        return;
    }
    
    // Criar elemento do item
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item-checklist';
    itemDiv.innerHTML = `
        <div class="item-texto">${item}</div>
        <button type="button" class="btn-remover-item" onclick="removerItem(this)">
        </button>
    `;
    
    // Adicionar no container
    container.appendChild(itemDiv);
    
    // Limpar input e focar novamente
    input.value = '';
    input.focus();
    
    // Atualizar contador
    atualizarContadorItens();
    
    console.log('Item adicionado com sucesso!');
    console.log('=== ADICIONAR NOVO ITEM FINALIZADO ===');
}

// Remover item
function removerItem(button) {
    if (confirm('Remover este item?')) {
        const itemDiv = button.closest('.item-checklist');
        if (itemDiv) {
            itemDiv.style.opacity = '0';
            itemDiv.style.transform = 'translateX(-20px)';
            itemDiv.style.transition = 'all 0.3s';
            
            setTimeout(() => {
                itemDiv.remove();
                atualizarContadorItens();
            }, 300);
        }
    }
}

// Atualizar contador de itens (FUNÇÃO QUE ESTAVA FALTANDO!)
function atualizarContadorItens() {
    const itens = document.querySelectorAll('.item-checklist');
    const contador = document.getElementById('contadorItens');
    
    if (contador) {
        const count = itens.length;
        contador.textContent = count;
        
        // Mudar cor baseada na quantidade
        if (count === 0) {
            contador.style.color = '#e74a3b';
        } else if (count < 3) {
            contador.style.color = '#f39c12';
        } else {
            contador.style.color = '#28a745';
        }
    }
}

// ==================== FUNÇÕES DE ATUALIZAÇÃO ====================

// Atualizar dropdown de nomes
function atualizarDropdownNomes() {
    const nomes = JSON.parse(localStorage.getItem('nomesChecklist') || '[]');
    const select = document.getElementById('checklistNome');
    
    if (!select) {
        console.error('Dropdown checklistNome não encontrado!');
        return;
    }
    
    let options = '<option value="">Selecione um nome...</option>';
    nomes.sort().forEach(nome => {
        options += `<option value="${nome}">${nome}</option>`;
    });
    
    select.innerHTML = options;
    console.log('Dropdown de nomes atualizado com', nomes.length, 'itens');
}

// Atualizar dropdown de títulos
function atualizarDropdownTitulos() {
    const titulos = JSON.parse(localStorage.getItem('titulosChecklist') || '[]');
    const select = document.getElementById('checklistTitulo');
    
    if (!select) {
        console.error('Dropdown checklistTitulo não encontrado!');
        return;
    }
    
    let options = '<option value="">Selecione um título...</option>';
    titulos.sort().forEach(titulo => {
        options += `<option value="${titulo}">${titulo}</option>`;
    });
    
    select.innerHTML = options;
    console.log('Dropdown de títulos atualizado com', titulos.length, 'itens');
}

// Carregar personagens
function carregarPersonagensChecklist() {
    const personagens = JSON.parse(localStorage.getItem('personagens') || '[]');
    const select = document.getElementById('checklistPersonagem');
    
    if (!select) {
        console.error('Dropdown checklistPersonagem não encontrado!');
        return;
    }
    
    let options = '<option value="selecione">Selecione um personagem...</option>';
    personagens.forEach(personagem => {
        const id = personagem.id || personagem.ID_personagens;
        const nome = personagem.nome_personagens || 'Sem nome';
        options += `<option value="${id}">${nome}</option>`;
    });
    
    select.innerHTML = options;
    console.log('Dropdown de personagens atualizado com', personagens.length, 'itens');
}

// Mostrar foto do personagem
function mostrarFotoPersonagem(personagemId) {
    const container = document.getElementById('fotoPersonagemContainer');
    const img = document.getElementById('fotoPersonagem');
    
    if (!container || !img) {
        console.error('Elementos de foto do personagem não encontrados!');
        return;
    }
    
    if (personagemId && personagemId !== 'selecione') {
        const personagens = JSON.parse(localStorage.getItem('personagens') || '[]');
        const personagem = personagens.find(p => 
            p.id === personagemId || 
            p.ID_personagens === personagemId
        );
        
        if (personagem && personagem.foto_personagens) {
            img.src = personagem.foto_personagens;
            container.style.display = 'block';
            console.log('Foto do personagem carregada:', personagem.foto_personagens);
        } else {
            container.style.display = 'none';
            console.log('Personagem não tem foto');
        }
    } else {
        container.style.display = 'none';
    }
}

// ==================== FUNÇÃO PARA SALVAR CHECKLIST ====================

// Salvar checklist completo
function salvarChecklist() {
    console.log('=== SALVANDO CHECKLIST ===');
    
    // Obter valores
    const nomeSelect = document.getElementById('checklistNome');
    const nomeInput = document.getElementById('novoNomeChecklist');
    const nome = (nomeSelect && nomeSelect.value) || (nomeInput && nomeInput.value.trim());
    
    const tituloSelect = document.getElementById('checklistTitulo');
    const tituloInput = document.getElementById('novoTituloChecklist');
    const titulo = (tituloSelect && tituloSelect.value) || (tituloInput && tituloInput.value.trim());
    
    const personagemSelect = document.getElementById('checklistPersonagem');
    const personagemId = personagemSelect ? personagemSelect.value : null;
    
    console.log('Dados coletados:', { nome, titulo, personagemId });
    
    // Validar
    if (!nome) {
        alert('Por favor, selecione ou digite um nome para o checklist!');
        const input = document.getElementById('novoNomeChecklist');
        if (input) input.focus();
        return;
    }
    
    if (!titulo) {
        alert('Por favor, selecione ou digite um título para o checklist!');
        const input = document.getElementById('novoTituloChecklist');
        if (input) input.focus();
        return;
    }
    
    if (!personagemId || personagemId === 'selecione') {
        alert('Por favor, selecione um personagem!');
        return;
    }
    
    // Coletar itens
    const itens = [];
    const itensElementos = document.querySelectorAll('.item-texto');
    itensElementos.forEach(item => {
        itens.push(item.textContent);
    });
    
    console.log('Itens coletados:', itens);
    
    if (itens.length === 0) {
        if (!confirm('Você não adicionou nenhum item. Deseja salvar mesmo assim?')) {
            return;
        }
    }
    
    // Verificar se está editando
    const editarChecklistId = sessionStorage.getItem('editarChecklistId');
    const checklist = JSON.parse(localStorage.getItem('checklist') || '[]');
    
    if (editarChecklistId) {
        // Modo edição
        const index = checklist.findIndex(c => c.id === editarChecklistId);
        if (index !== -1) {
            checklist[index] = {
                ...checklist[index],
                nome: nome,
                titulo: titulo,
                descricao: titulo,
                personagemId: personagemId,
                itens: itens,
                dataAtualizacao: new Date().toISOString()
            };
            
            sessionStorage.removeItem('editarChecklistId');
            alert('Checklist atualizado com sucesso!');
            console.log('Checklist atualizado:', checklist[index]);
        }
    } else {
        // Modo criação
        const novoChecklist = {
            id: Date.now().toString(),
            nome: nome,
            titulo: titulo,
            descricao: titulo,
            personagemId: personagemId,
            itens: itens,
            dataCriacao: new Date().toISOString()
        };
        
        checklist.push(novoChecklist);
        alert('Checklist criado com sucesso!');
        console.log('Novo checklist criado:', novoChecklist);
    }
    
    // Salvar no localStorage
    localStorage.setItem('checklist', JSON.stringify(checklist));
    console.log('Checklist salvo no localStorage:', checklist.length);
    
    // Se salvou um novo nome ou título, atualizar os dropdowns
    if (nome && nomeInput && nomeInput.value.trim() === nome) {
        salvarNomeChecklist();
    }
    
    if (titulo && tituloInput && tituloInput.value.trim() === titulo) {
        salvarTituloChecklist();
    }
    
    // Limpar formulário
    limparFormularioChecklist();
    
    // Ir para lista de checklist
    if (typeof showPage === 'function') {
        showPage('lista_checklist');
    } else {
        alert('Checklist salvo! Redirecionando...');
        // Forçar recarregamento da página de lista
        window.location.hash = '#lista_checklist';
        location.reload();
    }
}

// Limpar formulário
function limparFormularioChecklist() {
    console.log('Limpando formulário...');
    
    // Resetar selects
    const nomeSelect = document.getElementById('checklistNome');
    const tituloSelect = document.getElementById('checklistTitulo');
    const personagemSelect = document.getElementById('checklistPersonagem');
    
    if (nomeSelect) nomeSelect.value = '';
    if (tituloSelect) tituloSelect.value = '';
    if (personagemSelect) personagemSelect.value = 'selecione';
    
    // Limpar inputs
    const nomeInput = document.getElementById('novoNomeChecklist');
    const tituloInput = document.getElementById('novoTituloChecklist');
    const itemInput = document.getElementById('novoItemInput');
    
    if (nomeInput) nomeInput.value = '';
    if (tituloInput) tituloInput.value = '';
    if (itemInput) itemInput.value = '';
    
    // Limpar itens
    const container = document.getElementById('listaItensContainer');
    if (container) container.innerHTML = '';
    
    // Limpar foto
    const fotoContainer = document.getElementById('fotoPersonagemContainer');
    if (fotoContainer) fotoContainer.style.display = 'none';
    
    // Atualizar contador
    atualizarContadorItens();
    
    // Remover edição se existir
    sessionStorage.removeItem('editarChecklistId');
    
    console.log('Formulário limpo!');
}

// Carregar checklist para edição
function carregarChecklistParaEdicAção(checklistId) {
    console.log('Carregando checklist para edição:', checklistId);
    
    const checklistArray = JSON.parse(localStorage.getItem('checklist') || '[]');
    const checklist = checklistArray.find(c => c.id === checklistId);
    
    if (!checklist) {
        console.error('Checklist não encontrado para edição');
        return;
    }
    
    console.log('Checklist encontrado:', checklist);
    
    // Preencher dados
    const nomeSelect = document.getElementById('checklistNome');
    const tituloSelect = document.getElementById('checklistTitulo');
    
    if (nomeSelect) nomeSelect.value = checklist.nome || '';
    if (tituloSelect) tituloSelect.value = checklist.titulo || checklist.descricao || '';
    
    // Personagem
    setTimeout(() => {
        const personagemSelect = document.getElementById('checklistPersonagem');
        if (personagemSelect) {
            personagemSelect.value = checklist.personagemId || 'selecione';
            mostrarFotoPersonagem(checklist.personagemId);
        }
    }, 100);
    
    // Itens
    const container = document.getElementById('listaItensContainer');
    if (container) {
        container.innerHTML = '';
        
        if (checklist.itens && checklist.itens.length > 0) {
            checklist.itens.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item-checklist';
                itemDiv.innerHTML = `
                    <div class="item-texto">${item}</div>
                    <button type="button" class="btn-remover-item" onclick="removerItem(this)">
                        ×
                    </button>
                `;
                container.appendChild(itemDiv);
            });
        }
    }
    
    atualizarContadorItens();
    console.log('Checklist carregado para edição');
}

// ==================== FUNÇÕES PARA LISTA DE CHECKLIST ====================

function inicializarListaChecklist() {
    console.log('Inicializando Lista de Checklist...');
    carregarListaChecklist();
    carregarFiltrosLista();
}

// Carregar lista de checklist
function carregarListaChecklist() {
    console.log('Carregando lista de checklist...');
    
    const checklist = JSON.parse(localStorage.getItem('checklist') || '[]');
    const personagens = JSON.parse(localStorage.getItem('personagens') || '[]');
    
    console.log('Checklist encontrados:', checklist.length);
    console.log('Personagens encontrados:', personagens.length);
    
    // Atualizar totais
    let totalItens = 0;
    checklist.forEach(checklist => {
        totalItens += checklist.itens ? checklist.itens.length : 0;
    });
    
    // Atualizar contadores
    const totalChecklistEl = document.getElementById('totalChecklist');
    const totalItensEl = document.getElementById('totalItensChecklist');
    
    if (totalChecklistEl) {
        totalChecklistEl.textContent = checklist.length;
        console.log('Total checklist:', checklist.length);
    }
    if (totalItensEl) {
        totalItensEl.textContent = totalItens;
        console.log('Total itens:', totalItens);
    }
    
    // Renderizar lista
    renderizarListaChecklist(checklist, personagens);
}

// Carregar filtros na lista
function carregarFiltrosLista() {
    console.log('Carregando filtros da lista...');
    
    // Carregar nomes
    const nomes = JSON.parse(localStorage.getItem('nomesChecklist') || '[]');
    const selectNomes = document.getElementById('filtroNomeChecklist');
    if (selectNomes) {
        let options = '<option value="todos">Todos os nomes</option>';
        nomes.forEach(nome => {
            options += `<option value="${nome}">${nome}</option>`;
        });
        selectNomes.innerHTML = options;
        console.log('Filtro de nomes carregado:', nomes.length, 'nomes');
    }
    
    // Carregar títulos
    const titulos = JSON.parse(localStorage.getItem('titulosChecklist') || '[]');
    const selectTitulos = document.getElementById('filtroTituloChecklist');
    if (selectTitulos) {
        let options = '<option value="todos">Todos os títulos</option>';
        titulos.forEach(titulo => {
            options += `<option value="${titulo}">${titulo}</option>`;
        });
        selectTitulos.innerHTML = options;
        console.log('Filtro de títulos carregado:', titulos.length, 'títulos');
    }
    
    // Carregar personagens
    const personagens = JSON.parse(localStorage.getItem('personagens') || '[]');
    const selectPersonagens = document.getElementById('filtroPersonagemChecklist');
    if (selectPersonagens) {
        let options = '<option value="todos">Todos os personagens</option>';
        personagens.forEach(personagem => {
            const id = personagem.id || personagem.ID_personagens;
            const nome = personagem.nome_personagens || 'Sem nome';
            options += `<option value="${id}">${nome}</option>`;
        });
        selectPersonagens.innerHTML = options;
        console.log('Filtro de personagens carregado:', personagens.length, 'personagens');
    }
}

// Renderizar lista de checklist
function renderizarListaChecklist(checklist, personagens) {
    const container = document.getElementById('listaChecklistConteudo');
    
    if (!container) {
        console.error('Elemento listaChecklistConteudo não encontrado!');
        return;
    }
    
    if (checklist.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; background: #f8f9fa; border-radius: 8px;">
                <div style="font-size: 4rem; margin-bottom: 1rem;"></div>
                <h3 style="color: #495057;">Nenhum checklist criado</h3>
                <p style="color: #6c757d;">Crie seu primeiro checklist na página "Criar Check List"</p>
                <button class="btn primary" onclick="showPage('criar_checklist')" style="margin-top: 1rem;">
                    Criar Primeiro Checklist
                </button>
            </div>
        `;
        console.log('Nenhum checklist para mostrar');
        return;
    }
    
    // Ordenar por data de criação (mais recente primeiro)
    checklist.sort((a, b) => new Date(b.dataCriacao || b.dataAtualizacao) - new Date(a.dataCriacao || a.dataAtualizacao));
    
    let html = '<div style="display: grid; gap: 1rem;">';
    
    checklist.forEach((checklist, index) => {
        // Buscar informações do personagem
        const personagem = personagens.find(p => 
            p.id === checklist.personagemId || 
            p.ID_personagens === checklist.personagemId
        );
        
        const personagemNome = personagem ? personagem.nome_personagens : 'Personagem não encontrado';
        const dataFormatada = checklist.dataCriacao ? 
            new Date(checklist.dataCriacao).toLocaleDateString('pt-BR') : 
            new Date(checklist.dataAtualizacao).toLocaleDateString('pt-BR');
        
        html += `
            <div class="card" style="padding: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 0.5rem 0;">${checklist.nome || 'Sem nome'}</h3>
                        <p style="color: #6c757d; margin: 0 0 0.5rem 0;">${checklist.titulo || checklist.descricao || 'Sem título'}</p>
                        
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span style="background: #e8f4fd; padding: 4px 12px; border-radius: 12px; font-size: 0.9rem;">
                                    📋­ ${personagemNome}
                                </span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span style="background: #d4edda; padding: 4px 12px; border-radius: 12px; font-size: 0.9rem;">
                                    📋 ${checklist.itens ? checklist.itens.length : 0} itens
                                </span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span style="background: #f8f9fa; padding: 4px 12px; border-radius: 12px; font-size: 0.9rem;">
                                    📋 ${dataFormatada}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
                        <button class="btn" onclick="visualizarChecklist('${checklist.id}')">
                            Visualizar
                        </button>
                        <button class="btn" onclick="editarChecklist('${checklist.id}')">
                            Editar
                        </button>
                        <button class="btn danger" onclick="excluirChecklist('${checklist.id}')">
                            Excluir
                        </button>
                    </div>
                </div>
                
                <!-- Itens do Checklist -->
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #dee2e6;">
                    <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">Itens do Checklist:</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        `;
        
        // Mostrar apenas os primeiros 5 itens
        const itensParaMostrar = checklist.itens ? checklist.itens.slice(0, 5) : [];
        itensParaMostrar.forEach(item => {
            html += `
                <span style="background: #fff3cd; padding: 4px 10px; border-radius: 15px; font-size: 0.85rem;">
                    ${item}
                </span>
            `;
        });
        
        if (checklist.itens && checklist.itens.length > 5) {
            html += `
                <span style="background: #e9ecef; padding: 4px 10px; border-radius: 15px; font-size: 0.85rem;">
                    +${checklist.itens.length - 5} mais...
                </span>
            `;
        }
        
        html += `
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    console.log('Lista de checklist renderizada:', checklist.length, 'checklist');
}

// Filtrar checklist
function filtrarChecklist() {
    const termo = document.getElementById('buscarChecklist') ? document.getElementById('buscarChecklist').value.toLowerCase() : '';
    const personagemFiltro = document.getElementById('filtroPersonagemChecklist') ? document.getElementById('filtroPersonagemChecklist').value : 'todos';
    const nomeFiltro = document.getElementById('filtroNomeChecklist') ? document.getElementById('filtroNomeChecklist').value : 'todos';
    const tituloFiltro = document.getElementById('filtroTituloChecklist') ? document.getElementById('filtroTituloChecklist').value : 'todos';
    
    const checklist = JSON.parse(localStorage.getItem('checklist') || '[]');
    const personagens = JSON.parse(localStorage.getItem('personagens') || '[]');
    
    let checklistFiltrados = checklist;
    
    // Filtrar por termo de busca
    if (termo) {
        checklistFiltrados = checklistFiltrados.filter(checklist =>
            (checklist.nome && checklist.nome.toLowerCase().includes(termo)) ||
            (checklist.titulo && checklist.titulo.toLowerCase().includes(termo)) ||
            (checklist.descricao && checklist.descricao.toLowerCase().includes(termo))
        );
    }
    
    // Filtrar por personagem
    if (personagemFiltro !== 'todos') {
        checklistFiltrados = checklistFiltrados.filter(checklist =>
            checklist.personagemId === personagemFiltro
        );
    }
    
    // Filtrar por nome
    if (nomeFiltro !== 'todos') {
        checklistFiltrados = checklistFiltrados.filter(checklist =>
            checklist.nome === nomeFiltro
        );
    }
    
    // Filtrar por título
    if (tituloFiltro !== 'todos') {
        checklistFiltrados = checklistFiltrados.filter(checklist =>
            checklist.titulo === tituloFiltro
        );
    }
    
    // Mostrar resultados filtrados
    renderizarListaChecklist(checklistFiltrados, personagens);
}

// Resetar filtros
function resetarFiltrosChecklist() {
    const buscarInput = document.getElementById('buscarChecklist');
    const personagemSelect = document.getElementById('filtroPersonagemChecklist');
    const nomeSelect = document.getElementById('filtroNomeChecklist');
    const tituloSelect = document.getElementById('filtroTituloChecklist');
    
    if (buscarInput) buscarInput.value = '';
    if (personagemSelect) personagemSelect.value = 'todos';
    if (nomeSelect) nomeSelect.value = 'todos';
    if (tituloSelect) tituloSelect.value = 'todos';
    
    carregarListaChecklist();
}

// Funções para lista de checklist (mantidas do seu código)
function visualizarChecklist(checklistId) {
    const checklistArray = JSON.parse(localStorage.getItem('checklist') || '[]');
    const checklist = checklistArray.find(c => c.id === checklistId);
    
    if (!checklist) {
        alert('Checklist não encontrado!');
        return;
    }
    
    const personagens = JSON.parse(localStorage.getItem('personagens') || '[]');
    const personagem = personagens.find(p => 
        p.id === checklist.personagemId || 
        p.ID_personagens === checklist.personagemId
    );
    
    let modalContent = `
        <div style="max-width: 800px; max-height: 80vh; overflow-y: auto;">
            <h2 style="color: #333; margin-top: 0;">${checklist.nome}</h2>
            
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <p><strong>Título:</strong> ${checklist.titulo || checklist.descricao || 'Sem título'}</p>
                <p><strong>Personagem:</strong> ${personagem ? personagem.nome_personagens : 'Não encontrado'}</p>
                <p><strong>Data de Criação:</strong> ${checklist.dataCriacao ? new Date(checklist.dataCriacao).toLocaleDateString('pt-BR') : 'Não disponível'}</p>
                <p><strong>Total de Itens:</strong> ${checklist.itens ? checklist.itens.length : 0}</p>
            </div>
            
            <h3>📋 Itens do Checklist:</h3>
            <div style="display: grid; gap: 0.75rem; margin: 1rem 0;">
    `;
    
    if (checklist.itens && checklist.itens.length > 0) {
        checklist.itens.forEach((item, index) => {
            modalContent += `
                <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: white; border: 1px solid #dee2e6; border-radius: 6px;">
                    <div style="width: 30px; height: 30px; background: #e8f4fd; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                        ${index + 1}
                    </div>
                    <div style="flex: 1;">${item}</div>
                    <div style="width: 24px; height: 24px; border: 2px solid #dee2e6; border-radius: 4px;"></div>
                </div>
            `;
        });
    } else {
        modalContent += `<p style="color: #6c757d; text-align: center;">Nenhum item cadastrado</p>`;
    }
    
    modalContent += `
            </div>
            
            <div style="display: flex; gap: 1rem; margin-top: 2rem; padding-top: 1.5rem; border-top: 2px solid #dee2e6;">
                <button class="btn" onclick="fecharModal()" style="margin-left: auto;">
                    Fechar
                </button>
            </div>
        </div>
    `;
    
    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        display: block;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background-color: #fff;
            margin: 5% auto;
            padding: 0;
            border: 1px solid #888;
            width: 90%;
            max-width: 850px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        ">
            <div class="modal-header" style="
                padding: 1.5rem;
                border-bottom: 1px solid #dee2e6;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <h3 style="margin: 0;">📋 Checklist Completo</h3>
                <span class="close" onclick="this.parentElement.parentElement.parentElement.remove()" 
                      style="color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer; padding: 0 10px;">
                    &times;
                </span>
            </div>
            <div class="modal-body" style="padding: 1.5rem; max-height: 70vh; overflow-y: auto;">
                ${modalContent}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function editarChecklist(checklistId) {
    const checklistArray = JSON.parse(localStorage.getItem('checklist') || '[]');
    const checklist = checklistArray.find(c => c.id === checklistId);
    
    if (!checklist) {
        alert('Checklist não encontrado!');
        return;
    }
    
    // Salvar ID do checklist para edição
    sessionStorage.setItem('editarChecklistId', checklistId);
    
    if (typeof showPage === 'function') {
        showPage('criar_checklist');
    } else {
        window.location.hash = '#criar_checklist';
    }
}

function excluirChecklist(checklistId) {
    if (!confirm('Tem certeza que deseja excluir este checklist?')) {
        return;
    }
    
    const checklist = JSON.parse(localStorage.getItem('checklist') || '[]');
    const checklistAtualizados = checklist.filter(c => c.id !== checklistId);
    
    localStorage.setItem('checklist', JSON.stringify(checklistAtualizados));
    alert('Checklist excluído com sucesso!');
    carregarListaChecklist();
}

function fecharModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Exportar checklist
function exportarChecklist() {
    const checklist = JSON.parse(localStorage.getItem('checklist') || '[]');
    
    if (checklist.length === 0) {
        alert('Não há checklist para exportar!');
        return;
    }
    
    const dataStr = JSON.stringify(checklist, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `checklist_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert(`${checklist.length} checklist exportados com sucesso!`);
}

// Adicionar eventos de teclado
document.addEventListener('keypress', function(e) {
    if (e.target.id === 'novoItemInput' && e.key === 'Enter') {
        e.preventDefault();
        adicionarNovoItem();
    }
    
    if (e.target.id === 'novoNomeChecklist' && e.key === 'Enter') {
        e.preventDefault();
        salvarNomeChecklist();
    }
    
    if (e.target.id === 'novoTituloChecklist' && e.key === 'Enter') {
        e.preventDefault();
        salvarTituloChecklist();
    }
});

// ==================== FUNÇÕES DE TESTE/DEBUG ====================

// Função de teste para verificar o campo
function testarCampoItem() {
    console.log('=== TESTANDO CAMPO DE ITEM ===');
    const input = document.getElementById('novoItemInput');
    
    if (!input) {
        console.log('Campo não encontrado!');
        return;
    }
    
    console.log('Campo encontrado!');
    console.log('Tipo:', typeof input);
    console.log('Valor atual:', input.value);
    console.log('Valor trimado:', input.value.trim());
    console.log('Comprimento:', input.value.length);
    console.log('Comprimento trimado:', input.value.trim().length);
    
    // Teste: adicionar um valor de teste
    input.value = 'Figurino completo';
    console.log('Valor após atribuição:', input.value);
    console.log('=== FIM DO TESTE ===');
}

// Função para limpar todos os dados (apenas para debug)
function limparTodosDados() {
    if (confirm('ATENÇÃO: Isso apagará TODOS os dados. Continuar?')) {
        localStorage.removeItem('checklist');
        localStorage.removeItem('nomesChecklist');
        localStorage.removeItem('titulosChecklist');
        alert('Todos os dados foram limpos!');
        location.reload();
    }
}
document.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const pageId = this.getAttribute('data-page');
        showPage(pageId);
    });
});
