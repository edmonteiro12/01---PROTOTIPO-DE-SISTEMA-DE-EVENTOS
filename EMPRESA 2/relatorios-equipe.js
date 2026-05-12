// ==================== RELATORIOS.JS COMPLETO ====================
// Arquivo: relatorios.js

// Função principal para carregar Relatórios
function carregarRelatorio(pageId) {
    console.log('Carregando relatório:', pageId);
    
    // Mapeamento completo de páginas
    const mapeamentoCompleto = {
        // Relatórios principais
        'relatorio_eventos': { tipo: 'eventos', titulo: 'Relatório de Eventos', modo: 'eventos' },
        'relatorio_clientes': { tipo: 'clientes', titulo: 'Relatório de Clientes', modo: 'clientes' },
        'relatorio_personagens': { tipo: 'personagens', titulo: 'Relatório de Personagens', modo: 'personagens' },
        'relatorio_casas_de_festa': { tipo: 'casa_de_festas', titulo: 'Relatório de Casas de Festa', modo: 'casas_festa' },
        
        // Relatórios financeiros
        'relatorio_receitas': { tipo: 'financeiro', titulo: 'Relatório de Receitas', modo: 'receitas' },
        'relatorio_despesas': { tipo: 'financeiro', titulo: 'Relatório de Despesas', modo: 'despesas' },
        'relatorio_lucros': { tipo: 'financeiro', titulo: 'Relatório de Lucros', modo: 'lucros' },
        
        // Relatórios de equipe
        'lista_elenco': { tipo: 'elenco', titulo: 'Relatório Lista do Elenco', modo: 'elenco' },
        'lista_motoristas': { tipo: 'motoristas', titulo: 'Relatório Lista de Motoristas', modo: 'motoristas' },
        'lista_producao': { tipo: 'funcionarios', titulo: 'Relatório Lista de Produção', modo: 'producao' },
        'lista_funcionarios': { tipo: 'funcionarios', titulo: 'Relatório Lista de Funcionários', modo: 'funcionarios' },
        
        // Outros relatórios
        'lista_checklist': { tipo: 'checklist', titulo: 'Relatório Lista de Checklist', modo: 'checklist' },
        'lista_de_manutencAção': { tipo: 'manutencoes', titulo: 'Relatório Lista de Manutenções', modo: 'manutencoes' },
        'contas_receber_eventos': { tipo: 'financeiro', titulo: 'Relatório Contas a Receber', modo: 'contas_receber' },
        'contas_pagar_elenco': { tipo: 'financeiro', titulo: 'Relatório Contas a Pagar - Elenco', modo: 'contas_pagar' },
        'contas_pagar_motoristas': { tipo: 'financeiro', titulo: 'Relatório Contas a Pagar - Motoristas', modo: 'contas_pagar' },
        'contas_pagar_producao': { tipo: 'financeiro', titulo: 'Relatório Contas a Pagar - Produção', modo: 'contas_pagar' },
        'contas_pagar_fornecedores': { tipo: 'financeiro', titulo: 'Relatório Contas a Pagar - Fornecedores', modo: 'contas_pagar' },
        'contas_pagar_funcionarios': { tipo: 'financeiro', titulo: 'Relatório Contas a Pagar - Funcionários', modo: 'contas_pagar' }
    };

    // Verificar se é uma página de formulário
    const paginasFormulario = [
        'contas_receber_eventos',
        'contas_pagar_elenco',
        'contas_pagar_motoristas',
        'contas_pagar_produção',
        'contas_pagar_fornecedores',
        'contas_pagar_funcionarios',
        'fluxo_caixa',
        'orcamentos',
        'lista_checklist',
        'lista_de_manutenção'
    ];

    if (paginasFormulario.includes(pageId)) {
        console.log('Página de formulário detectada:', pageId);
        exibirFormularioRelatorio(pageId);
        return;
    }

    // Para outras páginas, usar o sistema de relatórios normal
    const config = mapeamentoCompleto[pageId];
    if (!config) {
        console.error('Configuração não encontrada para:', pageId);
        return;
    }

    const container = document.getElementById(pageId);
    if (!container) {
        console.error('Container não encontrado:', pageId);
        return;
    }

    // Limpar container
    container.innerHTML = '';

    // Criar estrutura do relatório
    const html = `
        <div class="card">
            <div class="card-header">
                <h2>${config.titulo}</h2>
                <div class="card-actions">
                    <button class="btn primary" onclick="exportarRelatorio('${pageId}')">
                    Exportar
                    </button>
                    <button class="btn secondary" onclick="imprimirRelatorio('${pageId}')">
                    Imprimir
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div id="conteudoRelatorio_${pageId}">
                    Carregando dados...
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Carregar dados
    setTimeout(() => {
        carregarDadosRelatorio(pageId, config);
    }, 100);
}

// Função para exibir formulário em páginas específicas
function exibirFormularioRelatorio(pageId) {
    console.log(`Exibindo formulário para: ${pageId}`);
    
    const container = document.getElementById(pageId);
    if (!container) {
        console.error('Container não encontrado:', pageId);
        return;
    }

    // Limpar container
    container.innerHTML = '';

    // Títulos mapeados
    const titulos = {
        'contas_receber_eventos': 'Contas a Receber - Eventos',
        'contas_pagar_elenco': 'Contas a Pagar - Elenco',
        'contas_pagar_motoristas': 'Contas a Pagar - Motoristas',
        'contas_pagar_producao': 'Contas a Pagar - Produção',
        'contas_pagar_fornecedores': 'Contas a Pagar - Fornecedores',
        'contas_pagar_funcionarios': 'Contas a Pagar - Funcionários',
        'lista_checklist': 'Lista de Checklist',
        'lista_de_manutencAção': 'Lista de Manutenções',
        'fluxo_caixa': 'Fluxo de Caixa',
        'orcamentos': 'Orçamentos'
    };

    const titulo = titulos[pageId] || 'Formulário';

    // Estrutura básica do formulário - VERSÃO CORRIGIDA
const html = `
    <div class="card">
        <div class="card-header">
            <h2>${titulo}</h2>
        </div>
        <div class="card-body">
            <div class="form-container" id="formContainer_${pageId}">
                <p>Formulário de ${titulo}</p>
                <p>Esta funcionalidade está em desenvolvimento.</p>
                <button class="btn primary" onclick="window.showPage('dashboard')">Voltar ao Dashboard
                </button>
            </div>
        </div>
    </div>
`;

    container.innerHTML = html;

    // Tentar carregar conteúdo específico do formulário
    setTimeout(() => {
        carregarFormularioEspecifico(pageId);
    }, 100);
}

// Função para carregar formulário específico
function carregarFormularioEspecifico(pageId) {
    const container = document.getElementById(`formContainer_${pageId}`);
    if (!container) return;

    let conteudo = '';

    switch(pageId) {
        case 'lista_checklist':
            conteudo = gerarFormularioChecklist();
            break;
        case 'lista_de_manutencAção':
            conteudo = gerarFormularioManutencoes();
            break;
        case 'contas_receber_eventos':
            conteudo = gerarFormularioContasReceber();
            break;
        case 'contas_pagar_elenco':
            conteudo = gerarFormularioContasPagar('elenco');
            break;
        case 'contas_pagar_motoristas':
            conteudo = gerarFormularioContasPagar('motoristas');
            break;
        case 'contas_pagar_producao':
            conteudo = gerarFormularioContasPagar('producao');
            break;
        case 'contas_pagar_fornecedores':
            conteudo = gerarFormularioContasPagar('fornecedores');
            break;
        case 'contas_pagar_funcionarios':
            conteudo = gerarFormularioContasPagar('funcionarios');
            break;
        case 'fluxo_caixa':
            conteudo = gerarFormularioFluxoCaixa();
            break;
        case 'orcamentos':
            conteudo = gerarFormularioOrcamentos();
            break;
        default:
            conteudo = `<p>Formulário não implementado para: ${pageId}</p>`;
    }

    container.innerHTML = conteudo;
}

// ==================== FUNÇÕES DE FORMULÁRIOS ESPECÍFICOS ====================

function gerarFormularioChecklist() {
    return `
        <div class="form-group">
            <h3>Filtros de Checklist</h3>
            <div class="form-row">
                <div class="form-col">
                    <label>Buscar:</label>
                    <input type="text" placeholder="Buscar checklist..." style="width: 100%;">
                </div>
                <div class="form-col">
                    <label>Período:</label>
                    <select style="width: 100%;">
                        <option>Ultimos 30 dias</option>
                        <option>Ultimos 7 dias</option>
                        <option>Este mês</option>
                        <option>Personalizado</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row" style="margin-top: 20px;">
                <div class="form-col">
                    <label>Status:</label>
                    <select style="width: 100%;">
                        <option>Todos</option>
                        <option>Pendentes</option>
                        <option>Concluídos</option>
                        <option>Cancelados</option>
                    </select>
                </div>
                <div class="form-col">
                    <label>Evento:</label>
                    <select style="width: 100%;">
                        <option>Todos os eventos</option>
                        <option>Completos</option>
                        <option>Parciais</option>
                    </select>
                </div>
            </div>
            
            <div class="form-actions" style="margin-top: 30px;">
                <button class="btn primary" onclick="filtrar()">
                    Aplicar Filtros
                </button>
                <button class="btn" onclick="limparFiltrosChecklist()">
                    Limpar Filtros
                </button>
                <button class="btn secondary" onclick="gerarRelatorioChecklist()">
                    Gerar Relatório
                </button>
            </div>
        </div>
        
        <div class="table-container" style="margin-top: 30px;">
            <h3>Checklist Encontrados</h3>
            <table class="tabela-relatorio">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Evento</th>
                        <th>Data</th>
                        <th>Status</th>
                        <th>Itens</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="6" class="text-center">
                            <p>Nenhum checklist encontrado. Aplique os filtros para visualizar.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function gerarFormularioManutencoes() {
    return `
        <div class="form-group">
            <h3>Filtros de Manutenções</h3>
            <div class="form-row">
                <div class="form-col">
                    <label>Buscar:</label>
                    <input type="text" placeholder="Buscar manutenção..." style="width: 100%;">
                </div>
                <div class="form-col">
                    <label>Período:</label>
                    <select style="width: 100%;">
                        <option>Últimos 30 dias</option>
                        <option>Últimos 7 dias</option>
                        <option>Este mês</option>
                        <option>Personalizado</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row" style="margin-top: 20px;">
                <div class="form-col">
                    <label>Tipo:</label>
                    <select style="width: 100%;">
                        <option>Todos</option>
                        <option>Preventiva</option>
                        <option>Corretiva</option>
                        <option>Preditiva</option>
                    </select>
                </div>
                <div class="form-col">
                    <label>Veículo/Equipamento:</label>
                    <select style="width: 100%;">
                        <option>Todos</option>
                        <option>Veículos</option>
                        <option>Equipamentos</option>
                        <option>Figurinos</option>
                    </select>
                </div>
            </div>
            
            <div class="form-actions" style="margin-top: 30px;">
                <button class="btn primary" onclick="filtrarManutencoes()">
                    Aplicar Filtros
                </button>
                <button class="btn" onclick="limparFiltrosManutencoes()">
                    Limpar Filtros
                </button>
                <button class="btn secondary" onclick="novaManutencAção()">
                    Nova Manutenção
                </button>
            </div>
        </div>
        
        <div class="table-container" style="margin-top: 30px;">
            <h3>Manutenções Agendadas/Realizadas</h3>
            <table class="tabela-relatorio">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descrição</th>
                        <th>Tipo</th>
                        <th>Data</th>
                        <th>Custo</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="7" class="text-center">
                            <p>Nenhuma manutenção encontrada. Aplique os filtros para visualizar.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function gerarFormularioContasReceber() {
    return `
        <div class="form-group">
            <h3>Contas a Receber - Eventos</h3>
            <div class="form-row">
                <div class="form-col">
                    <label>Buscar Cliente/Evento:</label>
                    <input type="text" placeholder="Nome do cliente ou evento..." style="width: 100%;">
                </div>
                <div class="form-col">
                    <label>Vencimento:</label>
                    <select style="width: 100%;">
                        <option>Todos</option>
                        <option>Vencidas</option>
                        <option>Hoje</option>
                        <option>Esta semana</option>
                        <option>Este mês</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row" style="margin-top: 20px;">
                <div class="form-col">
                    <label>Status Pagamento:</label>
                    <select style="width: 100%;">
                        <option>Todos</option>
                        <option>Pendente</option>
                        <option>Parcial</option>
                        <option>Pago</option>
                        <option>Atrasado</option>
                    </select>
                </div>
                <div class="form-col">
                    <label>Tipo Evento:</label>
                    <select style="width: 100%;">
                        <option>Todos</option>
                        <option>Aniversário</option>
                        <option>Casamento</option>
                        <option>Corporativo</option>
                        <option>Outros</option>
                    </select>
                </div>
            </div>
            
            <div class="form-actions" style="margin-top: 30px;">
                <button class="btn primary" onclick="filtrarContasReceber()">
                    Aplicar Filtros
                </button>
                <button class="btn" onclick="limparFiltrosContasReceber()">
                    Limpar Filtros
                </button>
                <button class="btn secondary" onclick="novoRecebimento()">
                    Registrar Recebimento
                </button>
            </div>
        </div>
        
        <div class="table-container" style="margin-top: 30px;">
            <h3>Contas a Receber</h3>
            <table class="tabela-relatorio">
                <thead>
                    <tr>
                        <th>Evento</th>
                        <th>Cliente</th>
                        <th>Valor Total</th>
                        <th>Recebido</th>
                        <th>Pendente</th>
                        <th>Vencimento</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="8" class="text-center">
                            <p>Nenhuma conta a receber encontrada. Aplique os filtros para visualizar.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="stats-container" style="margin-top: 30px; display: flex; gap: 20px;">
            <div class="stat-card" style="flex: 1;">
                <div class="stat-icon"></div>
                <div class="stat-content">
                    <div class="stat-value">R$ 0,00</div>
                    <div class="stat-label">Total a Receber</div>
                </div>
            </div>
            <div class="stat-card" style="flex: 1;">
                <div class="stat-icon"></div>
                <div class="stat-content">
                    <div class="stat-value">0</div>
                    <div class="stat-label">Vencidas</div>
                </div>
            </div>
            <div class="stat-card" style="flex: 1;">
                <div class="stat-icon"></div>
                <div class="stat-content">
                    <div class="stat-value">R$ 0,00</div>
                    <div class="stat-label">Recebido Mês</div>
                </div>
            </div>
        </div>
    `;
}

function gerarFormularioContasPagar(tipo) {
    const tipos = {
        'elenco': { label: '📋­ Elenco', icon: '📋­' },
        'motoristas': { label: '📋 Motoristas', icon: '📋' },
        'producao': { label: '📋· Produção', icon: '📋·' },
        'fornecedores': { label: '📋¢ Fornecedores', icon: '📋¢' },
        'funcionarios': { label: '📋 Funcionários', icon: '📋' }
    };

    const config = tipos[tipo] || { label: tipo, icon: '📋°' };

    return `
        <div class="form-group">
            <h3>${config.icon} Contas a Pagar - ${config.label}</h3>
            <div class="form-row">
                <div class="form-col">
                    <label>Buscar:</label>
                    <input type="text" placeholder="Nome..." style="width: 100%;">
                </div>
                <div class="form-col">
                    <label>Vencimento:</label>
                    <select style="width: 100%;">
                        <option>Todos</option>
                        <option>Vencidas</option>
                        <option>Hoje</option>
                        <option>Esta semana</option>
                        <option>Este mês</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row" style="margin-top: 20px;">
                <div class="form-col">
                    <label>Status Pagamento:</label>
                    <select style="width: 100%;">
                        <option>Todos</option>
                        <option>Pendente</option>
                        <option>Parcial</option>
                        <option>Pago</option>
                        <option>Atrasado</option>
                    </select>
                </div>
                <div class="form-col">
                    <label>Categoria:</label>
                    <select style="width: 100%;">
                        <option>Todas</option>
                        <option>Salário</option>
                        <option>Diária</option>
                        <option>Serviço</option>
                        <option>Produto</option>
                        <option>Outros</option>
                    </select>
                </div>
            </div>
            
            <div class="form-actions" style="margin-top: 30px;">
                <button class="btn primary" onclick="filtrarContasPagar('${tipo}')">
                    Aplicar Filtros
                </button>
                <button class="btn" onclick="limparFiltrosContasPagar('${tipo}')">
                    Limpar Filtros
                </button>
                <button class="btn secondary" onclick="novoPagamento('${tipo}')">
                    Novo Pagamento
                </button>
            </div>
        </div>
        
        <div class="table-container" style="margin-top: 30px;">
            <h3>${config.icon} Contas a Pagar - ${config.label}</h3>
            <table class="tabela-relatorio">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Vencimento</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="6" class="text-center">
                            <p>Nenhuma conta a pagar encontrada. Aplique os filtros para visualizar.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function gerarFormularioFluxoCaixa() {
    return `
        <div class="form-group">
            <h3>Fluxo de Caixa</h3>
            <div class="form-row">
                <div class="form-col">
                    <label>Período:</label>
                    <select id="periodoFluxo" style="width: 100%;" onchange="atualizarFluxoCaixa()">
                        <option value="hoje">Hoje</option>
                        <option value="semana">Esta Semana</option>
                        <option value="mes" selected>Este Mês</option>
                        <option value="trimestre">Este Trimestre</option>
                        <option value="ano">Este Ano</option>
                        <option value="personalizado">Personalizado</option>
                    </select>
                </div>
                <div class="form-col">
                    <label>Tipo:</label>
                    <select style="width: 100%;">
                        <option>Todos</option>
                        <option>Receitas</option>
                        <option>Despesas</option>
                    </select>
                </div>
            </div>
            
            <!-- Período personalizado (inicialmente oculto) -->
            <div id="periodoPersonalizado" style="display: none; margin-top: 20px;">
                <div class="form-row">
                    <div class="form-col">
                        <label>Data Inicial:</label>
                        <input type="date" style="width: 100%;">
                    </div>
                    <div class="form-col">
                        <label>Data Final:</label>
                        <input type="date" style="width: 100%;">
                    </div>
                </div>
            </div>
            
            <div class="form-actions" style="margin-top: 30px;">
                <button class="btn primary" onclick="gerarRelatorioFluxoCaixa()">
                Gerar Relatório
                </button>
                <button class="btn secondary" onclick="exportarFluxoCaixa()">
                 Exportar Excel
                </button>
                <button class="btn" onclick="imprimirFluxoCaixa()">
                 Imprimir
                </button>
            </div>
        </div>
        
        <!-- Resumo do Fluxo de Caixa -->
        <div class="stats-container" style="margin-top: 30px; display: flex; gap: 20px;">
            <div class="stat-card" style="flex: 1; background: #e8f5e9;">
                <div class="stat-icon" style="color: #2e7d32;"></div>
                <div class="stat-content">
                    <div class="stat-value" style="color: #2e7d32;">R$ 0,00</div>
                    <div class="stat-label">Receitas</div>
                </div>
            </div>
            <div class="stat-card" style="flex: 1; background: #ffebee;">
                <div class="stat-icon" style="color: #c62828;"></div>
                <div class="stat-content">
                    <div class="stat-value" style="color: #c62828;">R$ 0,00</div>
                    <div class="stat-label">Despesas</div>
                </div>
            </div>
            <div class="stat-card" style="flex: 1; background: #e3f2fd;">
                <div class="stat-icon" style="color: #1565c0;"></div>
                <div class="stat-content">
                    <div class="stat-value" style="color: #1565c0;">R$ 0,00</div>
                    <div class="stat-label">Saldo</div>
                </div>
            </div>
        </div>
        
        <!-- Gráfico (simulado) -->
        <div style="margin-top: 30px; background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center;">
            <h4>Gráfico do Fluxo de Caixa</h4>
            <p style="color: #666;">Gráfico será exibido aqui após gerar o relatório.</p>
        </div>
    `;
}

function gerarFormularioOrcamentos() {
    return `
        <div class="form-group">
            <h3>Orçamentos</h3>
            <div class="form-row">
                <div class="form-col">
                    <label>Buscar:</label>
                    <input type="text" placeholder="Cliente, evento ou ID..." style="width: 100%;">
                </div>
                <div class="form-col">
                    <label>Status:</label>
                    <select style="width: 100%;">
                        <option>Todos</option>
                        <option>Pendente</option>
                        <option>Aprovado</option>
                        <option>Recusado</option>
                        <option>Expirado</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row" style="margin-top: 20px;">
                <div class="form-col">
                    <label>Valor:</label>
                    <select style="width: 100%;">
                        <option>Todos</option>
                        <option>Até R$ 1.000</option>
                        <option>R$ 1.000 - R$ 5.000</option>
                        <option>Acima de R$ 5.000</option>
                    </select>
                </div>
                <div class="form-col">
                    <label>Tipo Evento:</label>
                    <select style="width: 100%;">
                        <option>Todos</option>
                        <option>Aniversário</option>
                        <option>Casamento</option>
                        <option>Corporativo</option>
                    </select>
                </div>
            </div>
            
            <div class="form-actions" style="margin-top: 30px;">
                <button class="btn primary" onclick="filtrarOrcamentos()">
                    Aplicar Filtros
                </button>
                <button class="btn" onclick="limparFiltrosOrcamentos()">
                    Limpar Filtros
                </button>
                <button class="btn secondary" onclick="novoOrcamento()">
                    Novo Orçamento
                </button>
            </div>
        </div>
        
        <div class="table-container" style="margin-top: 30px;">
            <h3>Orçamentos</h3>
            <table class="tabela-relatorio">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Evento</th>
                        <th>Valor</th>
                        <th>Data</th>
                        <th>Validade</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="8" class="text-center">
                            <p>Nenhum orçamento encontrado. Aplique os filtros para visualizar.</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <!-- Botões de ação rápida -->
        <div class="form-actions" style="margin-top: 30px; justify-content: space-around;">
            <button class="btn" onclick="gerarRelatorioOrcamentos()">
                Relatório Completo
            </button>
            <button class="btn secondary" onclick="exportarOrcamentos()">
                Exportar Excel
            </button>
            <button class="btn primary" onclick="enviarLembreteOrcamentos()">
                Enviar Lembretes
            </button>
        </div>
    `;
}

// ==================== FUNÇÕES AUXILIARES ====================

function carregarDadosRelatorio(pageId, config) {
    const container = document.getElementById(`conteudoRelatorio_${pageId}`);
    if (!container) return;

    // Simular carregamento
    container.innerHTML = '<p>Carregando dados do relatório...</p>';

    // Carregar dados do localStorage
    setTimeout(() => {
        const dados = obterDadosDoStorage(config.tipo);
        
        if (dados.length === 0) {
            container.innerHTML = `
                <div class="sem-dados">
                    <div class="sem-dados-icon"></div>
                    <h3>Nenhum dado encontrado</h3>
                    <p>Não há ${config.tipo} cadastrados para exibir.</p>
                </div>
            `;
        } else {
            container.innerHTML = gerarTabelaRelatorio(dados, config);
        }
    }, 500);
}

function obterDadosDoStorage(tipo) {
    const mapeamento = {
        'eventos': 'eventos_cadastrados',
        'clientes': 'clientes_cadastrados',
        'personagens': 'personagens_cadastrados',
        'casa_de_festas': 'casa_de_festas_cadastrados',
        'elenco': 'elenco_cadastrados',
        'motoristas': 'motoristas_cadastrados',
        'funcionarios': 'funcionarios_cadastrados',
        'producao': 'funcionarios_cadastrados', // Produção vem de funcionários com aceita_producao = sim
        'checklist': 'checklist_cadastradas',
        'manutencoes': 'manutencoes_cadastradas'
    };

    const chave = mapeamento[tipo];
    if (!chave) return [];

    try {
        return JSON.parse(localStorage.getItem(chave) || '[]');
    } catch (error) {
        console.error('Erro Ação carregar dados:', error);
        return [];
    }
}

function gerarTabelaRelatorio(dados, config) {
    let html = `
        <div class="table-container">
            <div class="table-actions" style="display: flex; gap: 1rem; margin-bottom: 15px; align-items: flex-end;">
                <div class="form-group" style="min-width: 150px;">
                    <label>Filtrar por</label>
                    <select id="tipoFiltro_${config.tipo}" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                        <option value="todos">Todos os campos</option>
                        <option value="nome">Nome</option>
                        <option value="documento">Documento</option>
                        <option value="email">Email</option>
                    </select>
                </div>
                <div class="form-group" style="min-width: 250px;">
                    <label>Buscar</label>
                    <input type="text" id="inputBusca_${config.tipo}" placeholder="Digite para buscar..." 
                           onkeyup="filtrarTabelaPorTipo('${config.tipo}')" 
                           style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                </div>
            </div>
            <table class="tabela-relatorio" id="tabela${config.tipo}">
    `;

    // Cabeçalhos baseados no tipo
    const headers = {
        'eventos': ['ID', 'Evento', 'Cliente', 'Data', 'Local', 'Valor', 'Status', 'Ações'],
        'clientes': ['ID', 'Nome', 'Documento', 'Telefone', 'Email', 'Cadastro', 'Status', 'Ações'],
        'personagens': ['ID', 'Nome', 'Figurino', 'Tema', 'Valor', 'Cadastro', 'Status', 'Ações'],
        'casa_de_festas': ['ID', 'Nome', 'Documento', 'Telefone', 'Email', 'Cadastro', 'Status', 'Ações']
    };
    const cabecalhos = headers[config.tipo] || ['ID', 'Nome', 'Detalhes', 'Data', 'Ações'];

    html += '<thead><tr>';
    cabecalhos.forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead><tbody>';

    if (dados.length === 0) {
        html += `
            <tr>
                <td colspan="${cabecalhos.length}" class="text-center">
                    Nenhum dado encontrado
                </td>
            </tr>
        `;
    } else {
        dados.forEach((item, index) => {
            html += '<tr>';
            
            switch(config.tipo) {
                case 'eventos':
                    html += `
                        <td><code>${item.id || index + 1}</code></td>
                        <td><strong>${item.nome_evento || '--'}</strong></td>
                        <td>${item.cliente || '--'}</td>
                        <td>${formatarData(item.data_evento)}</td>
                        <td>${item.local || '--'}</td>
                        <td>R$ ${(parseFloat(item.valor) || 0).toFixed(2).replace('.', ',')}</td>
                        <td><span class="status-badge ${item.status || 'pendente'}">${item.status || 'Pendente'}</span></td>
                        <td>
                            <button class="btn small" onclick="visualizarCadastro('eventos', '${item.id}')">Visualizar</button>
                        </td>
                    `;
                    break;
                    
                case 'clientes':
                    html += `
                        <td><code>${item.id || index + 1}</code></td>
                        <td><strong>${item.nome_clientes || item.nome || '--'}</strong></td>
                        <td>${formatarDocumento(item.doc_clientes_cadastro || '')}</td>
                        <td>${formatarTelefone(item.telefone_cliente || '')}</td>
                        <td>${item.email_cliente || '--'}</td>
                        <td>${formatarData(item.dataCadastro)}</td>
                        <td><span class="status-badge ativo">Ativo</span></td>
                        <td>
                            <button class="btn small" onclick="visualizarCadastro('clientes', '${item.id}')" title="Visualizar">Visualizar</button>
                            <button class="btn small" onclick="editarCadastro('clientes', '${item.id}')" title="Editar">Editar</button>
                        </td>
                    `;
                    break;
                    
                case 'casa_de_festas':
                    html += `
                        <td><code>${item.id || index + 1}</code></td>
                        <td><strong>${item.nome_casa_de_festas || '--'}</strong></td>
                        <td>${formatarDocumento(item.doc_casa_de_festas_cadastro || '')}</td>
                        <td>${formatarTelefone(item.telefone_casa_de_festas || '')}</td>
                        <td>${item.email_casa_de_festas || '--'}</td>
                        <td>${formatarData(item.dataCadastro)}</td>
                        <td><span class="status-badge ativo">Ativo</span></td>
                        <td>
                            <button class="btn small" onclick="visualizarCadastro('casa_de_festas', '${item.id}')" title="Visualizar">Visualizar</button>
                            <button class="btn small" onclick="editarCadastro('casa_de_festas', '${item.id}')" title="Editar">Editar</button>
                        </td>
                    `;
                    break;
                    
                case 'personagens':
                    html += `
                        <td><code>${item.id || item.ID_personagens || index + 1}</code></td>
                        <td><strong>${item.nome_personagens || '--'}</strong></td>
                        <td>${item.figurino || '--'}</td>
                        <td>${item.tema || '--'}</td>
                        <td>${item.valor_personagens || 'R$ 0,00'}</td>
                        <td>${formatarData(item.dataCadastro)}</td>
                        <td><span class="status-badge ${item.status || 'disponivel'}">${item.status === 'disponivel' ? 'Disponível' : 'Indisponível'}</span></td>
                        <td>
                            <button class="btn small" onclick="visualizarCadastro('personagens', '${item.id || item.ID_personagens}')" title="Visualizar">Visualizar</button>
                            <button class="btn small" onclick="editarCadastro('personagens', '${item.id || item.ID_personagens}')" title="Editar">Editar</button>
                        </td>
                    `;
                    break;
                    
                default:
                    html += `
                        <td><code>${item.id || index + 1}</code></td>
                        <td>${item.nome || item.nome_personagens || '--'}</td>
                        <td>${item.detalhes || item.figurino || '--'}</td>
                        <td>${formatarData(item.data_cadastro)}</td>
                        <td>
                            <button class="btn small" onclick="visualizarCadastro('${item.entidade}', '${item.id}')">Visualizar</button>
                            <button class="btn small secondary" onclick="editarCadastro('${item.entidade}', '${item.id}')">Editar</button>
                        </td>
                    `;
            }
            
            html += '</tr>';
        });
    }

    html += '</tbody></table></div>';
    return html;
}

// ==================== FUNÇÕES DE EXPORTAÇÃO E IMPRESSÃO ====================

function exportarRelatorio(pageId) {
    const table = document.querySelector(`#${pageId} table`);
    if (!table) {
        alert('Nenhuma tabela encontrada para exportar');
        return;
    }

    const csv = tableToCSV(table);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_${pageId}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    alert('Relatório exportado com sucesso!');
}

function imprimirRelatorio(pageId) {
    const content = document.getElementById(pageId);
    if (!content) {
        alert('Conteúdo não encontrado para impressão');
        return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Relatório - ${pageId}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f5f5f5; }
                    .print-header { text-align: center; margin-bottom: 30px; }
                    .print-date { text-align: right; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="print-header">
                    <h1>Relatório - ${pageId}</h1>
                    <div class="print-date">Gerado em: ${new Date().toLocaleString('pt-BR')}</div>
                </div>
                ${content.innerHTML}
            </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

function tableToCSV(table) {
    const rows = Array.from(table.querySelectorAll('tr'));
    return rows.map(row => {
        const cols = Array.from(row.querySelectorAll('th,td'));
        return cols.map(col => {
            // Remover emojis e formatar texto
            let text = col.innerText.trim();
            text = text.replace(/[\n\r]/g, ' '); // Remover quebras de linha
            text = text.replace(/"/g, '""'); // Escapar aspas duplas
            return `"${text}"`;
        }).join(',');
    }).join('\n');
}

// ==================== FUNÇÕES DE FILTRO ====================

function filtrarTabela(input, tableId) {
    const filter = input.value.toLowerCase();
    const table = document.getElementById(tableId);
    if (!table) return;

    const rows = table.getElementsByTagName('tr');
    
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        let found = false;
        
        for (let j = 0; j < cells.length; j++) {
            const cellText = cells[j].textContent || cells[j].innerText;
            if (cellText.toLowerCase().includes(filter)) {
                found = true;
                break;
            }
        }
        
        row.style.display = found ? '' : 'none';
    }
}

function filtrarTabelaPorTipo(tipo) {
    const tipoFiltro = document.getElementById(`tipoFiltro_${tipo}`)?.value;
    const inputBusca = document.getElementById(`inputBusca_${tipo}`)?.value.toLowerCase();
    const table = document.getElementById(`tabela${tipo}`);
    
    if (!table || !inputBusca) return;
    
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        let found = false;
        
        if (tipoFiltro === 'todos') {
            for (let j = 0; j < cells.length; j++) {
                const cellText = cells[j].textContent || cells[j].innerText;
                if (cellText.toLowerCase().includes(inputBusca)) {
                    found = true;
                    break;
                }
            }
        } else {
            // Buscar em colunas específicas baseado no tipo
            const colunasMap = {
                'nome': 1,
                'documento': 2,
                'email': 4
            };
            
            const coluna = colunasMap[tipoFiltro];
            if (cells[coluna]) {
                const cellText = cells[coluna].textContent || cells[coluna].innerText;
                found = cellText.toLowerCase().includes(inputBusca);
            }
        }
        
        row.style.display = found ? '' : 'none';
    }
}

// ==================== FUNÇÕES DE FORMATAÇÃO ====================

function formatarData(dataString) {
    if (!dataString) return '--';
    try {
        const data = new Date(dataString);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    } catch {
        return dataString;
    }
}

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

// ==================== FUNÇÕES DE CONFIGURAÇÃO ====================

function configurarBotoesRelatorios() {
    console.log('📋 Configurando botões de relatórios...');
    
    document.querySelectorAll('[data-page]').forEach(button => {
        const pageId = button.getAttribute('data-page');
        
        button.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Salvar página atual
            localStorage.setItem('currentPage', pageId);
            
            // Carregar o relatório
            setTimeout(() => {
                carregarRelatorio(pageId);
            }, 100);
        };
        
        console.log(`Botão configurado: ${pageId}`);
    });
    
    // Configurar navegação do menu lateral
    document.querySelectorAll('.sidebar-nav button').forEach(button => {
        button.addEventListener('click', function(e) {
            const pageId = this.getAttribute('data-page');
            
            if (pageId && (pageId.includes('relatorios') || pageId.includes('lista_'))) {
                setTimeout(() => {
                    if (document.getElementById(pageId)?.classList.contains('active')) {
                        carregarRelatorio(pageId);
                    }
                }, 200);
            }
        });
    });
    
    console.log('Todos os botões de relatórios configurados');
}

// ==================== FUNÇÕES DE FORMULÁRIO (Placeholders) ====================

// Funções placeholder para os botões dos formulários
function filtrarChecklist() { alert('Função filtrarChecklist() em desenvolvimento'); }
function limparFiltrosChecklist() { alert('Função limparFiltrosChecklist() em desenvolvimento'); }
function gerarRelatorioChecklist() { alert('Função gerarRelatorioChecklist() em desenvolvimento'); }

function filtrarManutencoes() { alert('Função filtrarManutencoes() em desenvolvimento'); }
function limparFiltrosManutencoes() { alert('Função limparFiltrosManutencoes() em desenvolvimento'); }
function novaManutencAção() { alert('Função novaManutencAção() em desenvolvimento'); }

function filtrarContasReceber() { alert('Função filtrarContasReceber() em desenvolvimento'); }
function limparFiltrosContasReceber() { alert('Função limparFiltrosContasReceber() em desenvolvimento'); }
function novoRecebimento() { alert('Função novoRecebimento() em desenvolvimento'); }

function filtrarContasPagar(tipo) { alert(`Função filtrarContasPagar(${tipo}) em desenvolvimento`); }
function limarFiltrosContasPagar(tipo) { alert(`Função limarFiltrosContasPagar(${tipo}) em desenvolvimento`); }
function novoPagamento(tipo) { alert(`Função novoPagamento(${tipo}) em desenvolvimento`); }

function atualizarFluxoCaixa() { alert('Função atualizarFluxoCaixa() em desenvolvimento'); }
function gerarRelatorioFluxoCaixa() { alert('Função gerarRelatorioFluxoCaixa() em desenvolvimento'); }
function exportarFluxoCaixa() { alert('Função exportarFluxoCaixa() em desenvolvimento'); }
function imprimirFluxoCaixa() { alert('Função imprimirFluxoCaixa() em desenvolvimento'); }

function filtrarOrcamentos() { alert('Função filtrarOrcamentos() em desenvolvimento'); }
function limparFiltrosOrcamentos() { alert('Função limparFiltrosOrcamentos() em desenvolvimento'); }
function novoOrcamento() { alert('Função novoOrcamento() em desenvolvimento'); }
function gerarRelatorioOrcamentos() { alert('Função gerarRelatorioOrcamentos() em desenvolvimento'); }
function exportarOrcamentos() { alert('Função exportarOrcamentos() em desenvolvimento'); }
function enviarLembreteOrcamentos() { alert('Função enviarLembreteOrcamentos() em desenvolvimento'); }

// ==================== INICIALIZAÇÃO ====================

// Exportar funções globais
window.carregarRelatorio = carregarRelatorio;
window.exibirFormularioRelatorio = exibirFormularioRelatorio;
window.exportarRelatorio = exportarRelatorio;
window.imprimirRelatorio = imprimirRelatorio;
window.tableToCSV = tableToCSV;
window.filtrarTabela = filtrarTabela;
window.filtrarTabelaPorTipo = filtrarTabelaPorTipo;
window.formatarData = formatarData;
window.formatarDocumento = formatarDocumento;
window.formatarTelefone = formatarTelefone;

// Funções de visualizar e editar cadastro
function visualizarCadastro(tipo, id) {
    console.log(`Visualizar ${tipo} - ID: ${id}`);
    
    const chaveStorage = `${tipo}_cadastrados`;
    const dados = JSON.parse(localStorage.getItem(chaveStorage) || '[]');
    const item = dados.find(d => d.id === id || d[`ID_${tipo}`] === id);
    
    if (!item) {
        alert('Registro não encontrado!');
        return;
    }
    
    // Criar modal de visualização
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;';
    
    const conteudo = document.createElement('div');
    conteudo.style.cssText = 'background: white; padding: 2rem; border-radius: 8px; max-width: 600px; max-height: 80vh; overflow-y: auto;';
    
    let html = `<h2>Visualizar ${tipo}</h2><hr style="margin: 1rem 0;">`;
    
    for (const [key, value] of Object.entries(item)) {
        if (key !== 'id' && !key.startsWith('ID_')) {
            html += `<p><strong>${key}:</strong> ${value || '-'}</p>`;
        }
    }
    
    html += `<button class="btn" onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="margin-top: 1rem;">Fechar</button>`;
    
    conteudo.innerHTML = html;
    modal.appendChild(conteudo);
    document.body.appendChild(modal);
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    };
}

function editarCadastro(tipo, id) {
    console.log(`Editar ${tipo} - ID: ${id}`);
    
    // Navegar para a página de cadastro
    if (typeof showPage === 'function') {
        showPage(tipo);
        
        // Carregar dados no formulário após um pequeno delay
        setTimeout(() => {
            const chaveStorage = `${tipo}_cadastrados`;
            const dados = JSON.parse(localStorage.getItem(chaveStorage) || '[]');
            const item = dados.find(d => d.id === id || d[`ID_${tipo}`] === id);
            
            if (item) {
                // Preencher formulário com os dados
                for (const [key, value] of Object.entries(item)) {
                    const campo = document.getElementById(key);
                    if (campo) {
                        campo.value = value;
                    }
                }
            }
        }, 500);
    } else {
        alert('Função de navegação não encontrada');
    }
}

window.visualizarCadastro = visualizarCadastro;
window.editarCadastro = editarCadastro;

// Funções dos formulários
window.filtrarChecklist = filtrarChecklist;
window.limparFiltrosChecklist = limparFiltrosChecklist;
window.gerarRelatorioChecklist = gerarRelatorioChecklist;
window.filtrarManutencoes = filtrarManutencoes;
window.limparFiltrosManutencoes = limparFiltrosManutencoes;
window.novaManutencAção = novaManutencAção;
window.filtrarContasReceber = filtrarContasReceber;
window.limparFiltrosContasReceber = limparFiltrosContasReceber;
window.novoRecebimento = novoRecebimento;
window.filtrarContasPagar = filtrarContasPagar;
window.limarFiltrosContasPagar = limarFiltrosContasPagar;
window.novoPagamento = novoPagamento;
window.atualizarFluxoCaixa = atualizarFluxoCaixa;
window.gerarRelatorioFluxoCaixa = gerarRelatorioFluxoCaixa;
window.exportarFluxoCaixa = exportarFluxoCaixa;
window.imprimirFluxoCaixa = imprimirFluxoCaixa;
window.filtrarOrcamentos = filtrarOrcamentos;
window.limparFiltrosOrcamentos = limparFiltrosOrcamentos;
window.novoOrcamento = novoOrcamento;
window.gerarRelatorioOrcamentos = gerarRelatorioOrcamentos;
window.exportarOrcamentos = exportarOrcamentos;
window.enviarLembreteOrcamentos = enviarLembreteOrcamentos;

// Adicionar Ação carregamento da página
document.addEventListener('DOMContentLoaded', function() {
    configurarBotoesRelatorios();
    
    // Carregar relatório se estiver em uma página de relatório ou lista
    const currentPage = localStorage.getItem('currentPage');
    if (currentPage && (currentPage.includes('relatorio') || currentPage.includes('lista_'))) {
        setTimeout(() => {
            if (document.getElementById(currentPage)?.classList.contains('active')) {
                carregarRelatorio(currentPage);
            }
        }, 500);
    }
});
// Adicione no início do seu scriptindex.js ou relatorios.js
console.log("=== DEBUG RELATÓRIOS ===");
console.log("Página atual:", window.location.hash);

// Verifique se as seções existem
const sections = document.querySelectorAll('.page');
console.log("Seções encontradas:", sections.length);

sections.forEach(section => {
  console.log("Seção ID:", section.id, "Visível:", section.style.display);
});

console.log('Relatórios.js carregado com sucesso - Formulários ativos');


// ==================== RELATÓRIOS DE EQUIPE E PERSONAGENS ====================

// Função para carregar relatório de personagens
function carregarRelatorioPersonagens() {
    const personagens = JSON.parse(localStorage.getItem('personagens_cadastrados') || '[]');
    const tbody = document.getElementById('tabelaPersonagens');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (personagens.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center;">Nenhum personagem cadastrado</td></tr>';
        return;
    }
    
    personagens.forEach((personagem) => {
        const tr = document.createElement('tr');
        
        // Foto
        if (personagem.foto_personagem) {
            tr.innerHTML += `<td><img src="${personagem.foto_personagem}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>`;
        } else {
            tr.innerHTML += '<td><span style="color: #999;">Sem foto</span></td>';
        }
        
        tr.innerHTML += `<td>${personagem.nome_personagens || '-'}</td>`;
        tr.innerHTML += `<td>${personagem.figurino || '-'}</td>`;
        tr.innerHTML += `<td>${personagem.tema || '-'}</td>`;
        tr.innerHTML += `<td>${personagem.quantidade || '0'}</td>`;
        tr.innerHTML += `<td>${personagem.valor_personagens || 'R$ 0,00'}</td>`;
        tr.innerHTML += `<td>0</td>`;
        
        // Status
        const statusCell = document.createElement('td');
        const statusSelect = document.createElement('select');
        statusSelect.style.padding = '4px 8px';
        statusSelect.style.borderRadius = '4px';
        statusSelect.style.border = '1px solid #ddd';
        
        const opcAçãoDisponivel = document.createElement('option');
        opcAçãoDisponivel.value = 'disponivel';
        opcAçãoDisponivel.textContent = 'DisponÃ­vel';
        
        const opcAçãoIndisponivel = document.createElement('option');
        opcAçãoIndisponivel.value = 'indisponivel';
        opcAçãoIndisponivel.textContent = 'IndisponÃ­vel';
        
        statusSelect.appendChild(opcAçãoDisponivel);
        statusSelect.appendChild(opcAçãoIndisponivel);
        statusSelect.value = personagem.status || 'disponivel';
        
        if (statusSelect.value === 'disponivel') {
            statusSelect.style.backgroundColor = '#d4edda';
            statusSelect.style.color = '#155724';
        } else {
            statusSelect.style.backgroundColor = '#f8d7da';
            statusSelect.style.color = '#721c24';
        }
        
        statusSelect.onchange = function() {
            if (this.value === 'disponivel') {
                this.style.backgroundColor = '#d4edda';
                this.style.color = '#155724';
            } else {
                this.style.backgroundColor = '#f8d7da';
                this.style.color = '#721c24';
            }
            atualizarStatusPersonagem(personagem.ID_personagens, this.value);
        };
        
        statusCell.appendChild(statusSelect);
        tr.appendChild(statusCell);
        
        // AÃ§Ãµes
        const acoesCell = document.createElement('td');
        acoesCell.innerHTML = `
            <button class="btn small" onclick="visualizarPersonagem('${personagem.ID_personagens}')" title="Visualizar">Visualizar</button>
            <button class="btn small" onclick="editarPersonagem('${personagem.ID_personagens}')" title="Editar">Editar</button>
        `;
        tr.appendChild(acoesCell);
        
        tbody.appendChild(tr);
    });
}

// FunÃ§Ã£o para carregar relatÃ³rio de elenco
function carregarRelatorioElenco() {
    const elenco = JSON.parse(localStorage.getItem('elenco_cadastrados') || '[]');
    const tbody = document.getElementById('tabelaElenco');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (elenco.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center;">Nenhum membro do elenco cadastrado</td></tr>';
        return;
    }
    
    elenco.forEach((membro) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${membro.ID_elenco || '-'}</td>
            <td>${membro.nome_elenco || '-'}</td>
            <td>${membro.doc_elenco_cadastro || '-'}</td>
            <td>${membro.idade_elenco || '-'}</td>
            <td>${membro.telefone_elenco || '-'}</td>
            <td>${membro.email_elenco || '-'}</td>
            <td>${membro.cidade_elenco || '-'}</td>
            <td>0</td>
        `;
        
        // Status
        const statusCell = document.createElement('td');
        const statusSelect = document.createElement('select');
        statusSelect.style.padding = '4px 8px';
        statusSelect.style.borderRadius = '4px';
        statusSelect.style.border = '1px solid #ddd';
        
        const opcAçãoAtivo = document.createElement('option');
        opcAçãoAtivo.value = 'ativo';
        opcAçãoAtivo.textContent = 'Ativo';
        
        const opcAçãoInativo = document.createElement('option');
        opcAçãoInativo.value = 'inativo';
        opcAçãoInativo.textContent = 'Inativo';
        
        statusSelect.appendChild(opcAçãoAtivo);
        statusSelect.appendChild(opcAçãoInativo);
        statusSelect.value = membro.status || 'ativo';
        
        if (statusSelect.value === 'ativo') {
            statusSelect.style.backgroundColor = '#d4edda';
            statusSelect.style.color = '#155724';
        } else {
            statusSelect.style.backgroundColor = '#f8d7da';
            statusSelect.style.color = '#721c24';
        }
        
        statusSelect.onchange = function() {
            if (this.value === 'ativo') {
                this.style.backgroundColor = '#d4edda';
                this.style.color = '#155724';
            } else {
                this.style.backgroundColor = '#f8d7da';
                this.style.color = '#721c24';
            }
            atualizarStatusElenco(membro.ID_elenco, this.value);
        };
        
        statusCell.appendChild(statusSelect);
        tr.appendChild(statusCell);
        
        // Ações
        const acoesCell = document.createElement('td');
        acoesCell.innerHTML = `
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn-icon" onclick="visualizarElenco('${membro.ID_elenco}')" title="Visualizar">Visualizar</button>
                <button class="btn-icon" onclick="editarElenco('${membro.ID_elenco}')" title="Editar">Editar</button>
                <button class="btn-icon" onclick="excluirElenco('${membro.ID_elenco}')" title="Excluir">Excluir</button>
            </div>
        `;
        tr.appendChild(acoesCell);
        
        tbody.appendChild(tr);
    });
}

// FunÃ§Ã£o para carregar relatÃ³rio de produÃ§Ã£o
function carregarRelatorioProducAção() {
    const elenco = JSON.parse(localStorage.getItem('elenco_cadastrados') || '[]');
    console.log('Total elenco:', elenco.length);
    
    const producAção = elenco.filter(m => m.aceita_producAção_elenco === 'sim');
    const produção = motoristas.filter(m => m.aceita_producAção_motorista === 'sim');
    console.log('Membros que aceitam produção:', produção.length);
    console.log('Dados produção:', produção);
    
    const tbody = document.getElementById('tabelaProdução');
    
    if (!tbody) {
        console.error('Tabela de produção não encontrada!');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (producAção.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center;">Nenhum membro da produÃ§Ã£o cadastrado. Cadastre elenco e motorista com "Aceita ProduÃ§Ã£o: Sim"</td></tr>';
        return;
    }
    
    producAção.forEach((membro) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${membro.ID_elenco || '-'}</td>
            <td>${membro.nome_elenco || '-'}</td>
            <td>ProduÃ§Ã£o</td>
            <td>${membro.doc_elenco_cadastro || '-'}</td>
            <td>${membro.telefone_elenco || '-'}</td>
            <td>${membro.email_elenco || '-'}</td>
            <td>0</td>
        `;
        
        // Status
        const statusCell = document.createElement('td');
        const statusSelect = document.createElement('select');
        statusSelect.style.padding = '4px 8px';
        statusSelect.style.borderRadius = '4px';
        statusSelect.style.border = '1px solid #ddd';
        
        const opcAçãoAtivo = document.createElement('option');
        opcAçãoAtivo.value = 'ativo';
        opcAçãoAtivo.textContent = 'Ativo';
        
        const opcAçãoInativo = document.createElement('option');
        opcAçãoInativo.value = 'inativo';
        opcAçãoInativo.textContent = 'Inativo';
        
        statusSelect.appendChild(opcAçãoAtivo);
        statusSelect.appendChild(opcAçãoInativo);
        statusSelect.value = membro.status || 'ativo';
        
        if (statusSelect.value === 'ativo') {
            statusSelect.style.backgroundColor = '#d4edda';
            statusSelect.style.color = '#155724';
        } else {
            statusSelect.style.backgroundColor = '#f8d7da';
            statusSelect.style.color = '#721c24';
        }
        
        statusSelect.onchange = function() {
            if (this.value === 'ativo') {
                this.style.backgroundColor = '#d4edda';
                this.style.color = '#155724';
            } else {
                this.style.backgroundColor = '#f8d7da';
                this.style.color = '#721c24';
            }
            atualizarStatusElenco(membro.ID_elenco, this.value);
        };
        
        statusCell.appendChild(statusSelect);
        tr.appendChild(statusCell);
        
        // AÃ§Ãµes
        const acoesCell = document.createElement('td');
        acoesCell.innerHTML = `
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn-icon" onclick="visualizarProducAção('${membro.ID_elenco}')" title="Visualizar">Visualizar</button>
                <button class="btn-icon" onclick="editarProducAção('${membro.ID_elenco}')" title="Editar">Editar</button>
                <button class="btn-icon" onclick="excluirProducAção('${membro.ID_elenco}')" title="Excluir">Excluir</button>
            </div>
        `;
        tr.appendChild(acoesCell);
        
        tbody.appendChild(tr);
    });
    
    console.log('â ProduÃ§Ã£o carregada com sucesso!');
}

// FunÃ§Ã£o para carregar relatÃ³rio de motoristas
function carregarRelatorioMotoristas() {
    const motoristas = JSON.parse(localStorage.getItem('motoristas_cadastrados') || '[]');
    const tbody = document.getElementById('tabelaMotoristas');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (motoristas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center;">Nenhum motorista cadastrado</td></tr>';
        return;
    }
    
    motoristas.forEach((motorista) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${motorista.ID_motoristas || '-'}</td>
            <td>${motorista.nome_motoristas || '-'}</td>
            <td>${motorista.cnh_motoristas || '-'}</td>
            <td>${motorista.veiculo_motoristas || '-'}</td>
            <td>${motorista.telefone_motoristas || '-'}</td>
            <td>${motorista.chave_pix_motoristas || '-'}</td>
            <td>0</td>
        `;
        
        // Status
        const statusCell = document.createElement('td');
        const statusSelect = document.createElement('select');
        statusSelect.style.padding = '4px 8px';
        statusSelect.style.borderRadius = '4px';
        statusSelect.style.border = '1px solid #ddd';
        
        const opcAçãoAtivo = document.createElement('option');
        opcAçãoAtivo.value = 'ativo';
        opcAçãoAtivo.textContent = 'Ativo';
        
        const opcAçãoInativo = document.createElement('option');
        opcAçãoInativo.value = 'inativo';
        opcAçãoInativo.textContent = 'Inativo';
        
        statusSelect.appendChild(opcAçãoAtivo);
        statusSelect.appendChild(opcAçãoInativo);
        statusSelect.value = motorista.status || 'ativo';
        
        if (statusSelect.value === 'ativo') {
            statusSelect.style.backgroundColor = '#d4edda';
            statusSelect.style.color = '#155724';
        } else {
            statusSelect.style.backgroundColor = '#f8d7da';
            statusSelect.style.color = '#721c24';
        }
        
        statusSelect.onchange = function() {
            if (this.value === 'ativo') {
                this.style.backgroundColor = '#d4edda';
                this.style.color = '#155724';
            } else {
                this.style.backgroundColor = '#f8d7da';
                this.style.color = '#721c24';
            }
            atualizarStatusMotorista(motorista.ID_motoristas, this.value);
        };
        
        statusCell.appendChild(statusSelect);
        tr.appendChild(statusCell);
        
        // Ação
        const acoesCell = document.createElement('td');
        acoesCell.innerHTML = `
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn-icon" onclick="visualizarMotorista('${motorista.ID_motoristas}')" title="Visualizar">Visualizar</button>
                <button class="btn-icon" onclick="editarMotorista('${motorista.ID_motoristas}')" title="Editar">Editar</button>
                <button class="btn-icon" onclick="excluirMotorista('${motorista.ID_motoristas}')" title="Excluir">Excluir</button>
            </div>
        `;
        tr.appendChild(acoesCell);
        
        tbody.appendChild(tr);
    });
}

// Função para carregar relatório de funcionários
function carregarRelatorioFuncionarios() {
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios_cadastrados') || '[]');
    const tbody = document.getElementById('tabelaFuncionarios');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (funcionarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center;">Nenhum funcionÃ¡rio cadastrado</td></tr>';
        return;
    }
    
    funcionarios.forEach((funcionario) => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${funcionario.ID_funcionarios || '-'}</td>
            <td>${funcionario.nome_funcionarios || '-'}</td>
            <td>-</td>
            <td>${funcionario.doc_funcionarios_cadastro || '-'}</td>
            <td>${funcionario.telefone_funcionarios || '-'}</td>
            <td>${funcionario.email_funcionarios || '-'}</td>
            <td>-</td>
            <td>-</td>
        `;
        
        // Status
        const statusCell = document.createElement('td');
        const statusSelect = document.createElement('select');
        statusSelect.style.padding = '4px 8px';
        statusSelect.style.borderRadius = '4px';
        statusSelect.style.border = '1px solid #ddd';
        
        const opcAçãoAtivo = document.createElement('option');
        opcAçãoAtivo.value = 'ativo';
        opcAçãoAtivo.textContent = 'Ativo';
        
        const opcAçãoInativo = document.createElement('option');
        opcAçãoInativo.value = 'inativo';
        opcAçãoInativo.textContent = 'Inativo';
        
        statusSelect.appendChild(opcAçãoAtivo);
        statusSelect.appendChild(opcAçãoInativo);
        statusSelect.value = funcionario.status || 'ativo';
        
        if (statusSelect.value === 'ativo') {
            statusSelect.style.backgroundColor = '#d4edda';
            statusSelect.style.color = '#155724';
        } else {
            statusSelect.style.backgroundColor = '#f8d7da';
            statusSelect.style.color = '#721c24';
        }
        
        statusSelect.onchange = function() {
            if (this.value === 'ativo') {
                this.style.backgroundColor = '#d4edda';
                this.style.color = '#155724';
            } else {
                this.style.backgroundColor = '#f8d7da';
                this.style.color = '#721c24';
            }
            atualizarStatusFuncionario(funcionario.ID_funcionarios, this.value);
        };
        
        statusCell.appendChild(statusSelect);
        tr.appendChild(statusCell);
        
        // Ação
        const acoesCell = document.createElement('td');
        acoesCell.innerHTML = `
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn-icon" onclick="visualizarFuncionario('${funcionario.ID_funcionarios}')" title="Visualizar">Visualizar</button>
                <button class="btn-icon" onclick="editarFuncionario('${funcionario.ID_funcionarios}')" title="Editar">Editar</button>
                <button class="btn-icon" onclick="excluirFuncionario('${funcionario.ID_funcionarios}')" title="Excluir">Excluir</button>
            </div>
        `;
        tr.appendChild(acoesCell);
        
        tbody.appendChild(tr);
    });
}

// Funções de atualização de status
function atualizarStatusPersonagem(id, novoStatus) {
    const personagens = JSON.parse(localStorage.getItem('personagens_cadastrados') || '[]');
    const index = personagens.findIndex(p => p.ID_personagens === id);
    
    if (index !== -1) {
        personagens[index].status = novoStatus;
        localStorage.setItem('personagens_cadastrados', JSON.stringify(personagens));
    }
}

function atualizarStatusElenco(id, novoStatus) {
    const elenco = JSON.parse(localStorage.getItem('elenco_cadastrados') || '[]');
    const index = elenco.findIndex(e => e.ID_elenco === id);
    
    if (index !== -1) {
        elenco[index].status = novoStatus;
        localStorage.setItem('elenco_cadastrados', JSON.stringify(elenco));
    }
}

function atualizarStatusMotorista(id, novoStatus) {
    const motoristas = JSON.parse(localStorage.getItem('motoristas_cadastrados') || '[]');
    const index = motoristas.findIndex(m => m.ID_motoristas === id);
    
    if (index !== -1) {
        motoristas[index].status = novoStatus;
        localStorage.setItem('motoristas_cadastrados', JSON.stringify(motoristas));
    }
}

function atualizarStatusFuncionario(id, novoStatus) {
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios_cadastrados') || '[]');
    const index = funcionarios.findIndex(f => f.ID_funcionarios === id);
    
    if (index !== -1) {
        funcionarios[index].status = novoStatus;
        localStorage.setItem('funcionarios_cadastrados', JSON.stringify(funcionarios));
    }
}

// FunÃ§Ã£o para trocar abas de equipe
function trocarAbaEquipe(aba) {
    document.querySelectorAll('#conteudo-equipe .tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    document.querySelectorAll('#relatorio_equipe .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const abaElement = document.getElementById(`tab-${aba}`);
    if (abaElement) {
        abaElement.style.display = 'block';
    }
    
    event.target.classList.add('active');
    
    switch(aba) {
        case 'elenco':
            carregarRelatorioElenco();
            break;
        case 'producAção':
            carregarRelatorioProducAção();
            break;
        case 'motoristas':
            carregarRelatorioMotoristas();
            break;
        case 'funcionarios':
            carregarRelatorioFuncionarios();
            break;
    }
}

// FunÃ§Ãµes de aÃ§Ã£o - Elenco
function visualizarElenco(id) {
    const elenco = JSON.parse(localStorage.getItem('elenco_cadastrados') || '[]');
    const membro = elenco.find(e => e.ID_elenco === id);
    if (membro) {
        alert(`Nome: ${membro.nome_elenco}\nDocumento: ${membro.doc_elenco_cadastro}\nTelefone: ${membro.telefone_elenco}\nEmail: ${membro.email_elenco}`);
    }
}

function editarElenco(id) {
    const elenco = JSON.parse(localStorage.getItem('elenco_cadastrados') || '[]');
    const membro = elenco.find(e => e.ID_elenco === id || e.id === id);
    if (membro) {
        // Preencher o formulÃ¡rio mantendo o ID original
        document.getElementById('ID_elenco').value = membro.ID_elenco || membro.id;
        document.getElementById('doc_elenco_cadastro').value = membro.doc_elenco_cadastro || '';
        document.getElementById('nome_elenco').value = membro.nome_elenco || '';
        document.getElementById('data_nascimento_elenco').value = membro.data_nascimento_elenco || '';
        document.getElementById('idade_elenco').value = membro.idade_elenco || '';
        document.getElementById('telefone_elenco').value = membro.telefone_elenco || '';
        document.getElementById('email_elenco').value = membro.email_elenco || '';
        document.getElementById('aceita_producAção_elenco').value = membro.aceita_producAção_elenco || 'nAção';
        document.getElementById('chave_pix_elenco').value = membro.chave_pix_elenco || '';
        document.getElementById('cep_elenco').value = membro.cep_elenco || '';
        document.getElementById('logradouro_elenco').value = membro.logradouro_elenco || '';
        document.getElementById('numero_elenco').value = membro.numero_elenco || '';
        document.getElementById('complemento_elenco').value = membro.complemento_elenco || '';
        document.getElementById('bairro_elenco').value = membro.bairro_elenco || '';
        document.getElementById('cidade_elenco').value = membro.cidade_elenco || '';
        document.getElementById('estado_elenco').value = membro.estado_elenco || '';
        showPage('elenco');
    }
}

function excluirElenco(id) {
    if (confirm('Deseja realmente excluir este membro do elenco?')) {
        let elenco = JSON.parse(localStorage.getItem('elenco_cadastrados') || '[]');
        elenco = elenco.filter(e => e.ID_elenco !== id);
        localStorage.setItem('elenco_cadastrados', JSON.stringify(elenco));
        carregarRelatorioElenco();
        alert('Membro excluído com sucesso!');
    }
}

// FunÃ§Ãµes de aÃ§Ã£o - ProduÃ§Ã£o
function visualizarProducAção(id) {
    visualizarElenco(id);
}

function editarProducAção(id) {
    editarElenco(id);
}

function excluirProducAção(id) {
    excluirElenco(id);
}

// FunÃ§Ãµes de aÃ§Ã£o - Motorista
function visualizarMotorista(id) {
    const motoristas = JSON.parse(localStorage.getItem('motoristas_cadastrados') || '[]');
    const motorista = motoristas.find(m => m.ID_motoristas === id);
    if (motorista) {
        alert(`Nome: ${motorista.nome_motoristas}\nCNH: ${motorista.cnh_motoristas}\nVeÃ­culo: ${motorista.veiculo_motoristas}\nTelefone: ${motorista.telefone_motoristas}`);
    }
}

function editarMotorista(id) {
    const motoristas = JSON.parse(localStorage.getItem('motoristas_cadastrados') || '[]');
    const motorista = motoristas.find(m => m.ID_motoristas === id || m.id === id);
    if (motorista) {
        // Preencher o formulÃ¡rio mantendo o ID original
        document.getElementById('ID_motoristas').value = motorista.ID_motoristas || motorista.id;
        document.getElementById('doc_motoristas_cadastro').value = motorista.doc_motoristas_cadastro || '';
        document.getElementById('nome_motoristas').value = motorista.nome_motoristas || '';
        document.getElementById('data_nascimento_motoristas').value = motorista.data_nascimento_motoristas || '';
        document.getElementById('idade_motoristas').value = motorista.idade_motoristas || '';
        document.getElementById('telefone_motoristas').value = motorista.telefone_motoristas || '';
        document.getElementById('email_motoristas').value = motorista.email_motoristas || '';
        document.getElementById('aceita_producAção_motoristas').value = motorista.aceita_producAção_motoristas || 'nAção';
        document.getElementById('cnh_motoristas').value = motorista.cnh_motoristas || '';
        document.getElementById('veiculo_motoristas').value = motorista.veiculo_motoristas || '';
        document.getElementById('placa_motoristas').value = motorista.placa_motoristas || '';
        document.getElementById('chave_pix_motoristas').value = motorista.chave_pix_motoristas || '';
        document.getElementById('cep_motoristas').value = motorista.cep_motoristas || '';
        document.getElementById('logradouro_motoristas').value = motorista.logradouro_motoristas || '';
        document.getElementById('numero_motoristas').value = motorista.numero_motoristas || '';
        document.getElementById('complemento_motoristas').value = motorista.complemento_motoristas || '';
        document.getElementById('bairro_motoristas').value = motorista.bairro_motoristas || '';
        document.getElementById('cidade_motoristas').value = motorista.cidade_motoristas || '';
        document.getElementById('estado_motoristas').value = motorista.estado_motoristas || '';
        showPage('motoristas');
    }
}

function excluirMotorista(id) {
    if (confirm('Deseja realmente excluir este motorista?')) {
        let motoristas = JSON.parse(localStorage.getItem('motoristas_cadastrados') || '[]');
        motoristas = motoristas.filter(m => m.ID_motoristas !== id);
        localStorage.setItem('motoristas_cadastrados', JSON.stringify(motoristas));
        carregarRelatorioMotoristas();
        alert('Motorista excluído com sucesso!');
    }
}

// FunÃ§Ãµes de aÃ§Ã£o - FuncionÃ¡rio
function visualizarFuncionario(id) {
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios_cadastrados') || '[]');
    const funcionario = funcionarios.find(f => f.ID_funcionarios === id);
    if (funcionario) {
        alert(`Nome: ${funcionario.nome_funcionarios}\nDocumento: ${funcionario.doc_funcionarios_cadastro}\nTelefone: ${funcionario.telefone_funcionarios}\nEmail: ${funcionario.email_funcionarios}`);
    }
}

function editarFuncionario(id) {
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios_cadastrados') || '[]');
    const funcionario = funcionarios.find(f => f.ID_funcionarios === id || f.id === id);
    if (funcionario) {
        // Preencher o formulÃ¡rio mantendo o ID original
        document.getElementById('ID_funcionarios').value = funcionario.ID_funcionarios || funcionario.id;
        document.getElementById('doc_funcionarios_cadastro').value = funcionario.doc_funcionarios_cadastro || '';
        document.getElementById('nome_funcionarios').value = funcionario.nome_funcionarios || '';
        document.getElementById('data_nascimento_funcionarios').value = funcionario.data_nascimento_funcionarios || '';
        document.getElementById('idade_funcionarios').value = funcionario.idade_funcionarios || '';
        document.getElementById('telefone_funcionarios').value = funcionario.telefone_funcionarios || '';
        document.getElementById('email_funcionarios').value = funcionario.email_funcionarios || '';
        document.getElementById('cep_funcionarios').value = funcionario.cep_funcionarios || '';
        document.getElementById('logradouro_funcionarios').value = funcionario.logradouro_funcionarios || '';
        document.getElementById('numero_funcionarios').value = funcionario.numero_funcionarios || '';
        document.getElementById('complemento_funcionarios').value = funcionario.complemento_funcionarios || '';
        document.getElementById('bairro_funcionarios').value = funcionario.bairro_funcionarios || '';
        document.getElementById('cidade_funcionarios').value = funcionario.cidade_funcionarios || '';
        document.getElementById('estado_funcionarios').value = funcionario.estado_funcionarios || '';
        showPage('funcionarios');
    }
}

function excluirFuncionario(id) {
    if (confirm('Deseja realmente excluir este funcionÃ¡rio?')) {
        let funcionarios = JSON.parse(localStorage.getItem('funcionarios_cadastrados') || '[]');
        funcionarios = funcionarios.filter(f => f.ID_funcionarios !== id);
        localStorage.setItem('funcionarios_cadastrados', JSON.stringify(funcionarios));
        carregarRelatorioFuncionarios();
        alert('Funcionário excluído com sucesso!');
    }
}

// Carregar Ação iniciar
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('tabelaPersonagens')) {
        carregarRelatorioPersonagens();
    }
    
    if (document.getElementById('tabelaElenco')) {
        carregarRelatorioElenco();
    }
});

// Exportar funÃ§Ãµes
window.carregarRelatorioPersonagens = carregarRelatorioPersonagens;
window.carregarRelatorioElenco = carregarRelatorioElenco;
window.carregarRelatorioProducAção = carregarRelatorioProducAção;
window.carregarRelatorioMotoristas = carregarRelatorioMotoristas;
window.carregarRelatorioFuncionarios = carregarRelatorioFuncionarios;
window.trocarAbaEquipe = trocarAbaEquipe;

console.log('relatorios-equipe.js carregado');

