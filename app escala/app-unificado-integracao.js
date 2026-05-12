// ==================== INTERLIGAÇÃO COM APP DO USUÁRIO ====================

// ==================== APP UNIFICADO DE ESCALAS ====================
// Integra múltiplas empresas em um único app

class AppUnificadoEscalas {
    constructor() {
        this.usuarioLogado = null;
        this.cpfUsuario = null;
        this.empresas = [];
        this.eventosUnificados = [];
        this.disponibilidades = [];
        this.mesAtual = new Date().getMonth();
        this.anoAtual = new Date().getFullYear();
        this.filtroAtual = {
            periodo: 'todos',
            empresa: 'todas',
            pagamento: 'todos'
        };
    }
    
    /**
     * Inicializa o app
     */
    async init() {
        // Verificar login
        this.usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogadoUnificado') || 'null');
        
        if (!this.usuarioLogado) {
            window.location.href = 'login-unificado.html';
            return;
        }
        
        this.cpfUsuario = this.usuarioLogado.cpf;
        
        // Carregar empresas configuradas
        this.carregarEmpresas();
        
        // Carregar dados de todas as empresas
        await this.carregarDadosTodasEmpresas();
        
        // Renderizar UI
        this.renderizarEmpresas();
        this.renderizarEventos();
        this.renderizarCalendario();
        this.renderizarDisponibilidades();
        this.renderizarResumo();
        
        // Atualizar informações do usuário
        document.getElementById('userInfo').innerHTML = `
            👤 ${this.usuarioLogado.nome} | 🎭 ${this.usuarioLogado.tipo}
        `;
        
        // Configurar auto-refresh (a cada 30 segundos)
        setInterval(() => this.refreshDados(), 30000);
    }
    
    /**
     * Carrega lista de empresas do localStorage, filtrando apenas as que o usuário tem acesso
     */
    carregarEmpresas() {
        const empresasSalvas = localStorage.getItem('empresas_conectadas');
        
        let todasEmpresas = [];
        if (empresasSalvas) {
            todasEmpresas = JSON.parse(empresasSalvas);
        } else {
            // Iniciar com lista vazia (empresas serão cadastradas via sistema matriz)
            todasEmpresas = [];
            this.salvarEmpresas();
        }
        
        // Filtrar apenas empresas onde o CPF do titular está autorizado para este usuário
        this.empresas = todasEmpresas.filter(empresa => {
            // Verificar autorizações do usuário
            const autorizacoesKey = `autorizacoes_usuario_${this.cpfUsuario}`;
            const autorizacoes = JSON.parse(localStorage.getItem(autorizacoesKey) || '[]');
            return autorizacoes.empresas_autorizadas && autorizacoes.empresas_autorizadas.some(auth => auth.cpf_titular === empresa.cpf_titular && auth.status === 'ativo');
        });
    }
    
    /**
     * Salva empresas no localStorage
     */
    salvarEmpresas() {
        localStorage.setItem('empresas_conectadas', JSON.stringify(this.empresas));
    }
    
    /**
     * Carrega dados de todas as empresas
     */
    async carregarDadosTodasEmpresas() {
        this.eventosUnificados = [];
        
        for (const empresa of this.empresas) {
            if (!empresa.ativa) continue;
            
            try {
                const dadosEmpresa = await this.carregarDadosEmpresa(empresa);
                this.eventosUnificados.push(...dadosEmpresa);
            } catch (error) {
                console.error(`Erro ao carregar dados da empresa ${empresa.nome}:`, error);
            }
        }
        
        // Ordenar eventos por data
        this.eventosUnificados.sort((a, b) => new Date(a.data) - new Date(b.data));
    }
    
    /**
     * Carrega dados de uma empresa específica
     */
    async carregarDadosEmpresa(empresa) {
        const eventos = [];
        
        // Estratégia 1: Tentar carregar do localStorage específico da empresa
        const prefixo = empresa.identificador;
        
        // Escalas da empresa
        const escalasKey = `${prefixo}_escalas_eventos`;
        const eventosKey = `${prefixo}_eventos_cadastrados`;
        const elencoKey = `${prefixo}_elenco_cadastrados`;
        const motoristasKey = `${prefixo}_motoristas_cadastrados`;
        const clientesKey = `${prefixo}_clientes_cadastrados`;
        
        let escalas = JSON.parse(localStorage.getItem(escalasKey) || '[]');
        let eventosEmpresa = JSON.parse(localStorage.getItem(eventosKey) || '[]');
        let elenco = JSON.parse(localStorage.getItem(elencoKey) || '[]');
        let motoristas = JSON.parse(localStorage.getItem(motoristasKey) || '[]');
        let clientes = JSON.parse(localStorage.getItem(clientesKey) || '[]');
        
        // Se não encontrou com prefixo, tenta sem prefixo (fallback)
        if (escalas.length === 0) {
            escalas = JSON.parse(localStorage.getItem('escalas_eventos') || '[]');
            eventosEmpresa = JSON.parse(localStorage.getItem('eventos_cadastrados') || '[]');
            elenco = JSON.parse(localStorage.getItem('elenco_cadastrados') || '[]');
            motoristas = JSON.parse(localStorage.getItem('motoristas_cadastrados') || '[]');
            clientes = JSON.parse(localStorage.getItem('clientes_cadastrados') || '[]');
        }
        
        // Filtrar escalas do usuário
        const minhasEscalas = escalas.filter(escala => {
            const pertenceElenco = (escala.elenco_cpfs || []).includes(this.cpfUsuario);
            const pertenceMotorista = escala.motorista_cpf === this.cpfUsuario;
            return pertenceElenco || pertenceMotorista;
        });
        
        // Para cada escala, buscar dados do evento
        for (const escala of minhasEscalas) {
            const evento = eventosEmpresa.find(e => e.id === escala.evento_id);
            if (!evento) continue;
            
            // Buscar cliente
            const cliente = clientes.find(c => c.doc_clientes_cadastro === evento.doc_evento_cadastro);
            
            // Buscar dados do membro (elenco/motorista)
            let cache = 0;
            let funcao = '';
            
            if ((escala.elenco_cpfs || []).includes(this.cpfUsuario)) {
                const indexElenco = escala.elenco_cpfs.indexOf(this.cpfUsuario);
                const personagem = escala.elenco[indexElenco];
                funcao = `Elenco${personagem?.personagem ? ` - ${personagem.personagem}` : ''}`;
                
                const membro = elenco.find(e => (e.doc_elenco_cadastro || '').replace(/\D/g, '') === this.cpfUsuario);
                if (membro && membro.cache_elenco) {
                    cache = parseFloat(String(membro.cache_elenco).replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                }
            } else if (escala.motorista_cpf === this.cpfUsuario) {
                funcao = 'Motorista';
                const membro = motoristas.find(m => (m.doc_motoristas_cadastro || '').replace(/\D/g, '') === this.cpfUsuario);
                if (membro && membro.cache_motoristas) {
                    cache = parseFloat(String(membro.cache_motoristas).replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                }
            }
            
            // Determinar status de pagamento
            const dataEvento = new Date(evento.data_evento);
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            const statusPagamento = dataEvento < hoje ? 'Pago' : 'A Receber';
            
            // Montar objeto do evento unificado
            eventos.push({
                id: `${empresa.id}_${evento.id}`,
                empresaId: empresa.id,
                empresaNome: empresa.nome,
                empresaCor: empresa.cor,
                cliente: evento.nome_cliente_evento || cliente?.nome_clientes || 'Cliente não informado',
                telefone: evento.telefone_cliente_evento || cliente?.telefone_cliente || '-',
                data: evento.data_evento,
                horario: evento.hora_evento || 'Não informado',
                horarioSaida: evento.hora_saida || 'Não informado',
                local: evento.nome_local_evento || 'Local não informado',
                endereco: `${evento.logradouro_local_evento || ''} ${evento.numero_local_evento || ''}`,
                cidade: evento.cidade_local_evento || '',
                funcao: funcao,
                cache: cache,
                statusPagamento: statusPagamento,
                observacoes: escala.observacoes || '',
                eventoOriginal: evento,
                escalaOriginal: escala
            });
        }
        
        return eventos;
    }
    
    /**
     * Renderiza grid de empresas
     */
    renderizarEmpresas() {
        const container = document.getElementById('empresasGrid');
        
        if (this.empresas.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <p>Nenhuma empresa conectada.</p>
                    <button onclick="abrirConfiguracoes()" class="btn-config" style="background: #667eea; color: white;">➕ Conectar Empresa</button>
                </div>
            `;
            return;
        }
        
        // Calcular stats por empresa
        const stats = {};
        for (const evento of this.eventosUnificados) {
            if (!stats[evento.empresaId]) {
                stats[evento.empresaId] = { total: 0, proximos: 0, cacheTotal: 0 };
            }
            stats[evento.empresaId].total++;
            
            const dataEvento = new Date(evento.data);
            const hoje = new Date();
            if (dataEvento >= hoje) {
                stats[evento.empresaId].proximos++;
            }
            stats[evento.empresaId].cacheTotal += evento.cache;
        }
        
        container.innerHTML = this.empresas.map(empresa => {
            const stat = stats[empresa.id] || { total: 0, proximos: 0, cacheTotal: 0 };
            return `
                <div class="empresa-card" onclick="selecionarEmpresa('${empresa.id}')">
                    <div class="empresa-header">
                        <div class="empresa-icon" style="background: ${empresa.cor}">
                            🎪
                        </div>
                        <div class="empresa-info">
                            <div class="empresa-nome">${empresa.nome}</div>
                            <div class="empresa-cnpj">${empresa.cnpj}</div>
                        </div>
                    </div>
                    <div class="empresa-stats">
                        <div class="stat">
                            <div class="stat-value">${stat.total}</div>
                            <div class="stat-label">Eventos</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">${stat.proximos}</div>
                            <div class="stat-label">Próximos</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value">R$ ${stat.cacheTotal.toFixed(2)}</div>
                            <div class="stat-label">Total</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Preencher filtro de empresas
        const filtroEmpresa = document.getElementById('filtroEmpresa');
        if (filtroEmpresa) {
            filtroEmpresa.innerHTML = `
                <option value="todas">Todas as empresas</option>
                ${this.empresas.map(e => `<option value="${e.id}">${e.nome}</option>`).join('')}
            `;
        }
    }
    
    /**
     * Renderiza eventos filtrados
     */
    renderizarEventos() {
        const container = document.getElementById('eventosGrid');
        
        // Aplicar filtros
        let eventosFiltrados = [...this.eventosUnificados];
        
        // Filtro por empresa
        if (this.filtroAtual.empresa !== 'todas') {
            eventosFiltrados = eventosFiltrados.filter(e => e.empresaId === this.filtroAtual.empresa);
        }
        
        // Filtro por período
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const semanaFutura = new Date(hoje);
        semanaFutura.setDate(hoje.getDate() + 7);
        const mesFuturo = new Date(hoje);
        mesFuturo.setDate(hoje.getDate() + 30);
        
        eventosFiltrados = eventosFiltrados.filter(evento => {
            const dataEvento = new Date(evento.data);
            dataEvento.setHours(0, 0, 0, 0);
            
            switch(this.filtroAtual.periodo) {
                case 'hoje':
                    return dataEvento.getTime() === hoje.getTime();
                case 'proximos':
                    return dataEvento >= hoje;
                case 'passados':
                    return dataEvento < hoje;
                case 'semana':
                    return dataEvento >= hoje && dataEvento <= semanaFutura;
                case 'mes':
                    return dataEvento >= hoje && dataEvento <= mesFuturo;
                default:
                    return true;
            }
        });
        
        // Filtro por pagamento
        if (this.filtroAtual.pagamento !== 'todos') {
            eventosFiltrados = eventosFiltrados.filter(e => 
                e.statusPagamento.toLowerCase() === this.filtroAtual.pagamento.toLowerCase()
            );
        }
        
        if (eventosFiltrados.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; background: white; border-radius: 12px;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
                    <p>Nenhum evento encontrado com os filtros selecionados.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = eventosFiltrados.map(evento => {
            const dataFormatada = new Date(evento.data).toLocaleDateString('pt-BR');
            const statusClass = evento.statusPagamento === 'Pago' ? 'status-confirmado' : 'status-pendente';
            
            return `
                <div class="evento-card">
                    <div class="evento-header" style="background: linear-gradient(135deg, ${evento.empresaCor} 0%, #764ba2 100%);">
                        <div class="evento-empresa">🏢 ${evento.empresaNome}</div>
                        <div class="evento-cliente">👤 ${evento.cliente}</div>
                    </div>
                    <div class="evento-body">
                        <div class="evento-info">
                            <span class="label">📅 Data:</span>
                            <span>${dataFormatada}</span>
                        </div>
                        <div class="evento-info">
                            <span class="label">🕐 Horário:</span>
                            <span>${evento.horario}</span>
                        </div>
                        <div class="evento-info">
                            <span class="label">🚗 Saída:</span>
                            <span>${evento.horarioSaida}</span>
                        </div>
                        <div class="evento-info">
                            <span class="label">📍 Local:</span>
                            <span>${evento.local}</span>
                        </div>
                        <div class="evento-info">
                            <span class="label">📞 Telefone:</span>
                            <span>${evento.telefone}</span>
                        </div>
                        <div class="evento-info">
                            <span class="label">🎭 Função:</span>
                            <span>${evento.funcao}</span>
                        </div>
                        <div class="evento-info">
                            <span class="label">💰 Cachê:</span>
                            <span>R$ ${evento.cache.toFixed(2)}</span>
                        </div>
                        <div class="evento-info">
                            <span class="label">💵 Status:</span>
                            <span class="status-badge ${statusClass}">${evento.statusPagamento}</span>
                        </div>
                        ${evento.observacoes ? `
                            <div class="evento-info">
                                <span class="label">📝 Obs:</span>
                                <span>${evento.observacoes}</span>
                            </div>
                        ` : ''}
                        ${evento.endereco ? `
                            <a href="https://www.google.com/maps/search/${encodeURIComponent(evento.endereco + ' ' + evento.cidade)}" 
                               target="_blank" 
                               class="btn-mapa">
                                🗺️ Ver rota no Google Maps
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    /**
     * Renderiza calendário com eventos
     */
    renderizarCalendario() {
        const container = document.getElementById('calendarioGrid');
        const mesAno = document.getElementById('mesAnoAtual');
        
        if (!container) return;
        
        const data = new Date(this.anoAtual, this.mesAtual, 1);
        const primeiroDia = data.getDay();
        const diasNoMes = new Date(this.anoAtual, this.mesAtual + 1, 0).getDate();
        
        // Atualizar título
        mesAno.textContent = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        
        // Dias da semana
        const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
        
        let html = diasSemana.map(dia => `
            <div style="text-align: center; font-weight: 600; padding: 0.5rem; color: #666;">
                ${dia}
            </div>
        `).join('');
        
        // Dias vazios
        for (let i = 0; i < primeiroDia; i++) {
            html += `<div></div>`;
        }
        
        // Dias do mês
        for (let dia = 1; dia <= diasNoMes; dia++) {
            const dataStr = `${this.anoAtual}-${String(this.mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            
            // Verificar se tem eventos neste dia
            const eventosDia = this.eventosUnificados.filter(e => e.data === dataStr);
            const temEvento = eventosDia.length > 0;
            
            html += `
                <div class="calendario-dia ${temEvento ? 'tem-evento' : ''}" onclick="verEventosDoDia('${dataStr}')">
                    <div class="dia-numero">${dia}</div>
                    ${temEvento ? `
                        <div class="dia-eventos">
                            ${eventosDia.length} evento${eventosDia.length > 1 ? 's' : ''}
                        </div>
                        <div style="margin-top: 0.25rem;">
                            ${eventosDia.slice(0, 2).map(e => `<span class="evento-ponto" style="background: ${e.empresaCor}"></span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        container.innerHTML = html;
    }
    
    /**
     * Renderiza disponibilidades do usuário
     */
    renderizarDisponibilidades() {
        const container = document.getElementById('listaDisponibilidades');
        
        // Carregar disponibilidades
        const disponibilidadesKey = `disponibilidades_${this.cpfUsuario}`;
        let disponibilidades = JSON.parse(localStorage.getItem(disponibilidadesKey) || '[]');
        
        if (disponibilidades.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #999;">
                    <p>Nenhuma disponibilidade cadastrada.</p>
                </div>
            `;
            return;
        }
        
        disponibilidades.sort((a, b) => new Date(a.data) - new Date(b.data));
        
        container.innerHTML = `
            <div class="eventos-grid">
                ${disponibilidades.map((disp, index) => {
                    const statusIcon = disp.status === 'disponivel' ? '✅' : '❌';
                    const statusText = disp.status === 'disponivel' ? 'Disponível' : 'Indisponível';
                    const statusColor = disp.status === 'disponivel' ? '#28a745' : '#dc3545';
                    
                    return `
                        <div class="evento-card">
                            <div class="evento-header" style="background: ${statusColor}">
                                <div>${statusIcon} ${statusText}</div>
                            </div>
                            <div class="evento-body">
                                <div class="evento-info">
                                    <span class="label">📅 Data:</span>
                                    <span>${new Date(disp.data).toLocaleDateString('pt-BR')}</span>
                                </div>
                                ${disp.horario ? `
                                    <div class="evento-info">
                                        <span class="label">🕐 Horário:</span>
                                        <span>${disp.horario}</span>
                                    </div>
                                ` : ''}
                                ${disp.observacao ? `
                                    <div class="evento-info">
                                        <span class="label">📝 Obs:</span>
                                        <span>${disp.observacao}</span>
                                    </div>
                                ` : ''}
                                <button onclick="removerDisponibilidade(${index})" style="margin-top: 0.5rem; padding: 0.25rem 0.5rem; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                    🗑️ Remover
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    /**
     * Renderiza resumo financeiro
     */
    renderizarResumo() {
        const container = document.getElementById('resumoFinanceiro');
        
        // Calcular totais por empresa
        const totaisPorEmpresa = {};
        let totalGeral = 0;
        let totalPago = 0;
        let totalAPagar = 0;
        
        for (const evento of this.eventosUnificados) {
            if (!totaisPorEmpresa[evento.empresaId]) {
                totaisPorEmpresa[evento.empresaId] = {
                    nome: evento.empresaNome,
                    total: 0,
                    pago: 0,
                    aPagar: 0
                };
            }
            
            totaisPorEmpresa[evento.empresaId].total += evento.cache;
            totalGeral += evento.cache;
            
            if (evento.statusPagamento === 'Pago') {
                totaisPorEmpresa[evento.empresaId].pago += evento.cache;
                totalPago += evento.cache;
            } else {
                totaisPorEmpresa[evento.empresaId].aPagar += evento.cache;
                totalAPagar += evento.cache;
            }
        }
        
        container.innerHTML = `
            <div style="margin-bottom: 2rem;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                    <div style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 1rem; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.8rem; font-weight: 600;">R$ ${totalGeral.toFixed(2)}</div>
                        <div>Total Geral</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #17a2b8, #20c997); color: white; padding: 1rem; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.8rem; font-weight: 600;">R$ ${totalPago.toFixed(2)}</div>
                        <div>Recebido</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #ffc107, #fd7e14); color: white; padding: 1rem; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.8rem; font-weight: 600;">R$ ${totalAPagar.toFixed(2)}</div>
                        <div>A Receber</div>
                    </div>
                </div>
                
                <h4>📊 Detalhamento por Empresa</h4>
                <div class="eventos-grid">
                    ${Object.values(totaisPorEmpresa).map(emp => `
                        <div class="evento-card">
                            <div class="evento-header">
                                <div>🏢 ${emp.nome}</div>
                            </div>
                            <div class="evento-body">
                                <div class="evento-info">
                                    <span class="label">💰 Total:</span>
                                    <span>R$ ${emp.total.toFixed(2)}</span>
                                </div>
                                <div class="evento-info">
                                    <span class="label">✅ Recebido:</span>
                                    <span>R$ ${emp.pago.toFixed(2)}</span>
                                </div>
                                <div class="evento-info">
                                    <span class="label">⏳ A Receber:</span>
                                    <span>R$ ${emp.aPagar.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    /**
     * Filtra eventos
     */
    filtrarEventos() {
        this.filtroAtual.periodo = document.getElementById('filtroPeriodo').value;
        this.filtroAtual.empresa = document.getElementById('filtroEmpresa').value;
        this.filtroAtual.pagamento = document.getElementById('filtroPagamento').value;
        
        this.renderizarEventos();
    }
    
    /**
     * Muda mês do calendário
     */
    mudarMes(delta) {
        this.mesAtual += delta;
        if (this.mesAtual < 0) {
            this.mesAtual = 11;
            this.anoAtual--;
        }
        if (this.mesAtual > 11) {
            this.mesAtual = 0;
            this.anoAtual++;
        }
        this.renderizarCalendario();
    }
    
    /**
     * Refresh dos dados
     */
    async refreshDados() {
        await this.carregarDadosTodasEmpresas();
        this.renderizarEventos();
        this.renderizarCalendario();
        this.renderizarResumo();
    }
    
    /**
     * Adiciona disponibilidade
     */
    adicionarDisponibilidade() {
        const data = document.getElementById('dispData').value;
        const status = document.getElementById('dispStatus').value;
        const horario = document.getElementById('dispHorario').value;
        const observacao = document.getElementById('dispObs').value;
        
        if (!data) {
            alert('Selecione uma data!');
            return;
        }
        
        const disponibilidadesKey = `disponibilidades_${this.cpfUsuario}`;
        let disponibilidades = JSON.parse(localStorage.getItem(disponibilidadesKey) || '[]');
        
        disponibilidades.push({
            data: data,
            status: status,
            horario: horario,
            observacao: observacao,
            dataCadastro: new Date().toISOString()
        });
        
        localStorage.setItem(disponibilidadesKey, JSON.stringify(disponibilidades));
        
        // Limpar campos
        document.getElementById('dispData').value = '';
        document.getElementById('dispStatus').value = 'disponivel';
        document.getElementById('dispHorario').value = '';
        document.getElementById('dispObs').value = '';
        
        this.renderizarDisponibilidades();
        alert('✅ Disponibilidade adicionada com sucesso!');
    }
}

// Funções globais
let app = null;

function mudarAba(aba) {
    // Mudar classe dos botões
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Mostrar conteúdo
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`aba-${aba}`).classList.add('active');
}

function mudarMes(delta) {
    if (app) app.mudarMes(delta);
}

function filtrarEventos() {
    if (app) app.filtrarEventos();
}

function selecionarEmpresa(empresaId) {
    if (app) {
        app.filtroAtual.empresa = empresaId;
        app.renderizarEventos();
        
        // Mudar para aba de escalas
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.querySelector('.tab-btn').classList.add('active');
        document.getElementById('aba-escalas').classList.add('active');
    }
}

function verEventosDoDia(dataStr) {
    if (!app) return;
    
    const eventosDia = app.eventosUnificados.filter(e => e.data === dataStr);
    
    if (eventosDia.length === 0) {
        alert('Nenhum evento neste dia.');
        return;
    }
    
    // Mostrar modal com eventos do dia
    const dataFormatada = new Date(dataStr).toLocaleDateString('pt-BR');
    let mensagem = `📅 Eventos em ${dataFormatada}:\n\n`;
    
    eventosDia.forEach(evento => {
        mensagem += `🏢 ${evento.empresaNome}\n`;
        mensagem += `👤 ${evento.cliente}\n`;
        mensagem += `🕐 ${evento.horario}\n`;
        mensagem += `💰 R$ ${evento.cache.toFixed(2)}\n`;
        mensagem += `---\n`;
    });
    
    alert(mensagem);
}

function adicionarDisponibilidade() {
    if (app) app.adicionarDisponibilidade();
}

function removerDisponibilidade(index) {
    if (!app) return;
    
    if (!confirm('Tem certeza que deseja remover esta disponibilidade?')) return;
    
    const disponibilidadesKey = `disponibilidades_${app.cpfUsuario}`;
    let disponibilidades = JSON.parse(localStorage.getItem(disponibilidadesKey) || '[]');
    disponibilidades.splice(index, 1);
    localStorage.setItem(disponibilidadesKey, JSON.stringify(disponibilidades));
    
    app.renderizarDisponibilidades();
    alert('✅ Disponibilidade removida!');
}

function abrirConfiguracoes() {
    const modal = document.getElementById('configModal');
    modal.classList.add('active');
    
    // Listar empresas configuradas
    const empresas = JSON.parse(localStorage.getItem('empresas_conectadas') || '[]');
    const container = document.getElementById('empresasConfigList');
    
    if (empresas.length === 0) {
        container.innerHTML = '<p>Nenhuma empresa conectada.</p>';
    } else {
        container.innerHTML = empresas.map(emp => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; border-bottom: 1px solid #eee;">
                <div>
                    <strong>${emp.nome}</strong><br>
                    <small>${emp.cnpj || emp.identificador}</small>
                </div>
                <button onclick="removerEmpresa('${emp.id}')" style="background: #dc3545; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer;">Remover</button>
            </div>
        `).join('');
    }
}

function fecharModal() {
    const modal = document.getElementById('configModal');
    modal.classList.remove('active');
}

function adicionarEmpresa() {
    const nome = document.getElementById('novaEmpresaNome').value;
    const url = document.getElementById('novaEmpresaUrl').value;
    
    if (!nome || !url) {
        alert('Preencha todos os campos!');
        return;
    }
    
    const empresas = JSON.parse(localStorage.getItem('empresas_conectadas') || '[]');
    
    empresas.push({
        id: `empresa_${Date.now()}`,
        nome: nome,
        cnpj: url,
        identificador: url,
        ativa: true,
        cor: `#${Math.floor(Math.random()*16777215).toString(16)}`
    });
    
    localStorage.setItem('empresas_conectadas', JSON.stringify(empresas));
    
    document.getElementById('novaEmpresaNome').value = '';
    document.getElementById('novaEmpresaUrl').value = '';
    
    fecharModal();
    
    // Recarregar app
    location.reload();
}

function removerEmpresa(empresaId) {
    if (!confirm('Tem certeza que deseja remover esta empresa?')) return;
    
    let empresas = JSON.parse(localStorage.getItem('empresas_conectadas') || '[]');
    empresas = empresas.filter(e => e.id !== empresaId);
    localStorage.setItem('empresas_conectadas', JSON.stringify(empresas));
    
    fecharModal();
    location.reload();
}

function sair() {
    sessionStorage.removeItem('usuarioLogadoUnificado');
    window.location.href = 'login-unificado.html';
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    app = new AppUnificadoEscalas();
    app.init();
});
// app-usuario-autorizado.js - Versão atualizada do app do usuário

class AppUsuarioAutorizado {
    constructor() {
        this.cpfUsuario = '';
        this.empresasAutorizadas = [];
        this.eventosUnificados = [];
    }
    
    async init() {
        // Verificar login
        const usuarioLogado = JSON.parse(sessionStorage.getItem('usuarioLogado') || 'null');
        if (!usuarioLogado) {
            window.location.href = 'login-unificado.html';
            return;
        }
        
        this.cpfUsuario = usuarioLogado.cpf;
        
        // Carregar autorizações do sistema matriz
        await this.carregarAutorizacoes();
        
        // Se não tem autorização, mostrar mensagem
        if (this.empresasAutorizadas.length === 0) {
            this.mostrarSemAutorizacao();
            return;
        }
        
        // Carregar eventos apenas das empresas autorizadas
        await this.carregarEventosAutorizados();
        
        // Renderizar UI
        this.renderizarEmpresas();
        this.renderizarEventos();
    }
    
    async carregarAutorizacoes() {
        // Buscar autorizações do localStorage (sincronizado com a matriz)
        const key = `app_usuario_${this.cpfUsuario}_autorizacoes`;
        const autorizacoesStr = localStorage.getItem(key);
        
        if (autorizacoesStr) {
            const autorizacoes = JSON.parse(autorizacoesStr);
            this.empresasAutorizadas = autorizacoes.empresas_autorizadas || [];
            
            // Registrar log de acesso
            this.registrarLog('login', 'Usuário acessou o app');
        } else {
            // Verificar na matriz via API ou localStorage global
            await this.sincronizarComMatriz();
        }
    }
    
    async sincronizarComMatriz() {
        // Buscar dados da matriz (pode ser via API ou localStorage compartilhado)
        const usuariosMatriz = JSON.parse(localStorage.getItem('matriz_usuarios_autorizados') || '[]');
        const usuarioMatriz = usuariosMatriz.find(u => u.cpf === this.cpfUsuario);
        
        if (usuarioMatriz) {
            this.empresasAutorizadas = usuarioMatriz.empresas;
            // Salvar localmente para cache
            localStorage.setItem(`app_usuario_${this.cpfUsuario}_autorizacoes`, JSON.stringify({
                cpf: this.cpfUsuario,
                nome: usuarioMatriz.nome,
                empresas_autorizadas: this.empresasAutorizadas,
                ultima_sincronizacao: new Date().toISOString()
            }));
        }
    }
    
    async carregarEventosAutorizados() {
        this.eventosUnificados = [];
        
        for (const empresa of this.empresasAutorizadas) {
            // Carregar eventos apenas das empresas autorizadas
            const eventos = await this.carregarEventosEmpresa(empresa);
            this.eventosUnificados.push(...eventos);
        }
    }
    
    async carregarEventosEmpresa(empresa) {
        // Buscar escalas da empresa específica
        const prefixo = empresa.id_empresa;
        const escalasKey = `${prefixo}_escalas_eventos`;
        const eventosKey = `${prefixo}_eventos_cadastrados`;
        
        let escalas = JSON.parse(localStorage.getItem(escalasKey) || '[]');
        let eventosEmpresa = JSON.parse(localStorage.getItem(eventosKey) || '[]');
        
        // Filtrar escalas do usuário
        const minhasEscalas = escalas.filter(escala => {
            const pertenceElenco = (escala.elenco_cpfs || []).includes(this.cpfUsuario);
            const pertenceMotorista = escala.motorista_cpf === this.cpfUsuario;
            return pertenceElenco || pertenceMotorista;
        });
        
        // Registrar visualização
        if (minhasEscalas.length > 0) {
            this.registrarLog('visualizacao_escala', `Visualizou ${minhasEscalas.length} eventos da empresa ${empresa.nome_empresa}`);
        }
        
        // Mapear eventos
        return minhasEscalas.map(escala => {
            const evento = eventosEmpresa.find(e => e.id === escala.evento_id);
            return {
                ...evento,
                empresaId: empresa.id_empresa,
                empresaNome: empresa.nome_empresa,
                escala: escala
            };
        }).filter(e => e); // Remove undefined
    }
    
    registrarLog(tipoAtividade, detalhes) {
        // Registrar no sistema matriz
        const log = {
            id: Date.now(),
            cpf_usuario: this.cpfUsuario,
            tipo_atividade: tipoAtividade,
            data_hora: new Date().toISOString(),
            detalhes: detalhes
        };
        
        // Adicionar ao localStorage da matriz
        const logsMatriz = JSON.parse(localStorage.getItem('matriz_logs_atividades') || '[]');
        logsMatriz.unshift(log);
        
        // Manter últimos 1000
        if (logsMatriz.length > 1000) logsMatriz.pop();
        
        localStorage.setItem('matriz_logs_atividades', JSON.stringify(logsMatriz));
    }
    
    async salvarDisponibilidade(data, status, horario, observacao) {
        // Registrar disponibilidade
        const disponibilidade = {
            cpf: this.cpfUsuario,
            data: data,
            status: status,
            horario: horario,
            observacao: observacao,
            dataRegistro: new Date().toISOString()
        };
        
        // Salvar no sistema da empresa (para cada empresa autorizada)
        for (const empresa of this.empresasAutorizadas) {
            const key = `${empresa.id_empresa}_disponibilidades_usuarios`;
            let disponibilidades = JSON.parse(localStorage.getItem(key) || '[]');
            disponibilidades.push(disponibilidade);
            localStorage.setItem(key, JSON.stringify(disponibilidades));
        }
        
        // Registrar log
        this.registrarLog('disponibilidade', `${status}: ${data} - ${observacao || 'Sem observação'}`);
        
        return true;
    }
    
    mostrarSemAutorizacao() {
        document.getElementById('conteudoPrincipal').innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🔒</div>
                <h2>Você ainda não tem acesso a nenhuma empresa</h2>
                <p style="color: #666; margin: 1rem 0;">
                    Entre em contato com as empresas de eventos e solicite seu cadastro.<br>
                    Após o cadastro, as escalas aparecerão automaticamente aqui.
                </p>
                <button onclick="verificarNovamente()" style="padding: 0.75rem 1.5rem; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
                    🔄 Verificar Novamente
                </button>
            </div>
        `;
    }
    
    renderizarEmpresas() {
        const container = document.getElementById('empresasAutorizadas');
        if (!container) return;
        
        container.innerHTML = `
            <div class="empresas-grid">
                ${this.empresasAutorizadas.map(emp => `
                    <div class="empresa-card">
                        <div class="empresa-nome">🏢 ${emp.nome_empresa}</div>
                        <div class="empresa-status">✅ Autorizada desde ${new Date(emp.data_autorizacao).toLocaleDateString()}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderizarEventos() {
        const container = document.getElementById('eventosContainer');
        if (!container) return;
        
        if (this.eventosUnificados.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <p>📭 Nenhum evento escalado no momento</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.eventosUnificados.map(evento => `
            <div class="evento-card">
                <div class="evento-header">${evento.empresaNome}</div>
                <div class="evento-body">
                    <div>📅 ${new Date(evento.data_evento).toLocaleDateString()}</div>
                    <div>🕐 ${evento.hora_evento}</div>
                    <div>📍 ${evento.nome_local_evento}</div>
                </div>
            </div>
        `).join('');
    }
}

// Função global para verificar novamente
function verificarNovamente() {
    location.reload();
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppUsuarioAutorizado();
    window.app.init();
});