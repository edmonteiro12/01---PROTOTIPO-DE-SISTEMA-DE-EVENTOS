
// Executa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[data-page]').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const pageId = this.getAttribute('data-page');
        showPage(pageId);
    });
});
    // Inicializa todas as páginas como ocultas
    const paginas = document.querySelectorAll('.page');
    paginas.forEach(pagina => {
        if (!pagina.classList.contains('active')) {
            pagina.style.display = 'none';
        }
    });
});
// ==================== scriptindex.js - SISTEMA CORRIGIDO ====================
// Função para gerar IDs automáticos
function gerarID(formulario) {
  const prefixos = {
    'clientes': 'CLI',
    'casa_de_festas': 'CF',
    'elenco': 'EL',
    'personagens': 'PER',
    'motoristas': 'MOT',
    'fornecedores': 'FOR',
    'funcionarios': 'FUNC',
    'usuarios': 'USR',
    'eventos': 'EV',
    'manutencoes': 'MAN',
    'checklist': 'CHK',
    'escalas': 'ESC'
  };
  
  const prefixo = prefixos[formulario] || 'ID';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${prefixo}-${timestamp}-${random}`;
}

// Função para inicializar IDs Ação abrir formulários
function inicializarID(formulario) {
  const idField = document.getElementById(`ID_${formulario}`);
  if (idField) {
    idField.value = gerarID(formulario);
  }
}

// ==================== FUNÃÃES DE USUÃRIOS ====================

// Função para salvar usuário
function salvarUsuario() {
    console.log('📋¾ Salvando usuário...');
    
    const id = document.getElementById('ID_usuario').value || gerarID('usuarios');
    const cpf = document.getElementById('cpf_usuario').value;
    const nome = document.getElementById('nome_usuario').value;
    const login = document.getElementById('login_usuario').value;
    const senha = document.getElementById('senha_usuario').value;
    const email = document.getElementById('email_usuario').value;
    const telefone = document.getElementById('telefone_usuario').value;
    const cargo = document.getElementById('cargo_usuario').value;
    const dataAdmissAção = document.getElementById('data_admissAção').value || new Date().toISOString().split('T')[0];
    const status = 'ativo';
    
    // Validaï¿½ï¿½es
    if (!cpf || !nome || !login || !senha) {
        alert('Por favor, preencha todos os campos obrigatï¿½rios (*)');
        return;
    }
    
    // Validar CPF
    if (!validarCPF(cpf)) {
        alert('CPF invï¿½lido!');
        return;
    }
    
    // Criar objeto do usuï¿½rio
    const usuario = {
        id: id,
        cpf: cpf.replace(/\D/g, ''),
        nome: nome,
        login: login,
        senha: senha,
        email: email,
        telefone: telefone.replace(/\D/g, ''),
        cargo: cargo,
        dataAdmissAção: dataAdmissAção,
        status: status,
        dataCadastro: new Date().toISOString(),
        permissoes: []
    };
    
    // Obter usuários existentes
    let usuarios = JSON.parse(localStorage.getItem('usuarios_sistema') || '[]');
    
    // Verificar se login já existe
    if (usuarios.some(u => u.login === login && u.id !== id)) {
        alert('Login já existe! Escolha outro login.');
        return;
    }
    
    // Verificar se CPF já existe
    if (usuarios.some(u => u.cpf === usuario.cpf && u.id !== id)) {
        alert('CPF já cadastrado no sistema!');
        return;
    }
    
    // Verificar se é edição ou novo cadastro
    const index = usuarios.findIndex(u => u.id === id);
    let mensagem = '';
    
    if (index !== -1) {
        usuarios[index] = usuario;
        mensagem = 'Usuário atualizado com sucesso!';
    } else {
        usuarios.push(usuario);
        mensagem = 'Usuário cadastrado com sucesso!';
    }
    
    // Salvar no localStorage
    localStorage.setItem('usuarios_sistema', JSON.stringify(usuarios));
    
    // Atualizar lista
    atualizarListaUsuarios();
    atualizarListaUsuariosConfiguracoes();
    atualizarSelectUsuariosPermissoes();
    
    // Limpar formulário
    limparFormularioUsuario();
    
    // Gerar novo ID
    document.getElementById('ID_usuario').value = gerarID('usuarios');
    
    // Mostrar mensagem
    mostrarMensagemSucesso(mensagem);
    
    console.log('Usuário salvo:', usuario);
}

// Atualizar lista de usuï¿½rios
function atualizarListaUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios_sistema') || '[]');
    const tabela = document.getElementById('listaUsuarios');
    
    if (!tabela) return;
    
    let html = '';
    
    usuarios.forEach(usuario => {
        const statusClass = usuario.status === 'ativo' ? 'status-ativo' : 'status-inativo';
        const statusText = usuario.status === 'ativo' ? 'Ativo' : 'Inativo';
        
        html += `
            <tr>
                <td>${usuario.id}</td>
                <td><strong>${usuario.nome}</strong></td>
                <td>${usuario.login}</td>
                <td>${usuario.cargo || 'Não definido'}</td>
                <td>
                    <span class="${statusClass}">${statusText}</span>
                </td>
                <td>
                    <button class="btn small" onclick="editarUsuario('${usuario.id}')">
                        Editar
                    </button>
                    <button class="btn small ${usuario.status === 'ativo' ? 'danger' : 'success'}" 
                            onclick="toggleStatusUsuario('${usuario.id}')">
                        ${usuario.status === 'ativo' ? 'Desativar' : 'Ativar'}
                    </button>
                    <button class="btn small info" onclick="gerenciarPermissoes('${usuario.id}')">
                        📋 Permissões
                    </button>
                </td>
            </tr>
        `;
    });
    
    tabela.innerHTML = html || '<tr><td colspan="6" style="text-align:center;">Nenhum usuário cadastrado</td></tr>';
}

// Atualizar lista de usuários em configurações
function atualizarListaUsuariosConfiguracoes() {
    const tabela = document.getElementById('listaUsuariosConfiguracoes');
    
    if (!tabela) return;
    
    const usuarios = JSON.parse(localStorage.getItem('usuarios_sistema') || '[]');
    let html = '';
    
    usuarios.forEach(usuario => {
        const statusClass = usuario.status === 'ativo' ? 'status-ativo' : 'status-inativo';
        const statusText = usuario.status === 'ativo' ? 'Ativo' : 'Inativo';
        const permissoesCount = usuario.permissoes ? usuario.permissoes.length : 0;
        
        html += `
            <tr>
                <td>${usuario.id}</td>
                <td><strong>${usuario.nome}</strong></td>
                <td>${usuario.login}</td>
                <td>${usuario.cargo || 'Nï¿½o definido'}</td>
                <td>
                    <span class="${statusClass}">${statusText}</span>
                </td>
                <td>${permissoesCount} permissï¿½es</td>
                <td>
                    <button class="btn small info" onclick="gerenciarPermissoes('${usuario.id}')">
                        Gerenciar
                    </button>
                    <button class="btn small ${usuario.status === 'ativo' ? 'danger' : 'success'}" 
                            onclick="toggleStatusUsuario('${usuario.id}')">
                        ${usuario.status === 'ativo' ? 'Desativar' : 'Ativar'}
                    </button>
                </td>
            </tr>
        `;
    });
    
    tabela.innerHTML = html || '<tr><td colspan="7" style="text-align:center;">Nenhum usuário cadastrado</td></tr>';
}

// Limpar formulário de usuário
function limparFormularioUsuario() {
    const form = document.getElementById('formUsuario');
    if (form) {
        form.reset();
        document.getElementById('ID_usuario').value = gerarID('usuarios');
    }
}

// Editar usuário
function editarUsuario(id) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios_sistema') || '[]');
    const usuario = usuarios.find(u => u.id === id);
    
    if (!usuario) {
        alert('Usuï¿½rio nï¿½o encontrado!');
        return;
    }
    
    // Preencher formulï¿½rio
    document.getElementById('ID_usuario').value = usuario.id;
    document.getElementById('cpf_usuario').value = usuario.cpf;
    document.getElementById('nome_usuario').value = usuario.nome;
    document.getElementById('login_usuario').value = usuario.login;
    document.getElementById('senha_usuario').value = usuario.senha;
    document.getElementById('email_usuario').value = usuario.email || '';
    document.getElementById('telefone_usuario').value = usuario.telefone || '';
    document.getElementById('cargo_usuario').value = usuario.cargo || '';
    document.getElementById('data_admissAção').value = usuario.dataAdmissAção || '';
    
    // Mostrar página de usuários
    showPage('usuarios_sistema');
    
    // Rolar até o formulário
    document.getElementById('formUsuario').scrollIntoView({ behavior: 'smooth' });
}

// Alternar status do usuário
function toggleStatusUsuario(id) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios_sistema') || '[]');
    const index = usuarios.findIndex(u => u.id === id);
    
    if (index === -1) {
        alert('Usuï¿½rio nï¿½o encontrado!');
        return;
    }
    
    if (confirm(`Deseja ${usuarios[index].status === 'ativo' ? 'desativar' : 'ativar'} este usuário?`)) {
        usuarios[index].status = usuarios[index].status === 'ativo' ? 'inativo' : 'ativo';
        localStorage.setItem('usuarios_sistema', JSON.stringify(usuarios));
        atualizarListaUsuarios();
        atualizarListaUsuariosConfiguracoes();
        atualizarSelectUsuariosPermissoes();
        
        mostrarMensagemSucesso(`Usuário ${usuarios[index].status === 'ativo' ? 'ativado' : 'desativado'} com sucesso!`);
    }
}

// Gerenciar permissões do usuário
function gerenciarPermissoes(id) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios_sistema') || '[]');
    const usuario = usuarios.find(u => u.id === id);
    
    if (!usuario) {
        alert('Usuário não encontrado!');
        return;
    }
    
    mostrarModalPermissoes(usuario);
}

// Mostrar modal de permissões
function mostrarModalPermissoes(usuario) {
    const permissoesDisponiveis = [
        { id: 'dashboard', nome: 'Visualizar Dashboard' },
        { id: 'clientes', nome: 'Gerenciar Clientes' },
        { id: 'eventos', nome: 'Gerenciar Eventos' },
        { id: 'elenco', nome: 'Gerenciar Elenco' },
        { id: 'personagens', nome: 'Gerenciar Personagens' },
        { id: 'motoristas', nome: 'Gerenciar Motoristas' },
        { id: 'fornecedores', nome: 'Gerenciar Fornecedores' },
        { id: 'funcionarios', nome: 'Gerenciar Funcionários' },
        { id: 'usuarios_sistema', nome: 'Gerenciar Usuários' },
        { id: 'relatorios', nome: 'Visualizar Relatórios' },
        { id: 'configuracoes', nome: 'Acessar Configurações' }
    ];
    
    let html = `
        <div class="modal" style="display: block; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);">
            <div class="modal-content" style="background-color: #fefefe; margin: 5% auto; padding: 20px; border: 1px solid #888; width: 500px; border-radius: 10px; max-height: 80vh; overflow-y: auto;">
                <span class="close" onclick="this.parentElement.parentElement.style.display='none'" style="float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
                <h3>📋 Gerenciar Permissões</h3>
                <p><strong>Usuário:</strong> ${usuario.nome} (${usuario.login})</p>
                <p><strong>Status:</strong> <span class="${usuario.status === 'ativo' ? 'status-ativo' : 'status-inativo'}">${usuario.status === 'ativo' ? 'Ativo' : 'Inativo'}</span></p>
                <div class="permissoes-lista" style="margin: 20px 0;">
    `;
    
    permissoesDisponiveis.forEach(permissAção => {
        const checked = usuario.permissoes && usuario.permissoes.includes(permissAção.id) ? 'checked' : '';
        html += `
            <div style="margin-bottom: 10px; display: flex; align-items: center; padding: 5px; border-bottom: 1px solid #eee;">
                <input type="checkbox" id="perm_${permissAção.id}" ${checked} 
                       style="margin-right: 10px; width: 18px; height: 18px;">
                <label for="perm_${permissAção.id}" style="flex: 1; cursor: pointer; font-size: 14px;">${permissAção.nome}</label>
            </div>
        `;
    });
    
    html += `
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                    <button class="btn" onclick="this.parentElement.parentElement.parentElement.style.display='none'" style="padding: 8px 16px;">Cancelar</button>
                    <button class="btn success" onclick="salvarPermissoes('${usuario.id}')" style="padding: 8px 16px;">Salvar Permissões</button>
                </div>
            </div>
        </div>
    `;
    
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = html;
    document.body.appendChild(modalDiv);
}

// Salvar permissões do usuário
function salvarPermissoes(usuarioId) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios_sistema') || '[]');
    const index = usuarios.findIndex(u => u.id === usuarioId);
    
    if (index === -1) {
        alert('Usuário não encontrado!');
        return;
    }
    
    const permissoesSelecionadas = [];
    const checkboxes = document.querySelectorAll('[id^="perm_"]');
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const permissAçãoId = checkbox.id.replace('perm_', '');
            permissoesSelecionadas.push(permissAçãoId);
        }
    });
    
    usuarios[index].permissoes = permissoesSelecionadas;
    localStorage.setItem('usuarios_sistema', JSON.stringify(usuarios));
    
    // Fechar modal
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.style.display = 'none';
        modal.remove();
    }
    // Se as permissões foram carregadas inline na área principal, esconda-a
    const area = document.getElementById('areaPermissoes');
    if (area) {
        area.style.display = 'none';
        area.innerHTML = '';
    }
    
    // Atualizar listas
    atualizarListaUsuariosConfiguracoes();
    atualizarSelectUsuariosPermissoes();
    
    mostrarMensagemSucesso('Permissões atualizadas com sucesso!');
}

// Atualizar select de usuários para gerenciar permissões
function atualizarSelectUsuariosPermissoes() {
    // Atualiza qualquer select de permissões que exista (compatibilidade)
    const selects = [document.getElementById('selectUsuarioPermissoes'), document.getElementById('usuario_select')];
    const usuarios = JSON.parse(localStorage.getItem('usuarios_sistema') || '[]');
    const usuariosAtivos = usuarios.filter(u => u.status === 'ativo');

    selects.forEach(select => {
        if (!select) return;
        select.innerHTML = '<option value="">selecione um usuário</option>';
        usuariosAtivos.forEach(usuario => {
            const option = document.createElement('option');
            option.value = usuario.id;
            option.textContent = `${usuario.nome} (${usuario.login}) - ${usuario.cargo || 'Sem cargo'}`;
            select.appendChild(option);
        });

        // Configurar evento de seleção
        select.onchange = function() {
            const btn = document.getElementById('btnCarregarPermissoes');
            if (btn) btn.disabled = !this.value;
        };
    });
}

// Função chamada pelo botão Ação lado do select: carrega as permissões diretamente na área principal
function carregarPermissoesUsuarioSelecionado() {
    const select = document.getElementById('usuario_select');
    if (!select || !select.value) return alert('Selecione um usuário primeiro.');
    const usuarios = JSON.parse(localStorage.getItem('usuarios_sistema') || '[]');
    const usuario = usuarios.find(u => u.id === select.value);
    if (!usuario) return alert('Usuário não encontrado.');


    const area = document.getElementById('areaPermissoes');
    if (!area) return alert('Área de permissões não encontrada na página.');

    let html = `
        <div style="background: #fff; padding: 16px; border-radius: 8px; border: 1px solid #eee;">
            <h3 style="margin-top:0;">Gerenciar Permissões</h3>
            <p><strong>Usuário:</strong> ${usuario.nome} (${usuario.login})</p>
            <p><strong>Status:</strong> <span class="${usuario.status === 'ativo' ? 'status-ativo' : 'status-inativo'}">${usuario.status === 'ativo' ? 'Ativo' : 'Inativo'}</span></p>
            <div class="permissoes-lista" style="margin: 20px 0;">
    `;

    permissoesDisponiveis.forEach(permissAção => {
        const checked = usuario.permissoes && usuario.permissoes.includes(permissAção.id) ? 'checked' : '';
        html += `
            <div style="margin-bottom: 10px; display: flex; align-items: center; padding: 5px; border-bottom: 1px solid #eee;">
                <input type="checkbox" id="perm_${permissAção.id}" ${checked} style="margin-right: 10px; width: 18px; height: 18px;">
                <label for="perm_${permissAção.id}" style="flex: 1; cursor: pointer; font-size: 14px;">${permissAção.nome}</label>
            </div>
        `;
    });

    html += `
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                <button class="btn" onclick="document.getElementById('areaPermissoes').style.display='none'">Cancelar</button>
                <button class="btn success" onclick="salvarPermissoes('${usuario.id}')">Salvar Permissões</button>
            </div>
        </div>
    `;

    area.innerHTML = html;
    area.style.display = 'block';
}

// Função auxiliar usada no onchange do select inicial na página
function usuarioSelecionadoChange() {
    const select = document.getElementById('usuario_select');
    const btn = document.getElementById('btnCarregarPermissoes');
    if (btn) btn.disabled = !select || !select.value;
}

// ==================== FUNÃÃES GENÃRICAS ====================

// Mostrar mensagem de sucesso
function mostrarMensagemSucesso(mensagem) {
    const mensagemDiv = document.createElement('div');
    mensagemDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
            font-family: Arial, sans-serif;
        ">
            ${mensagem}
        </div>
    `;
    
    document.body.appendChild(mensagemDiv);
    
    setTimeout(() => {
        mensagemDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => mensagemDiv.remove(), 300);
    }, 3000);
}

// Validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Validação básica de CPF
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

// Formatadores
function formatarDocumento(doc) {
    if (!doc) return '';
    const limpo = doc.replace(/\D/g, '');
    
    if (limpo.length === 11) {
        return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (limpo.length === 14) {
        return limpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    
    return doc;
}

function formatarTelefone(tel) {
    if (!tel) return '';
    const limpo = tel.replace(/\D/g, '');
    
    if (limpo.length === 10) {
        return limpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (limpo.length === 11) {
        return limpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    return tel;
}

function formatarData(dataString) {
    if (!dataString) return '--/--/----';
    try {
        const data = new Date(dataString);
        if (isNaN(data.getTime())) {
            // Tenta formato YYYY-MM-DD
            const [ano, mes, dia] = dataString.split('-');
            if (ano && mes && dia) {
                return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
            }
            return '--/--/----';
        }
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    } catch (error) {
        return '--/--/----';
    }
}

// ==================== NAVEGAÃÃO E MENUS ====================

// VARIÃVEIS GLOBAIS
let currentOpenMenu = null;
let currentDate = new Date();
let eventos = JSON.parse(localStorage.getItem('eventos') || '[]');

function showPage(pageId) {
    console.log(`Mostrando página: ${pageId}`);
    
    // Ocultar todas as páginas com display:none e visibility:hidden
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
        page.style.visibility = 'hidden';
        page.style.height = '0';
        page.style.overflow = 'hidden';
    });
    
    // Mostra a página desejada
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
        page.style.display = 'block';
        page.style.visibility = 'visible';
        page.style.height = 'auto';
        page.style.overflow = 'visible';
        
        // Força o scroll para o topo imediatamente
        window.scrollTo({ top: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // Também força o scroll do main container
        const main = document.getElementById('main');
        if (main) {
            main.scrollTop = 0;
            main.style.scrollBehavior = 'auto';
        }
        
        // Inicializar componentes específicos da página
        setTimeout(() => {
            initializePageComponents(pageId);
            
            // Forçar scroll para topo novamente para páginas que podem ter conteúdo
            // grande deslocando a página
            if (pageId === 'relatorio_equipe' || pageId === 'relatorio_checklist_personagem') {
                // Usar requestAnimationFrame para garantir que o reflow foi feito
                requestAnimationFrame(() => {
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                    
                    // Uma terceira vez para ter certeza
                    setTimeout(() => {
                        window.scrollTo(0, 0);
                        document.documentElement.scrollTop = 0;
                        document.body.scrollTop = 0;
                    }, 50);
                });
            }
            
            // No início do arquivo, adicione um mapeamento de páginas
const PAGE_CONFIG = {
    'contas_pagar_elenco': { tipo: 'formulario', titulo: '📋 Contas a Pagar - Elenco' },
    'contas_pagar_motoristas': { tipo: 'formulario', titulo: '📋 Contas a Pagar - Motoristas' },
    'contas_pagar_fornecedores': { tipo: 'formulario', titulo: '📋 Contas a Pagar - Fornecedores' },
    'contas_pagar_producAção': { tipo: 'formulario', titulo: '📋 Contas a Pagar - Produção' },
    'contas_pagar_funcionarios': { tipo: 'formulario', titulo: '📋 Contas a Pagar - Funcionários' },
    'contas_receber_eventos': { tipo: 'formulario', titulo: '📋° Contas a Receber - Eventos' },
    'fluxo_caixa': { tipo: 'formulario', titulo: '📋 Fluxo de Caixa' },
    'orcamentos': { tipo: 'formulario', titulo: '📋¼ Orçamentos' },
    'lista_disponibilidade_personagens': { tipo: 'formulario', titulo: '📋 Disponibilidade de Personagens' },
    'cadastrar_manutencAção': { tipo: 'formulario', titulo: '📋§ Cadastrar Manutenção' },
    'lista_de_manutencAção': { tipo: 'formulario', titulo: '📋 Lista de Manutenção' },
    'relatorio_eventos': { tipo: 'formulario', titulo: '📋 Relatório de Eventos' },
    'relatorio_clientes': { tipo: 'formulario', titulo: '📋¥ Relatório de Clientes' },
    'relatorio_personagens': { tipo: 'formulario', titulo: '📋­ Relatório de Personagens' },
    'relatorio_casas_de_festa': { tipo: 'formulario', titulo: '📋° Relatório de Casas de Festa' },
    'relatorio_financeiro': { tipo: 'formulario', titulo: '📋° Relatório Financeiro' },
    'usuarios_sistema': { tipo: 'formulario', titulo: '📋¤ Usuários do Sistema' },
    'permissoes_sistema': { tipo: 'formulario', titulo: '📋 Gerenciar Permissões' }
};

// Atualize a função initializePageComponents():
function initializePageComponents(pageId) {
    console.log(`Inicializando componentes da página: ${pageId}`);
    
    // Verificar se é uma página de formulário de financeiro
    if (PAGE_CONFIG[pageId] && PAGE_CONFIG[pageId].tipo === 'formulario') {
        console.log(`📋 Configurando formulário: ${pageId}`);
        inicializarFormularioFinanceiro(pageId);
        return;
    }
    
    switch(pageId) {
        case 'dashboard':
            loadCalendarData();
            updateCalendar();
            break;
            
        case 'reservar_evento':
            setTimeout(() => {
                if (typeof configurarReservaEvento === 'function') {
                    configurarReservaEvento();
                }
                configurarCamposEvento();
            }, 300);
            break;
            
        case 'personagens':
            const fotoInput = document.getElementById('foto_personagem');
            if (fotoInput && typeof previewFotoPersonagem === 'function') {
                fotoInput.addEventListener('change', function() {
                    previewFotoPersonagem(this);
                });
            }
            break;
            
        case 'configuracoes':
            // Configurar busca em configurações
            const buscarInput = document.getElementById('buscarUsuarioConfiguracoes');
            if (buscarInput) {
                buscarInput.addEventListener('input', filtrarUsuariosConfiguracoes);
            }
            break;
            
        case 'gerenciar_permissoes':
            // Configurar o select de usuários
            atualizarSelectUsuariosPermissoes();
            break;
            
        case 'relatorio_checklist_personagem':
            // Carregar dados de checklist por personagem
            carregarChecklistPersonagem();
            // Forçar scroll para o topo da página com múltiplas tentativas
            requestAnimationFrame(() => {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            });
            setTimeout(() => {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }, 100);
            break;
            
        case 'relatorio_equipe':
            // Carregar dados unificados da equipe
            carregarEquipeUnificada();
            // Forçar scroll para o topo da página com múltiplas tentativas
            requestAnimationFrame(() => {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            });
            setTimeout(() => {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }, 100);
            break;
    }
}

// Adicione esta função para inicializar formulários de financeiro
function inicializarFormularioFinanceiro(pageId) {
    console.log(`📋° Inicializando formulário financeiro: ${pageId}`);
    
    // Garantir que a página está visível e no topo
    const pagina = document.getElementById(pageId);
    if (pagina) {
        pagina.style.display = 'block';
        pagina.style.marginTop = '0';
        pagina.style.paddingTop = '0';
        
        // Rolar para o topo
        window.scrollTo(0, 0);
        
        // Inicializar campos se necessário
        const config = PAGE_CONFIG[pageId];
        if (config) {
            const tituloElement = pagina.querySelector('.card h2');
            if (tituloElement && !tituloElement.textContent.includes(config.titulo)) {
                tituloElement.textContent = config.titulo;
            }
        }
        
        // Configurar campos de data com valor atual por padrão
        const dataInputs = pagina.querySelectorAll('input[type="date"]');
        dataInputs.forEach(input => {
            if (!input.value) {
                input.value = new Date().toISOString().split('T')[0];
            }
        });
        
        // Configurar campos monetários
        const valorInputs = pagina.querySelectorAll('input[data-moeda="true"], input[class*="valor"]');
        valorInputs.forEach(input => {
            if (typeof formatarMoedaInput === 'function') {
                input.addEventListener('input', function() {
                    formatarMoedaInput(this);
                });
                
                // Formatar valor inicial se existir
                if (input.value) {
                    formatarMoeda(input);
                }
            }
        });
    }
}
            // Configurar eventos para formulário de usuários
            if (pageId === 'usuarios_sistema') {
                configurarEventoSalvarUsuario();
            }
            
            // Inicializar ID se for um formulário de cadastro
            const formularios = ['clientes', 'casa_de_festas', 'elenco', 'personagens', 
                               'motoristas', 'fornecedores', 'funcionarios', 'usuarios_sistema'];
            
            if (formularios.includes(pageId)) {
                const formTipo = pageId.replace('_sistema', '').replace('_de_', '_');
                const idField = document.getElementById(`ID_${formTipo}`);
                if (idField && !idField.value) {
                    idField.value = gerarID(formTipo);
                }
            }
            
            // NÃO salvar página atual para sempre voltar Ação dashboard
        }, 50);
    } else {
        console.error(`Página ${pageId} não encontrada!`);
    }
    
    window.scrollTo(0, 0);
}

        
// TOGGLE DE MENUS
function toggleMenu(menuId, buttonElement) {
    const menu = document.getElementById(menuId);
    if (!menu) return;
    
    const isVisible = menu.style.display === 'block';
    
    // Fechar menu anterior se aberto
    if (currentOpenMenu && currentOpenMenu !== menu) {
        currentOpenMenu.style.display = 'none';
        const prevButton = document.querySelector(`[data-toggle="${currentOpenMenu.id}"]`);
        if (prevButton) prevButton.classList.remove('active');
    }
    
    // Alternar estado do menu atual
    menu.style.display = isVisible ? 'none' : 'block';
    buttonElement.classList.toggle('active', !isVisible);
    currentOpenMenu = !isVisible ? menu : null;
}

// ==================== CALENDÃRIO ====================

// Função para carregar dados do calendário
function loadCalendarData() {
    const eventosCad = JSON.parse(localStorage.getItem('eventos_cadastrados') || '[]');
    eventos = eventosCad.map(e => ({
        data: e.data_evento || e.data || '',
        hora: e.hora_evento || e.hora || '',
        cliente: e.nome_cliente_evento || e.cliente || '',
        local: e.nome_local_evento || e.casa_festa || e.local || ''
    }));
}

// Função para atualizar o calendário
function updateCalendar() {
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const currentMonthElement = document.getElementById('currentMonth');
    if (currentMonthElement) {
        currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    
    const calendar = document.getElementById('calendar');
    if (calendar) {
        calendar.innerHTML = `<div class="calendar-grid">${generateCalendarHTML()}</div>`;
    }
}

// Gerar HTML do calendário
function generateCalendarHTML() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let html = '';
    
    // Cabeçalhos dos dias da semana
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    diasSemana.forEach(dia => {
        html += `<div class="calendar-day-header">${dia}</div>`;
    });
    
    // Dias vazios no início
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day-empty"></div>';
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const eventosNoDia = eventos.filter(e => e.data === dateStr);
        const isToday = isCurrentDay(day, month, year);
        
        html += `<div class="calendar-day${isToday ? ' today' : ''}">`;
        html += `<div class="day-number">${day}</div>`;
        
        // Eventos do dia
        eventosNoDia.slice(0, 2).forEach(e => {
            const title = `${e.cliente || 'Evento'}${e.hora ? ` - ${e.hora}` : ''}${e.local ? ' | ' + e.local : ''}`;
            const label = `${e.cliente?.substring(0, 10) || 'Evento'}${e.local ? ' - ' + e.local.substring(0, 8) : ''}`;
            html += `<div class="event-indicator" title="${title}">${label}</div>`;
        });
        
        if (eventosNoDia.length > 2) {
            html += `<div class="event-indicator">+${eventosNoDia.length - 2} mais</div>`;
        }
        
        html += '</div>';
    }
    
    return html;
}

// Verificar se é o dia atual
function isCurrentDay(day, month, year) {
    const hoje = new Date();
    return hoje.getDate() === day && hoje.getMonth() === month && hoje.getFullYear() === year;
}

// Navegar para mês anterior
function previousMonth() { 
    currentDate.setMonth(currentDate.getMonth() - 1); 
    updateCalendar(); 
}

// Navegar para próximo mês
function nextMonth() { 
    currentDate.setMonth(currentDate.getMonth() + 1); 
    updateCalendar(); 
}

// ==================== DASHBOARD ====================

// Carregar dados do dashboard
function loadDashboardData() {
    loadCalendarData();
    
    // Próximo evento
    if (eventos.length > 0) {
        eventos.sort((a, b) => new Date(a.data) - new Date(b.data));
        const hoje = new Date().toISOString().split('T')[0];
        const eventoFuturo = eventos.find(e => e.data >= hoje);
        
        if (eventoFuturo) {
            document.getElementById('nextEventDate').textContent = formatarData(eventoFuturo.data);
            document.getElementById('nextEventTime').textContent = eventoFuturo.hora || '--:--';
            document.getElementById('nextEventClient').textContent = eventoFuturo.cliente || 'Cliente não informado';
            document.getElementById('nextEventLocation').textContent = eventoFuturo.local || '--';
        }
    }
    
    // Atualizar calendário
    updateCalendar();
}

// ==================== RELÃGIO ====================

// Atualizar relógio
function updateClock() {
    const clockElement = document.getElementById('userClock');
    if (clockElement) {
        const now = new Date();
        const horas = String(now.getHours()).padStart(2, '0');
        const minutos = String(now.getMinutes()).padStart(2, '0');
        const segundos = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${horas}:${minutos}:${segundos}`;
    }
}

// Atualizar informações do usuário
function updateUserInfo() {
    const userName = localStorage.getItem('userName') || 'Administrador';
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = userName;
    }
}

// ==================== INICIALIZAÃÃO DO SISTEMA ====================

function inicializarSistema() {
    console.log('📋 Inicializando sistema...');
    
    // Configurar todos os botões de salvar
    configurarTodosBotoesSalvar();
    
    // Configurar eventos específicos de usuários
    configurarEventoSalvarUsuario();
    
    // Atualizar listas
    atualizarListaUsuarios();
    atualizarListaUsuariosConfiguracoes();
    atualizarSelectUsuariosPermissoes();
    
    // Inicializar IDs para formulários
    const formularios = ['clientes', 'casa_de_festas', 'elenco', 'personagens', 
                        'motoristas', 'fornecedores', 'funcionarios', 'usuarios'];
    
    formularios.forEach(form => {
        const idField = document.getElementById(`ID_${form}`);
        if (idField && !idField.value) {
            idField.value = gerarID(form);
        }
    });
    
    console.log('Sistema inicializado');
}

// ==================== CONTROLE FINAL DE MENUS E SUBMENUS ====================

function setupEventListeners() {
    console.log('Configurando event listeners...');
    
    // Navegação de páginas
    document.querySelectorAll('[data-page]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const pageId = this.getAttribute('data-page');
            console.log(`Navegando para: ${pageId}`);
            showPage(pageId);
        });
    });
    
    /* =====================================================
       MENU PRINCIPAL (FINANCEIRO, RELATÃRIOS, ETC)
    ===================================================== */
    document.querySelectorAll(".menu-toggle").forEach(botAção => {
      botAção.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const menuId = this.getAttribute("data-toggle");
        const menu = document.getElementById(menuId);
        if (!menu) return;

        const aberto = menu.style.display === "block";
        menu.style.display = aberto ? "none" : "block";

        const arrow = this.querySelector(".dropdown-arrow");
        if (arrow) arrow.classList.toggle("open", !aberto);
      });
    });

    /* =====================================================
       SUBMENUS (CONTAS / RELATÃRIOS DENTRO DO FINANCEIRO)
       📋 IDENTIFICA AUTOMATICAMENTE SE Ã SUBMENU OU PÃGINA
    ===================================================== */
    document.querySelectorAll(".submenu-page").forEach(botAção => {

      botAção.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const targetId = this.getAttribute("data-page");
        if (!targetId) return;

        const targetElement = document.getElementById(targetId);

        // SE EXISTE ELEMENTO E ELE SUBMENU TOGGLE
        if (targetElement && targetElement.classList.contains("sidebar-submenu-nested")) {

          const aberto = targetElement.style.display === "block";
          targetElement.style.display = aberto ? "none" : "block";

          const arrow = this.querySelector(".nav-arrow");
          if (arrow) arrow.classList.toggle("open", !aberto);

          return; // NÃO navega
        }

        // CASO CONTRÁRIO SÃO PÁGINA REAL
        showPage(targetId);

      });

    });

    /* =====================================================
       BOTÃES INTERNOS DOS SUBMENUS
       (EVENTOS, FORNECEDORES, RELATÓRIOS, ETC)
    ===================================================== */
    document.querySelectorAll(".sidebar-submenu-nested .nav-subbtn").forEach(botAção => {
      botAção.addEventListener("click", function (e) {
        e.stopPropagation();

        const page = this.getAttribute("data-page");
        if (page) {
          showPage(page);
        }
      });
    });
    
    // Toggle de menus (antigo - mantido para compatibilidade)
    document.querySelectorAll('[data-toggle]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const menuId = this.getAttribute('data-toggle');
            toggleMenu(menuId, this);
        });
    });
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Deseja realmente sair do sistema?')) {
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('userName');
                window.location.href = 'login.html';
            }
        });
    }
    
    // Botões do calendário
    const prevMonthBtn = document.querySelector('[onclick="previousMonth()"]');
    const nextMonthBtn = document.querySelector('[onclick="nextMonth()"]');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', previousMonth);
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', nextMonth);
    }
}

// Inicializar componentes básicos
function initializeBasicComponents() {
    // Iniciar relógio
    updateClock();
    setInterval(updateClock, 1000);
    
    // Atualizar informações do usuário
    updateUserInfo();
    
    // Carregar dados do dashboard
    loadDashboardData();
    
    // Configurar campos de evento
    configurarCamposEvento();
}

// Inicializar componentes por página
function initializePageComponents(pageId) {
    console.log(`Inicializando componentes da página: ${pageId}`);
    
    switch(pageId) {
        case 'dashboard':
            loadCalendarData();
            updateCalendar();
            break;
            
        case 'reservar_evento':
            setTimeout(() => {
                if (typeof configurarReservaEvento === 'function') {
                    configurarReservaEvento();
                }
                configurarCamposEvento();
            }, 300);
            break;
            
        case 'personagens':
            const fotoInput = document.getElementById('foto_personagem');
            if (fotoInput && typeof previewFotoPersonagem === 'function') {
                fotoInput.addEventListener('change', function() {
                    previewFotoPersonagem(this);
                });
            }
            break;
            
        case 'configuracoes':
            // Configurar busca em configurações
            const buscarInput = document.getElementById('buscarUsuarioConfiguracoes');
            if (buscarInput) {
                buscarInput.addEventListener('input', filtrarUsuariosConfiguracoes);
            }
            break;
            
        case 'gerenciar_permissoes':
            // Configurar o select de usuários
            atualizarSelectUsuariosPermissoes();
            break;
    }
}

// Configurar eventos de salvar para formulários
function configurarTodosBotoesSalvar() {
    const tipos = [
        'clientes', 'casa_de_festas', 'elenco', 'personagens',
        'motoristas', 'fornecedores', 'funcionarios', 'eventos',
        'manutencoes', 'checklist', 'escalas'
    ];
    
    tipos.forEach(tipo => {
        const btnSalvar = document.getElementById(`btnSalvar${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
        if (btnSalvar) {
            btnSalvar.onclick = function(e) {
                e.preventDefault();
                salvarDados(tipo);
            };
        }
        
        // Também configurar submit do formulário
        const form = document.getElementById(`form_${tipo}`);
        if (form) {
            form.onsubmit = function(e) {
                e.preventDefault();
                salvarDados(tipo);
            };
        }
    });
}

// Configurar evento de salvar usuário
function configurarEventoSalvarUsuario() {
    const btnSalvar = document.getElementById('btnSalvarUsuario');
    if (btnSalvar) {
        btnSalvar.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            salvarUsuario();
        };
    }
    
    // Alternativa: adicionar evento Ação formulário
    const formUsuario = document.getElementById('formUsuario');
    if (formUsuario && !btnSalvar) {
        formUsuario.onsubmit = function(e) {
            e.preventDefault();
            salvarUsuario();
        };
    }
}

// ==================== FUNÃÃES PARA DADOS ====================

// Função genérica para salvar dados
function salvarDados(tipo) {
    console.log(`📋¾ Salvando ${tipo}...`);
    
    // Obter ID do formulário
    const idField = document.getElementById(`ID_${tipo}`);
    let id = idField ? idField.value : gerarID(tipo);
    
    if (!id) {
        id = gerarID(tipo);
        if (idField) idField.value = id;
    }
    
    // Coletar dados dos campos
    const form = document.getElementById(`form_${tipo}`);
    if (!form) {
        console.error(`Formulário form_${tipo} não encontrado!`);
        return;
    }
    
    const campos = form.querySelectorAll('input, select, textarea');
    const dados = { id: id, dataCadastro: new Date().toISOString() };
    
    campos.forEach(campo => {
        if (campo.id && campo.id !== `ID_${tipo}`) {
            const chave = campo.id.replace(`_${tipo}`, '');
            dados[chave] = campo.value;
        }
    });
    
    // Salvar no localStorage
    const chaveStorage = `${tipo}_cadastrados`;
    let registros = JSON.parse(localStorage.getItem(chaveStorage) || '[]');
    
    // Verificar se é edição ou novo
    const index = registros.findIndex(r => r.id === id);
    let mensagem = '';
    
    if (index !== -1) {
        registros[index] = dados;
        mensagem = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} atualizado com sucesso!`;
    } else {
        registros.push(dados);
        mensagem = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} cadastrado com sucesso!`;
    }
    
    localStorage.setItem(chaveStorage, JSON.stringify(registros));
    
    // Atualizar lista
    if (typeof atualizarLista === 'function') {
        atualizarLista(tipo);
    }
    
    // Limpar formulário
    if (form) {
        form.reset();
        if (idField) idField.value = gerarID(tipo);
    }
    
    // Mostrar mensagem
    mostrarMensagemSucesso(mensagem);
    
    console.log(`${tipo} salvo:`, dados);
}

// Atualizar lista de registros
function atualizarLista(tipo) {
    const chaveStorage = `${tipo}_cadastrados`;
    const registros = JSON.parse(localStorage.getItem(chaveStorage) || '[]');
    const tabela = document.getElementById(`lista${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    
    if (!tabela) return;
    
    let html = '';
    
    registros.forEach(registro => {
        html += `<tr>`;
        
        // ID sempre na primeira coluna
        html += `<td>${registro.id}</td>`;
        
        // Nome ou equivalente na segunda coluna
        const nomeField = Object.keys(registro).find(k => k.includes('nome') || k.includes('razAção'));
        if (nomeField) {
            html += `<td><strong>${registro[nomeField] || ''}</strong></td>`;
        }
        
        // CPF/CNPJ se existir
        const docField = Object.keys(registro).find(k => k.includes('cpf') || k.includes('cnpj'));
        if (docField) {
            html += `<td>${formatarDocumento(registro[docField])}</td>`;
        }
        
        // Telefone se existir
        const telField = Object.keys(registro).find(k => k.includes('telefone') || k.includes('celular'));
        if (telField) {
            html += `<td>${formatarTelefone(registro[telField])}</td>`;
        }
        
        // Data de cadastro
        html += `<td>${formatarData(registro.dataCadastro)}</td>`;
        
        // Ações
        html += `
            <td>
                <button class="btn small" onclick="editarRegistro('${tipo}', '${registro.id}')">
                    Editar
                </button>
                <button class="btn small danger" onclick="excluirRegistro('${tipo}', '${registro.id}')">
                    📋ï¸ Excluir
                </button>
            </td>
        </tr>`;
    });
    
    tabela.innerHTML = html || `<tr><td colspan="6" style="text-align:center;">Nenhum registro cadastrado</td></tr>`;
}

// Editar registro
function editarRegistro(tipo, id) {
    const chaveStorage = `${tipo}_cadastrados`;
    const registros = JSON.parse(localStorage.getItem(chaveStorage) || '[]');
    const registro = registros.find(r => r.id === id);
    
    if (!registro) {
        alert('Registro não encontrado!');
        return;
    }
    
    // Preencher formulário
    const form = document.getElementById(`form_${tipo}`);
    if (!form) return;
    
    Object.keys(registro).forEach(chave => {
        const campo = document.getElementById(`${chave}_${tipo}`);
        if (campo) {
            campo.value = registro[chave] || '';
        }
    });
    
    // Mostrar página correspondente
    showPage(tipo === 'casa_de_festas' ? 'casa_de_festas' : tipo);
    
    // Rolar até o formulário
    form.scrollIntoView({ behavior: 'smooth' });
}

// Excluir registro
function excluirRegistro(tipo, id) {
    if (!confirm(`Tem certeza que deseja excluir este ${tipo}?`)) {
        return;
    }
    
    const chaveStorage = `${tipo}_cadastrados`;
    let registros = JSON.parse(localStorage.getItem(chaveStorage) || '[]');
    
    registros = registros.filter(r => r.id !== id);
    localStorage.setItem(chaveStorage, JSON.stringify(registros));
    
    atualizarLista(tipo);
    mostrarMensagemSucesso(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} excluído com sucesso!`);
}

// ==================== FUNÃÃES PARA EVENTOS ====================

// Configurar campos de evento (hora de saída)
function configurarCamposEvento() {
    const horaEvento = document.getElementById('hora_evento');
    const duracAção = document.getElementById('duracAção');
    const horaSaida = document.getElementById('hora_saida');
    
    if (horaEvento && duracAção && horaSaida) {
        const calcular = function() {
            if (horaEvento.value && duracAção.value) {
                const [horas, minutos] = horaEvento.value.split(':').map(Number);
                const duracAçãoNum = parseInt(duracAção.value);
                const dataEvento = new Date();
                dataEvento.setHours(horas, minutos, 0, 0);
                dataEvento.setHours(dataEvento.getHours() + duracAçãoNum);
                horaSaida.value = 
                    `${String(dataEvento.getHours()).padStart(2, '0')}:${String(dataEvento.getMinutes()).padStart(2, '0')}`;
            }
        };
        
        horaEvento.addEventListener('change', calcular);
        duracAção.addEventListener('input', calcular);
    }
}

// ==================== FUNÃÃES DE FILTRO ====================

// Filtrar usuários
function filtrarUsuarios() {
    const busca = document.getElementById('buscarUsuario').value.toLowerCase();
    const usuarios = JSON.parse(localStorage.getItem('usuarios_sistema') || '[]');
    const tabela = document.getElementById('listaUsuarios');
    
    if (!tabela) return;
    
    let html = '';
    
    usuarios.filter(usuario => 
        usuario.nome.toLowerCase().includes(busca) || 
        usuario.login.toLowerCase().includes(busca) ||
        usuario.cpf.includes(busca)
    ).forEach(usuario => {
        const statusClass = usuario.status === 'ativo' ? 'status-ativo' : 'status-inativo';
        const statusText = usuario.status === 'ativo' ? 'Ativo' : 'Inativo';
        
        html += `
            <tr>
                <td>${usuario.id}</td>
                <td><strong>${usuario.nome}</strong></td>
                <td>${usuario.login}</td>
                <td>${usuario.cargo || 'Não definido'}</td>
                <td>
                    <span class="${statusClass}">${statusText}</span>
                </td>
                <td>
                    <button class="btn small" onclick="editarUsuario('${usuario.id}')">
                        Editar
                    </button>
                    <button class="btn small ${usuario.status === 'ativo' ? 'danger' : 'success'}" 
                            onclick="toggleStatusUsuario('${usuario.id}')">
                        ${usuario.status === 'ativo' ? 'Desativar' : 'Ativar'}
                    </button>
                    <button class="btn small info" onclick="gerenciarPermissoes('${usuario.id}')">
                        Permissões
                    </button>
                </td>
            </tr>
        `;
    });
    
    tabela.innerHTML = html || '<tr><td colspan="6" style="text-align:center;">Nenhum usuário encontrado</td></tr>';
}

// Filtrar usuários em configurações
function filtrarUsuariosConfiguracoes() {
    const busca = document.getElementById('buscarUsuarioConfiguracoes').value.toLowerCase();
    const usuarios = JSON.parse(localStorage.getItem('usuarios_sistema') || '[]');
    const tabela = document.getElementById('listaUsuariosConfiguracoes');
    
    if (!tabela) return;
    
    let html = '';
    
    usuarios.filter(usuario => 
        usuario.nome.toLowerCase().includes(busca) || 
        usuario.login.toLowerCase().includes(busca) ||
        usuario.cpf.includes(busca)
    ).forEach(usuario => {
        const statusClass = usuario.status === 'ativo' ?'status-ativo' : 'status-inativo';
        const statusText = usuario.status === 'ativo' ? 'Ativo' : 'Inativo';
        const permissoesCount = usuario.permissoes ? usuario.permissoes.length : 0;
        
        html += `
            <tr>
                <td>${usuario.id}</td>
                <td><strong>${usuario.nome}</strong></td>
                <td>${usuario.login}</td>
                <td>${usuario.cargo || 'Não definido'}</td>
                <td>
                    <span class="${statusClass}">${statusText}</span>
                </td>
                <td>${permissoesCount} permissões</td>
                <td>
                    <button class="btn small info" onclick="gerenciarPermissoes('${usuario.id}')">
                        📋 Gerenciar
                    </button>
                    <button class="btn small ${usuario.status === 'ativo' ? 'danger' : 'success'}" 
                            onclick="toggleStatusUsuario('${usuario.id}')">
                        ${usuario.status === 'ativo' ? ' Desativar' : 'Ativar'}
                    </button>
                </td>
            </tr>
        `;
    });
    
    tabela.innerHTML = html || '<tr><td colspan="7" style="text-align:center;">Nenhum usuário encontrado</td></tr>';
}

// ==================== INICIALIZAÃÃO PRINCIPAL ====================

// Corrigir estrutura inicial
function corrigirEstruturaInicial() {
    // Ocultar todas as páginas
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    
    // Mostrar dashboard por padrão
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        dashboard.classList.add('active');
        dashboard.style.display = 'block';
    }
    
    // Marcar botão do painel como ativo
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const dashboardBtn = document.querySelector('[data-page="dashboard"]');
    if (dashboardBtn) {
        dashboardBtn.classList.add('active');
    }
    
    // Ajustar layout principal
    const main = document.getElementById('main');
    if (main) {
        main.style.marginLeft = '260px';
        main.style.marginTop = '0';
        main.style.paddingTop = '0';
        main.style.minHeight = 'calc(100vh - var(--topbar-height))';
    }
}

// INICIALIZAÃÃO PRINCIPAL ÃNICA
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 DOM carregado - Iniciando sistema...');
    
    // Verificar login
    if (!localStorage.getItem('loggedIn')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Corrigir estrutura inicial
    corrigirEstruturaInicial();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Inicializar sistema
    inicializarSistema();
    
    // Inicializar componentes básicos
    initializeBasicComponents();
    
    // SEMPRE mostrar dashboard como página inicial
    setTimeout(() => {
        showPage('dashboard');
        // Marcar botão do painel como ativo
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        const dashboardBtn = document.querySelector('[data-page="dashboard"]');
        if (dashboardBtn) dashboardBtn.classList.add('active');
    }, 100);
    
    console.log('Sistema carregado com sucesso');
});

// ==================== EXPORTAÃÃES GLOBAIS ====================

// Exportar funções para o escopo global
window.showPage = showPage;
window.previousMonth = previousMonth;
window.nextMonth = nextMonth;
window.toggleMenu = toggleMenu;
window.salvarUsuario = salvarUsuario;
window.salvarDados = salvarDados;
window.editarUsuario = editarUsuario;
window.toggleStatusUsuario = toggleStatusUsuario;
window.gerenciarPermissoes = gerenciarPermissoes;
window.salvarPermissoes = salvarPermissoes;
window.editarRegistro = editarRegistro;
window.excluirRegistro = excluirRegistro;
window.filtrarUsuarios = filtrarUsuarios;
window.filtrarUsuariosConfiguracoes = filtrarUsuariosConfiguracoes;
window.configurarCamposEvento = configurarCamposEvento;

// Exportar funções de fluxo de caixa
window.filtrarFluxoCaixa = filtrarFluxoCaixa;
window.resetarFiltrosFluxo = resetarFiltrosFluxo;
window.exportarFluxoCaixa = exportarFluxoCaixa;
window.imprimirFluxoCaixa = imprimirFluxoCaixa;

// Exportar funções de orçamentos
window.novoOrcamento = novoOrcamento;
window.filtrarOrcamentos = filtrarOrcamentos;
window.resetarFiltrosOrcamentos = resetarFiltrosOrcamentos;
window.exportarOrcamentos = exportarOrcamentos;

// Exportar funções de disponibilidade
window.filtrarDisponibilidade = filtrarDisponibilidade;
window.limparFiltrosDisponibilidade = limparFiltrosDisponibilidade;
window.verificarDisponibilidadeGeral = verificarDisponibilidadeGeral;

// Exportar funções de manutenção
window.salvarRegistroManutencAção = salvarRegistroManutencAção;
window.limparFormularioManutencAção = limparFormularioManutencAção;
window.filtrarManutencoes = filtrarManutencoes;
window.resetarFiltrosManutencAção = resetarFiltrosManutencAção;
window.exportarManutencoes = exportarManutencoes;

// Exportar funções de relatórios
window.filtrarEventosRealizados = filtrarEventosRealizados;
window.filtrarEventosCancelados = filtrarEventosCancelados;
window.filtrarEventosFinalizados = filtrarEventosFinalizados;
window.exportarRelatorioRealizados = exportarRelatorioRealizados;
window.exportarRelatorioCancelados = exportarRelatorioCancelados;
window.exportarRelatorioFinalizados = exportarRelatorioFinalizados;

// Exportar funções de contas a pagar
window.filtrarContasPagarElenco = filtrarContasPagarElenco;
window.filtrarContasPagarMotoristas = filtrarContasPagarMotoristas;
window.filtrarContasPagarFornecedores = filtrarContasPagarFornecedores;
window.exportarContasPagarElenco = exportarContasPagarElenco;
window.exportarContasPagarMotoristas = exportarContasPagarMotoristas;
window.exportarContasPagarFornecedores = exportarContasPagarFornecedores;

// Exportar funções de contas a receber
window.filtrarContasReceber = filtrarContasReceber;
window.resetarFiltrosReceber = resetarFiltrosReceber;
window.exportarContasReceber = exportarContasReceber;
window.imprimirContasReceber = imprimirContasReceber;

// ==================== FUNÃÃES ADICIONAIS DO ARQUIVO ORIGINAL ====================

// As funções abaixo foram mantidas do arquivo original
// para compatibilidade, mas algumas podem estar duplicadas

function selecionarTipoFormulario(tipo, entidade) {
    // Altera o botão ativo
    document.querySelectorAll(`#btnCPF_${entidade}, #btnCNPJ_${entidade}`).forEach(btn => {
        if (btn) btn.classList.remove('active');
    });
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
    // Altera placeholder e maxlength do campo de documento
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
    // Altera rótulos dos campos
    const labelNome = document.getElementById(`labelNome_${entidade}`);
    const labelData = document.getElementById(`labelData_${entidade}`);
    const labelIdade = document.getElementById(`labelIdade_${entidade}`);
    if (labelNome) labelNome.textContent = tipo === 'cpf' ? 'Nome Completo *' : 'Nome da Empresa *';
    if (labelData) labelData.textContent = tipo === 'cpf' ? 'Data de Nascimento' : 'Data da Abertura';
    if (labelIdade) labelIdade.textContent = tipo === 'cpf' ? 'Idade' : 'Tempo de Empresa (anos)';
}

function buscarCEP(cep, entidade) {
    cep = cep.replace(/\D/g, '');
    if (cep.length !== 8) return;
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
            if (!data.erro) {
                document.getElementById(`logradouro_${entidade}`).value = data.logradouro || '';
                document.getElementById(`bairro_${entidade}`).value = data.bairro || '';
                document.getElementById(`cidade_${entidade}`).value = data.localidade || '';
                document.getElementById(`estado_${entidade}`).value = data.uf || '';
            }
        });
}

function formatarCEP(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = valor.substring(0, 8);
    if (valor.length > 5) {
        valor = valor.substring(0, 5) + '-' + valor.substring(5);
    }
    input.value = valor;
}
function updateActiveMenu(pageId) {
    // Remove classe active de todos os botões
    document.querySelectorAll('.nav-btn, .nav-subbtn, .nav-subbtn-nested').forEach(btn => {
        btn.classList.remove('active');
        
    });
    
    // Adiciona classe active Ação botão correspondente
    const activeBtn = document.querySelector(`[data-page="${pageId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        
        // Garante que os menus pais também estejam abertos
        let parentMenu = activeBtn.closest('.sidebar-submenu');
        if (parentMenu) {
            parentMenu.style.display = 'block';
            const parentBtn = document.querySelector(`[data-toggle="${parentMenu.id}"]`);
            if (parentBtn) {
                parentBtn.classList.add('active');
                parentBtn.querySelector('.nav-arrow')?.classList.add('open');
            }
        }
        
        // Para submenus aninhados
        let nestedParent = activeBtn.closest('.sidebar-submenu-nested');
        if (nestedParent) {
            nestedParent.style.display = 'block';
            const nestedBtn = document.querySelector(`[data-page="${nestedParent.id}"]`);
            if (nestedBtn) {
                nestedBtn.classList.add('active');
                nestedBtn.querySelector('.nav-arrow')?.classList.add('open');
            }
        }
    }
}
// Funções de carregamento de relatório foram movidas para relatorios.js
console.log('Script index.js carregado com sucesso');

function printPageCard(pageId) {
    const page = document.getElementById(pageId);
    if (!page) return alert('Página não encontrada: ' + pageId);
    const card = page.querySelector('.card') || page;
    const w = window.open('', '_blank');
    w.document.write('<html><head><title>Imprimir Relatório</title>');
    w.document.write('<link rel="stylesheet" href="sistema.css">');
    w.document.write('</head><body>');
    w.document.write(card.innerHTML);
    w.document.write('</body></html>');
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 500);
}

// Wrappers específicos chamados pelo HTML
window.exportarReceitas = function() { exportFirstTableOnPage('relatorio_receitas', 'receitas.csv'); };
window.exportarDespesas = function() { exportFirstTableOnPage('relatorio_despesas', 'despesas.csv'); };
window.exportarLucros = function() { exportFirstTableOnPage('relatorio_lucros', 'lucros.csv'); };
window.exportarRelatorioChecklist = function() { exportFirstTableOnPage('relatorio_checklist', 'checklist.csv'); };
window.exportarRelatorioFinanceiro = function() { exportFirstTableOnPage('relatorio_financeiro', 'financeiro.csv'); };

window.exportarRelatorioElenco = function() { exportFirstTableOnPage('relatorio_equipe', 'elenco.csv'); };
window.exportarRelatorioEquipe = function(tipo) {
    // Mapear tipos para ids de tabela
    const map = {
        'elenco': 'tabelaElenco',
        'producAção': 'tabelaProducAção',
        'motoristas': 'tabelaMotoristas',
        'funcionarios': 'tabelaFuncionarios',
        'fornecedores': 'tabelaFornecedores'
    };
    const tableId = map[tipo];
    if (!tableId) return alert('Tipo inválido: ' + tipo);
    const table = document.getElementById(tableId);
    if (!table) return alert('Tabela não encontrada para: ' + tipo);
    const csv = tableToCSV(table);
    downloadCSV(csv, `equipe_${tipo}.csv`);
};

window.imprimirRelatorioDespesas = function() { printPageCard('relatorio_despesas'); };
window.imprimirRelatorioLucros = function() { printPageCard('relatorio_lucros'); };
window.imprimirRelatorioChecklist = function() { printPageCard('relatorio_checklist'); };
window.imprimirRelatorioEquipe = function(tipo) { printPageCard('relatorio_equipe'); };

// Funï¿½ï¿½o para formatar CPF ou CNPJ automaticamente
function formatarDocumentoCliente(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        // Formata como CPF
        if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        } else if (value.length > 3) {
            value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        }
    } else {
        // Formata como CNPJ
        if (value.length > 12) {
            value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        } else if (value.length > 8) {
            value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, '$1.$2.$3/$4');
        } else if (value.length > 5) {
            value = value.replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2.$3');
        }
    }
    
    input.value = value;
}
console.log('? Script index.js carregado com sucesso (Relatï¿½rios foram movidos para relatorio.js');

// Funï¿½ï¿½o para carregar notificaï¿½ï¿½es dos eventos de amanhï¿½
function carregarNotificacoesEventosAmanha() {
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);
  
  // Formatar data para YYYY-MM-DD
  const dataAmanha = amanha.toISOString().split('T')[0];
  
  // Buscar eventos do dia seguinte
  fetch(`/api/eventos?data=${dataAmanha}`)
    .then(response => response.json())
    .then(eventos => {
      const container = document.getElementById('listaNotificacoesAmanha');
      const cardNotificacAção = document.getElementById('notificacAçãoEventosAmanha');
      
      if (!eventos || eventos.length === 0) {
        cardNotificacAção.style.display = 'none';
        return;
      }
      
      // Mostrar o card de notificaï¿½ï¿½o
      cardNotificacAção.style.display = 'block';
      
      // Limpar container
      container.innerHTML = '';
      
      // Adicionar cada evento como notificaï¿½ï¿½o
      eventos.forEach(evento => {
        const notificacAção = criarNotificacAçãoEvento(evento);
        container.appendChild(notificacAção);
      });
    })
    .catch(error => {
      console.error('Erro Ação carregar notificaï¿½ï¿½es:', error);
      document.getElementById('notificacAçãoEventosAmanha').style.display = 'none';
    });
}

// Funï¿½ï¿½o para criar uma notificaï¿½ï¿½o individual
function criarNotificacAçãoEvento(evento) {
  const div = document.createElement('div');
  div.className = 'notificacAção-evento';
  
  // Adicionar classe de urgï¿½ncia se o evento for pela manhï¿½
  const horaEvento = evento.hora ? parseInt(evento.hora.split(':')[0]) : 12;
  if (horaEvento < 12) {
    div.classList.add('notificacAção-urgente');
  }
  
  div.innerHTML = `
    <div class="notificacAção-header">
      <div class="notificacAção-titulo">${evento.nome || 'Evento'}</div>
      <div class="notificacAção-horario">${evento.hora || '--:--'}</div>
    </div>
    
    <div class="notificacAção-detalhes">
      <div class="notificacAção-cliente">
        <strong>?? Cliente:</strong> ${evento.cliente_nome || 'Nï¿½o informado'}
        ${evento.cliente_telefone ? `<br><small>?? ${evento.cliente_telefone}</small>` : ''}
      </div>
      <div class="notificacAção-personagens">
        <strong>?? Personagens:</strong> ${evento.personagens?.join(', ') || 'Nï¿½o definido'}
      </div>
      <div class="notificacAção-local">
        <strong>?? Local:</strong> ${evento.local || 'Nï¿½o informado'}
      </div>
    </div>
    
    <div class="notificacAção-acoes">
      <button class="btn" onclick="verDetalhesEvento('${evento.id}')" style="padding: 4px 8px; font-size: 12px;">
        ??? Ver detalhes
      </button>
      <button class="btn" onclick="marcarComoPreparado('${evento.id}')" style="padding: 4px 8px; font-size: 12px; background: #4caf50; color: white;">
        ? Preparado
      </button>
      ${evento.cliente_telefone ? `
        <button class="btn" onclick="enviarLembreteCliente('${evento.id}')" style="padding: 4px 8px; font-size: 12px; background: #2196f3; color: white;">
          ?? Lembrar cliente
        </button>
      ` : ''}
    </div>
  `;
  
  return div;
}

// Funï¿½ï¿½o para marcar notificaï¿½ï¿½es como vistas
function marcarNotificacoesComoVistas() {
  document.getElementById('notificacAçãoEventosAmanha').style.display = 'none';
  localStorage.setItem('notificacoesVistas', new Date().toISOString());
  
  // Opcional: Enviar para o servidor
  fetch('/api/notificacoes/vistas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: new Date().toISOString() })
  });
}

// Funï¿½ï¿½es auxiliares
function verDetalhesEvento(eventoId) {
  showPage('todos_eventos');
  // Aqui vocï¿½ pode implementar a lï¿½gica para focar no evento especï¿½fico
  console.log('Ver detalhes do evento:', eventoId);
}

function marcarComoPreparado(eventoId) {
  // Implementar lï¿½gica para marcar evento como preparado
  alert(`Evento ${eventoId} marcado como preparado!`);
}

function enviarLembreteCliente(eventoId) {
  // Implementar lï¿½gica para enviar lembrete por WhatsApp/SMS
  alert(`Lembrete enviado para cliente do evento ${eventoId}`);
}

// Carregar notificaï¿½ï¿½es quando a pï¿½gina carregar
document.addEventListener('DOMContentLoaded', function() {
  // Verificar se jï¿½ viu as notificaï¿½ï¿½es hoje
  const ultimaVisualizacAção = localStorage.getItem('notificacoesVistas');
  const hoje = new Date().toISOString().split('T')[0];
  
  if (!ultimaVisualizacAção || ultimaVisualizacAção.split('T')[0] !== hoje) {
    carregarNotificacoesEventosAmanha();
  }
  
  // Carregar notificaï¿½ï¿½es a cada hora
  setInterval(carregarNotificacoesEventosAmanha, 60 * 60 * 1000);
});

// Adicionar Ação carregamento do Dashboard
function carregarDashboard() {
  carregarNotificacoesEventosAmanha();
  // ... outras funï¿½ï¿½es do dashboard
}
