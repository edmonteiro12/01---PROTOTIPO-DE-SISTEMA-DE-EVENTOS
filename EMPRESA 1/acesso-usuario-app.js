// ==================== ACESSO USUÁRIO APP ====================

// Prefixo para segregação de dados da empresa
const EMPRESA_PREFIX = 'empresa1_';

// Trocar aba
function abrirTabUsuarioApp(aba) {
    document.querySelectorAll('#conteudo-usuario-app .tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    document.querySelectorAll('#acesso_usuario_app .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const abaElement = document.getElementById(`tab-${aba}`);
    if (abaElement) {
        abaElement.style.display = 'block';
    }
    
    event.target.classList.add('active');
}

// Carregar usuários disponíveis para cadastro
function carregarUsuariosDisponiveis() {
    const tipo = document.getElementById('tipo_usuario_cadastro').value;
    const selectUsuario = document.getElementById('select_usuario_app');
    const container = document.getElementById('selectUsuarioContainer');
    
    if (!tipo) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'block';
    selectUsuario.innerHTML = '<option value="">— Selecione —</option>';
    
    let usuarios = [];
    
    if (tipo === 'elenco') {
        usuarios = JSON.parse(localStorage.getItem(EMPRESA_PREFIX + 'elenco_cadastrados') || '[]');
    } else if (tipo === 'motorista') {
        usuarios = JSON.parse(localStorage.getItem(EMPRESA_PREFIX + 'motoristas_cadastrados') || '[]');
    }
    
    usuarios.forEach(usuario => {
        const option = document.createElement('option');
        option.value = JSON.stringify(usuario);
        option.textContent = usuario.nome_elenco || usuario.nome_motoristas || 'Sem nome';
        selectUsuario.appendChild(option);
    });
}

// Preencher dados do usuário selecionado
function preencherDadosUsuarioApp() {
    const selectUsuario = document.getElementById('select_usuario_app');
    const dadosContainer = document.getElementById('dadosUsuarioApp');
    
    if (!selectUsuario.value) {
        dadosContainer.style.display = 'none';
        return;
    }
    
    const usuario = JSON.parse(selectUsuario.value);
    
    document.getElementById('nome_usuario_app').textContent = usuario.nome_elenco || usuario.nome_motoristas || '-';
    document.getElementById('cpf_usuario_app').textContent = usuario.doc_elenco_cadastro || usuario.doc_motoristas_cadastro || '-';
    document.getElementById('telefone_usuario_app').textContent = usuario.telefone_elenco || usuario.telefone_motoristas || '-';
    
    dadosContainer.style.display = 'block';
}

// Cadastrar usuário do app
function cadastrarUsuarioApp() {
    const tipo = document.getElementById('tipo_usuario_cadastro').value;
    const selectUsuario = document.getElementById('select_usuario_app');
    
    if (!tipo || !selectUsuario.value) {
        alert('Preencha todos os campos!');
        return;
    }
    
    const usuario = JSON.parse(selectUsuario.value);
    
    // Salvar no localStorage
    const usuariosApp = JSON.parse(localStorage.getItem('usuarios_app') || '[]');
    
    const cpf = (usuario.doc_elenco_cadastro || usuario.doc_motoristas_cadastro || '').replace(/\D/g, '');
    
    // Verificar se já existe
    const existe = usuariosApp.find(u => u.cpf === cpf && u.tipo === tipo);
    if (existe) {
        alert('⚠️ Este usuário já possui acesso cadastrado!');
        return;
    }
    
    const novoUsuario = {
        cpf: cpf,
        nome: usuario.nome_elenco || usuario.nome_motoristas,
        tipo: tipo,
        id_original: usuario.ID_elenco || usuario.ID_motoristas,
        dataCadastro: new Date().toISOString()
    };
    
    usuariosApp.push(novoUsuario);
    localStorage.setItem('usuarios_app', JSON.stringify(usuariosApp));
    
    alert('Usuário cadastrado com sucesso! Agora ele pode fazer login no app.');
    limparFormularioCadastroApp();
}

// Limpar formulário de cadastro
function limparFormularioCadastroApp() {
    document.getElementById('tipo_usuario_cadastro').value = '';
    document.getElementById('selectUsuarioContainer').style.display = 'none';
    document.getElementById('dadosUsuarioApp').style.display = 'none';
}

// Fazer login no app
function fazerLoginApp() {
    const cpfInput = document.getElementById('cpf_login_app').value;
    const tipo = document.getElementById('tipo_usuario_login').value;
    
    if (!cpfInput || !tipo) {
        alert('Preencha todos os campos!');
        return;
    }
    
    const cpf = cpfInput.replace(/\D/g, '');
    const usuariosApp = JSON.parse(localStorage.getItem('usuarios_app') || '[]');
    
    const usuario = usuariosApp.find(u => u.cpf === cpf && u.tipo === tipo);
    
    if (!usuario) {
        alert('❌ Usuário não encontrado! Verifique o CPF e o tipo de usuário.');
        return;
    }
    
    // Salvar sessão
    sessionStorage.setItem('usuario_logado_app', JSON.stringify(usuario));
    
    // Mostrar área logada
    document.getElementById('tab-login').style.display = 'none';
    document.getElementById('tab-cadastro').style.display = 'none';
    document.getElementById('area-logada-app').style.display = 'block';
    
    // Preencher dados
    document.getElementById('nome_logado').textContent = usuario.nome;
    document.getElementById('tipo_logado').textContent = usuario.tipo === 'elenco' ? '🎬 Elenco' : '🚗 Motorista';
    
    // Carregar escalas
    carregarMinhasEscalas();
    
    // Iniciar verificação de notificações
    if (typeof iniciarVerificacaoNotificacoes === 'function') {
        iniciarVerificacaoNotificacoes();
    }
    
    alert('Login realizado com sucesso!');
}

// Formatar CPF
function formatarCPF(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length <= 11) {
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        input.value = valor;
    }
}

// Fazer logout
function fazerLogoutApp() {
    sessionStorage.removeItem('usuario_logado_app');
    
    document.getElementById('tab-login').style.display = 'block';
    document.getElementById('area-logada-app').style.display = 'none';
    
    document.getElementById('formLoginApp').reset();
    
    alert('👋 Logout realizado!');
}

// Carregar minhas escalas
function carregarMinhasEscalas() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario_logado_app') || '{}');
    
    if (!usuarioLogado.cpf) {
        alert('Erro: Usuário não está logado!');
        return;
    }
    
    const cpfUsuario = usuarioLogado.cpf;
    const escalas = JSON.parse(localStorage.getItem('escalas_eventos') || '[]');
    const eventos = JSON.parse(localStorage.getItem('eventos_cadastrados') || '[]');
    const elenco = JSON.parse(localStorage.getItem('elenco_cadastrados') || '[]');
    const motoristas = JSON.parse(localStorage.getItem('motoristas_cadastrados') || '[]');
    const clientes = JSON.parse(localStorage.getItem('clientes_cadastrados') || '[]');
    const casasFesta = JSON.parse(localStorage.getItem('casa_de_festas_cadastradas') || '[]');
    
    // Filtrar escalas onde o CPF do usuário está presente
    const minhasEscalas = escalas.filter(escala => {
        const elencoEscalado = (escala.elenco_cpfs || []).includes(cpfUsuario);
        const motoristaEscalado = escala.motorista_cpf === cpfUsuario;
        return elencoEscalado || motoristaEscalado;
    });
    
    const tbody = document.getElementById('tabelaMinhasEscalas');
    tbody.innerHTML = '';
    
    if (minhasEscalas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: 2rem;">Você não está escalado em nenhum evento no momento</td></tr>';
        return;
    }
    
    // Ordenar por data
    minhasEscalas.sort((a, b) => new Date(a.evento_data) - new Date(b.evento_data));
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    minhasEscalas.forEach(escala => {
        const tr = document.createElement('tr');
        
        // Buscar evento completo
        const evento = eventos.find(e => e.id === escala.evento_id);
        if (!evento) return;
        
        // Buscar cliente
        const cliente = clientes.find(c => c.doc_clientes_cadastro === evento.doc_evento_cadastro);
        const nomeCliente = evento.nome_cliente_evento || cliente?.nome_clientes || '-';
        
        // Buscar local
        let nomeLocal = evento.nome_local_evento || '-';
        let bairroLocal = evento.bairro_local_evento || '';
        
        if (evento.casa_festa) {
            const casa = casasFesta.find(c => c.nome_casa_de_festas === evento.casa_festa);
            if (casa) {
                nomeLocal = casa.nome_casa_de_festas;
                bairroLocal = casa.bairro_casa_de_festas || '';
            }
        }
        
        // Determinar função, valor e status
        let funcao = '';
        let valorCache = 0;
        let statusPagamento = 'Pendente';
        
        if ((escala.elenco_cpfs || []).includes(cpfUsuario)) {
            const indexElenco = escala.elenco_cpfs.indexOf(cpfUsuario);
            const personagem = escala.elenco[indexElenco];
            funcao = personagem?.personagem || 'Elenco';
            
            const membroElenco = elenco.find(e => (e.doc_elenco_cadastro || '').replace(/\D/g, '') === cpfUsuario);
            if (membroElenco && membroElenco.cache_elenco) {
                const cacheStr = String(membroElenco.cache_elenco).replace(/[^\d,]/g, '').replace(',', '.');
                valorCache = parseFloat(cacheStr) || 0;
            }
        } else if (escala.motorista_cpf === cpfUsuario) {
            funcao = 'Motorista';
            const membroMotorista = motoristas.find(m => (m.doc_motoristas_cadastro || '').replace(/\D/g, '') === cpfUsuario);
            if (membroMotorista && membroMotorista.cache_motoristas) {
                const cacheStr = String(membroMotorista.cache_motoristas).replace(/[^\d,]/g, '').replace(',', '.');
                valorCache = parseFloat(cacheStr) || 0;
            }
        }
        
        // Verificar status de pagamento
        const dataEvento = new Date(evento.data_evento);
        dataEvento.setHours(0, 0, 0, 0);
        statusPagamento = dataEvento < hoje ? 'Pago' : 'A Receber';
        const corStatusPagamento = statusPagamento === 'Pago' ? '#28a745' : '#ffc107';
        
        // Status do evento
        let statusEvento = evento.status_evento || 'reservado';
        let corStatusEvento = '#007bff';
        let textoStatus = 'Reservado';
        
        if (statusEvento === 'confirmado') {
            corStatusEvento = '#28a745';
            textoStatus = 'Confirmado';
        } else if (statusEvento === 'finalizado') {
            corStatusEvento = '#6c757d';
            textoStatus = 'Finalizado';
        } else if (statusEvento === 'cancelado') {
            corStatusEvento = '#dc3545';
            textoStatus = 'Cancelado';
        } else if (statusEvento === 'adiado') {
            corStatusEvento = '#fd7e14';
            textoStatus = 'Adiado';
        }
        
        // Formatar data
        const dataFormatada = evento.data_evento ? new Date(evento.data_evento).toLocaleDateString('pt-BR') : '-';
        
        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${evento.hora_evento || '-'}</td>
            <td>${evento.hora_saida || '-'}</td>
            <td>${nomeCliente}</td>
            <td>${evento.telefone_cliente_evento || cliente?.telefone_cliente || '-'}</td>
            <td>${nomeLocal}${bairroLocal ? ' - ' + bairroLocal : ''}</td>
            <td>${evento.logradouro_local_evento || ''} ${evento.numero_local_evento || ''} ${evento.cidade_local_evento ? '- ' + evento.cidade_local_evento : ''}</td>
            <td>${funcao}</td>
            <td>R$ ${valorCache.toFixed(2).replace('.', ',')}</td>
            <td><span style="background: ${corStatusPagamento}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${statusPagamento}</span></td>
            <td><span style="background: ${corStatusEvento}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${textoStatus}</span></td>
        `;
        
        tbody.appendChild(tr);
    });
}


// Filtrar minhas escalas
function filtrarMinhasEscalas() {
    const periodo = document.getElementById('filtro_periodo_escalas').value;
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario_logado_app') || '{}');
    
    if (!usuarioLogado.cpf) return;
    
    const eventos = JSON.parse(localStorage.getItem('eventos_cadastrados') || '[]');
    const escalas = JSON.parse(localStorage.getItem('escalas_eventos') || '[]');
    
    let minhasEscalas = [];
    
    escalas.forEach(escala => {
        let incluir = false;
        let personagem = '-';
        
        if (usuarioLogado.tipo === 'elenco') {
            if (escala.elenco && Array.isArray(escala.elenco)) {
                const encontrado = escala.elenco.find(e => e.id === usuarioLogado.id_original || e.ID_elenco === usuarioLogado.id_original);
                if (encontrado) {
                    incluir = true;
                    personagem = encontrado.personagem || '-';
                }
            }
        } else if (usuarioLogado.tipo === 'motorista') {
            if (escala.motorista && (escala.motorista.id === usuarioLogado.id_original || escala.motorista.ID_motoristas === usuarioLogado.id_original)) {
                incluir = true;
                personagem = 'Motorista';
            }
        }
        
        if (incluir) {
            const evento = eventos.find(e => e.id === escala.evento_id);
            minhasEscalas.push({
                ...escala,
                ...evento,
                personagem_escalado: personagem
            });
        }
    });
    
    // Filtrar por período
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (periodo === 'proximos') {
        minhasEscalas = minhasEscalas.filter(e => {
            const dataEvento = new Date(e.data_evento);
            return dataEvento >= hoje;
        });
    } else if (periodo === 'passados') {
        minhasEscalas = minhasEscalas.filter(e => {
            const dataEvento = new Date(e.data_evento);
            return dataEvento < hoje;
        });
    }
    
    // Atualizar tabela
    const tbody = document.getElementById('tabelaMinhasEscalas');
    tbody.innerHTML = '';
    
    if (minhasEscalas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 2rem;">Nenhuma escala encontrada para o período selecionado</td></tr>';
        return;
    }
    
    const clientes = JSON.parse(localStorage.getItem('clientes_cadastrados') || '[]');
    
    minhasEscalas.forEach(escala => {
        const tr = document.createElement('tr');
        const cliente = clientes.find(c => c.doc_clientes_cadastro === escala.doc_evento_cadastro);
        
        tr.innerHTML = `
            <td>${escala.data_evento || '-'}</td>
            <td>${escala.hora_evento || '-'}</td>
            <td>${escala.hora_saida || '-'}</td>
            <td>${escala.nome_cliente_evento || cliente?.nome_clientes || '-'}</td>
            <td>${escala.telefone_cliente_evento || cliente?.telefone_cliente || '-'}</td>
            <td>${escala.nome_local_evento || escala.casa_festa || '-'}</td>
            <td>${escala.logradouro_local_evento || ''} ${escala.numero_local_evento || ''} - ${escala.cidade_local_evento || ''}</td>
            <td>${escala.personagem_escalado || '-'}</td>
            <td><span class="status-badge ${escala.status || 'pendente'}">${escala.status || 'Pendente'}</span></td>
            <td>${escala.observacoes || escala.observacoesEscala || '-'}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Salvar disponibilidade
function salvarDisponibilidade() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario_logado_app') || '{}');
    const data = document.getElementById('data_disponibilidade').value;
    const horaInicio = document.getElementById('hora_inicio_disponibilidade')?.value || '';
    const horaFim = document.getElementById('hora_fim_disponibilidade')?.value || '';
    const status = document.getElementById('status_disponibilidade').value;
    const obs = document.getElementById('obs_disponibilidade').value;
    
    if (!data) {
        alert('Selecione uma data!');
        return;
    }
    
    const disponibilidades = JSON.parse(localStorage.getItem('disponibilidades_elenco') || '[]');
    
    const nova = {
        cpf: usuarioLogado.cpf,
        nome: usuarioLogado.nome,
        data: data,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        status: status,
        observacao: obs,
        dataCadastro: new Date().toISOString()
    };
    
    disponibilidades.push(nova);
    localStorage.setItem('disponibilidades_elenco', JSON.stringify(disponibilidades));
    
    alert('Disponibilidade salva com sucesso!');
    document.getElementById('data_disponibilidade').value = '';
    if (document.getElementById('hora_inicio_disponibilidade')) document.getElementById('hora_inicio_disponibilidade').value = '';
    if (document.getElementById('hora_fim_disponibilidade')) document.getElementById('hora_fim_disponibilidade').value = '';
    document.getElementById('obs_disponibilidade').value = '';
    carregarDisponibilidades();
}

// Carregar disponibilidades
function carregarDisponibilidades() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario_logado_app') || '{}');
    const disponibilidades = JSON.parse(localStorage.getItem('disponibilidades_elenco') || '[]');
    
    const minhas = disponibilidades.filter(d => d.cpf === usuarioLogado.cpf);
    minhas.sort((a, b) => new Date(b.data) - new Date(a.data));
    
    const tbody = document.getElementById('tabelaDisponibilidade');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (minhas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">Nenhuma disponibilidade cadastrada</td></tr>';
        return;
    }
    
    minhas.forEach((disp, index) => {
        const tr = document.createElement('tr');
        const dataFormatada = new Date(disp.data + 'T00:00:00').toLocaleDateString('pt-BR');
        const statusTexto = disp.status === 'disponivel' ? '✅ Disponível' : '❌ Indisponível';
        const corStatus = disp.status === 'disponivel' ? '#28a745' : '#dc3545';
        
        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${disp.hora_inicio || '-'}</td>
            <td>${disp.hora_fim || '-'}</td>
            <td><span style="background: ${corStatus}; color: white; padding: 4px 8px; border-radius: 4px;">${statusTexto}</span></td>
            <td>${disp.observacao || '-'}</td>
            <td><button class="btn danger" onclick="excluirDisponibilidade(${index})" style="padding: 4px 8px;">🗑️</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Excluir disponibilidade
function excluirDisponibilidade(index) {
    if (!confirm('Deseja excluir esta disponibilidade?')) return;
    
    const usuarioLogado = JSON.parse(sessionStorage.getItem('usuario_logado_app') || '{}');
    const disponibilidades = JSON.parse(localStorage.getItem('disponibilidades_elenco') || '[]');
    
    const minhas = disponibilidades.filter(d => d.cpf === usuarioLogado.cpf);
    const outras = disponibilidades.filter(d => d.cpf !== usuarioLogado.cpf);
    
    minhas.splice(index, 1);
    
    localStorage.setItem('disponibilidades_elenco', JSON.stringify([...outras, ...minhas]));
    alert('Disponibilidade excluída!');
    carregarDisponibilidades();
}

// Abrir modal de usuários cadastrados
function abrirCadastroUsuarioApp() {
    const usuariosApp = JSON.parse(localStorage.getItem('usuarios_app') || '[]');
    
    let linhas = usuariosApp.length === 0
        ? '<tr><td colspan="4" style="text-align:center;padding:2rem;color:#999;">Nenhum usuário cadastrado</td></tr>'
        : usuariosApp.map((u, i) => `
            <tr>
                <td>${u.nome || '-'}</td>
                <td>${u.cpf ? u.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '-'}</td>
                <td>${u.tipo === 'elenco' ? '🎬 Elenco' : '🚗 Motorista'}</td>
                <td><button onclick="removerUsuarioApp(${i})" style="background:#dc3545;color:white;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;">🗑️</button></td>
            </tr>`).join('');
    
    const modal = `
        <div id="modalUsuariosCadastrados" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;" onclick="if(event.target.id==='modalUsuariosCadastrados')document.getElementById('modalUsuariosCadastrados').remove()">
            <div style="background:white;padding:2rem;border-radius:8px;max-width:700px;width:90%;max-height:80vh;overflow-y:auto;" onclick="event.stopPropagation()">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
                    <h3 style="margin:0;">👥 Usuários Cadastrados no App</h3>
                    <button onclick="document.getElementById('modalUsuariosCadastrados').remove()" style="background:#dc3545;color:white;border:none;padding:8px 12px;border-radius:6px;cursor:pointer;">✖</button>
                </div>
                <table style="width:100%;border-collapse:collapse;">
                    <thead><tr style="background:#f8f9fa;">
                        <th style="padding:10px;text-align:left;border-bottom:2px solid #dee2e6;">Nome</th>
                        <th style="padding:10px;text-align:left;border-bottom:2px solid #dee2e6;">CPF</th>
                        <th style="padding:10px;text-align:left;border-bottom:2px solid #dee2e6;">Tipo</th>
                        <th style="padding:10px;text-align:left;border-bottom:2px solid #dee2e6;">Ação</th>
                    </tr></thead>
                    <tbody>${linhas}</tbody>
                </table>
            </div>
        </div>`;
    
    document.body.insertAdjacentHTML('beforeend', modal);
}

// Remover usuário do app
function removerUsuarioApp(index) {
    if (!confirm('Remover acesso deste usuário?')) return;
    const usuariosApp = JSON.parse(localStorage.getItem('usuarios_app') || '[]');
    usuariosApp.splice(index, 1);
    localStorage.setItem('usuarios_app', JSON.stringify(usuariosApp));
    document.getElementById('modalUsuariosCadastrados')?.remove();
    abrirCadastroUsuarioApp();
}

// Mostrar aba logada
function mostrarAbaLogada(aba) {
    document.getElementById('conteudo-escalas').style.display = 'none';
    document.getElementById('conteudo-disponibilidade').style.display = 'none';
    
    document.getElementById('btnMinhasEscalas').style.background = '#6c757d';
    document.getElementById('btnDisponibilidade').style.background = '#6c757d';
    
    if (aba === 'escalas') {
        document.getElementById('conteudo-escalas').style.display = 'block';
        document.getElementById('btnMinhasEscalas').style.background = '#007bff';
        carregarMinhasEscalas();
    } else {
        document.getElementById('conteudo-disponibilidade').style.display = 'block';
        document.getElementById('btnDisponibilidade').style.background = '#007bff';
        carregarDisponibilidades();
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const usuarioLogado = sessionStorage.getItem('usuario_logado_app');
    
    if (usuarioLogado) {
        const usuario = JSON.parse(usuarioLogado);
        
        // Mostrar área logada
        document.getElementById('tab-login').style.display = 'none';
        document.getElementById('area-logada-app').style.display = 'block';
        
        document.getElementById('nome_logado').textContent = usuario.nome;
        document.getElementById('tipo_logado').textContent = usuario.tipo === 'elenco' ? '🎬 Elenco' : '🚗 Motorista';
        
        carregarMinhasEscalas();
    }
});

// Verificar se há usuário logado ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    const usuarioLogado = sessionStorage.getItem('usuario_logado_app');
    
    if (usuarioLogado) {
        const usuario = JSON.parse(usuarioLogado);
        
        // Mostrar área logada
        document.getElementById('tab-login').style.display = 'none';
        document.getElementById('area-logada-app').style.display = 'block';
        
        document.getElementById('nome_logado').textContent = usuario.nome;
        document.getElementById('tipo_logado').textContent = usuario.tipo === 'elenco' ? '🎬 Elenco' : '🚗 Motorista';
        
        carregarMinhasEscalas();
    }
});

// Exportar funções
window.abrirTabUsuarioApp = abrirTabUsuarioApp;
window.carregarUsuariosDisponiveis = carregarUsuariosDisponiveis;
window.preencherDadosUsuarioApp = preencherDadosUsuarioApp;
window.cadastrarUsuarioApp = cadastrarUsuarioApp;
window.limparFormularioCadastroApp = limparFormularioCadastroApp;
window.fazerLoginApp = fazerLoginApp;
window.fazerLogoutApp = fazerLogoutApp;
window.carregarMinhasEscalas = carregarMinhasEscalas;
window.filtrarMinhasEscalas = filtrarMinhasEscalas;
window.salvarDisponibilidade = salvarDisponibilidade;
window.carregarDisponibilidades = carregarDisponibilidades;
window.excluirDisponibilidade = excluirDisponibilidade;
window.mostrarAbaLogada = mostrarAbaLogada;

window.abrirCadastroUsuarioApp = abrirCadastroUsuarioApp;
window.removerUsuarioApp = removerUsuarioApp;
console.log('acesso-usuario-app.js carregado');
