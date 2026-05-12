// Verificar disponibilidade do elenco e motoristas
function verificarDisponibilidadeEquipe() {
    const disponibilidades = JSON.parse(localStorage.getItem('disponibilidades_elenco') || '[]');
    const elenco = JSON.parse(localStorage.getItem('elenco_cadastrados') || '[]');
    const motoristas = JSON.parse(localStorage.getItem('motoristas_cadastrados') || '[]');
    
    // Agrupar por data
    const porData = {};
    
    disponibilidades.forEach(disp => {
        if (!porData[disp.data]) {
            porData[disp.data] = {
                disponiveis: [],
                indisponiveis: []
            };
        }
        
        const pessoa = elenco.find(e => (e.doc_elenco_cadastro || '').replace(/\D/g, '') === disp.cpf) ||
                      motoristas.find(m => (m.doc_motoristas_cadastro || '').replace(/\D/g, '') === disp.cpf);
        
        const nome = pessoa ? (pessoa.nome_elenco || pessoa.nome_motoristas) : disp.nome;
        const tipo = pessoa && pessoa.nome_elenco ? 'Elenco' : 'Motorista';
        
        if (disp.status === 'disponivel') {
            porData[disp.data].disponiveis.push({ nome, tipo, obs: disp.observacao });
        } else {
            porData[disp.data].indisponiveis.push({ nome, tipo, obs: disp.observacao });
        }
    });
    
    return porData;
}

// Mostrar calendário de disponibilidade
function mostrarDisponibilidadeElenco() {
    const disponibilidades = verificarDisponibilidadeEquipe();
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    
    let html = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;" id="modalDisponibilidade" onclick="if(event.target.id==='modalDisponibilidade') fecharModalDisponibilidade()">
            <div style="background: white; padding: 2rem; border-radius: 8px; max-width: 1200px; width: 95%; max-height: 90vh; overflow-y: auto;" onclick="event.stopPropagation()">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0;">📅 Calendário de Disponibilidade da Equipe</h3>
                    <button class="btn danger" onclick="fecharModalDisponibilidade()">✖</button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
    `;
    
    // Gerar próximos 60 dias
    for (let i = 0; i < 60; i++) {
        const data = new Date(hoje);
        data.setDate(data.getDate() + i);
        const dataStr = data.toISOString().split('T')[0];
        const dataFormatada = data.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
        
        const disp = disponibilidades[dataStr];
        const totalDisp = disp ? disp.disponiveis.length : 0;
        const totalIndisp = disp ? disp.indisponiveis.length : 0;
        
        let corCard = '#f8f9fa';
        let icone = '⚪';
        
        if (totalDisp > 0 && totalIndisp === 0) {
            corCard = '#d4edda';
            icone = '✅';
        } else if (totalIndisp > 0 && totalDisp === 0) {
            corCard = '#f8d7da';
            icone = '❌';
        } else if (totalDisp > 0 && totalIndisp > 0) {
            corCard = '#fff3cd';
            icone = '⚠️';
        }
        
        html += `
            <div style="background: ${corCard}; padding: 1rem; border-radius: 8px; border: 1px solid #dee2e6; cursor: pointer;" onclick="mostrarDetalhesData('${dataStr}')">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <strong>${dataFormatada}</strong>
                    <span style="font-size: 1.5rem;">${icone}</span>
                </div>
                <div style="font-size: 14px;">
                    ${totalDisp > 0 ? `<div style="color: #28a745;">✅ ${totalDisp} disponível(is)</div>` : ''}
                    ${totalIndisp > 0 ? `<div style="color: #dc3545;">❌ ${totalIndisp} indisponível(is)</div>` : ''}
                    ${totalDisp === 0 && totalIndisp === 0 ? '<div style="color: #6c757d;">Nenhuma informação</div>' : ''}
                </div>
            </div>
        `;
    }
    
    html += `
                </div>
                
                <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                    <h4>Legenda:</h4>
                    <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="font-size: 1.5rem;">✅</span>
                            <span>Todos disponíveis</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="font-size: 1.5rem;">❌</span>
                            <span>Todos indisponíveis</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="font-size: 1.5rem;">⚠️</span>
                            <span>Disponibilidade mista</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="font-size: 1.5rem;">⚪</span>
                            <span>Sem informação</span>
                        </div>
                    </div>
                    <p style="margin-top: 1rem; color: #666; font-size: 14px;">Clique em um dia para ver detalhes da equipe</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
}

// Mostrar detalhes de uma data específica
function mostrarDetalhesData(dataStr) {
    const disponibilidades = JSON.parse(localStorage.getItem('disponibilidades_elenco') || '[]');
    const elenco = JSON.parse(localStorage.getItem('elenco_cadastrados') || '[]');
    const motoristas = JSON.parse(localStorage.getItem('motoristas_cadastrados') || '[]');
    
    const dataFormatada = new Date(dataStr + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    
    const dispData = disponibilidades.filter(d => d.data === dataStr);
    
    let html = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center;" id="modalDetalhesData" onclick="if(event.target.id==='modalDetalhesData') fecharDetalhesData()">
            <div style="background: white; padding: 2rem; border-radius: 8px; max-width: 800px; width: 90%; max-height: 80vh; overflow-y: auto;" onclick="event.stopPropagation()">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="margin: 0; text-transform: capitalize;">📅 ${dataFormatada}</h3>
                    <button class="btn danger" onclick="fecharDetalhesData()">✖</button>
                </div>
                
                <table class="tabela-relatorio" style="width: 100%;">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Tipo</th>
                            <th>Horário Início</th>
                            <th>Horário Fim</th>
                            <th>Status</th>
                            <th>Observação</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    if (dispData.length === 0) {
        html += '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #6c757d;">Nenhum membro informou disponibilidade para esta data</td></tr>';
    } else {
        dispData.forEach(disp => {
            const pessoa = elenco.find(e => (e.doc_elenco_cadastro || '').replace(/\D/g, '') === disp.cpf) ||
                          motoristas.find(m => (m.doc_motoristas_cadastro || '').replace(/\D/g, '') === disp.cpf);
            
            const nome = pessoa ? (pessoa.nome_elenco || pessoa.nome_motoristas) : disp.nome;
            const tipo = pessoa && pessoa.nome_elenco ? '🎭 Elenco' : '🚗 Motorista';
            const statusTexto = disp.status === 'disponivel' ? '✅ Disponível' : '❌ Indisponível';
            const cor = disp.status === 'disponivel' ? '#28a745' : '#dc3545';
            const horaInicio = disp.hora_inicio || '-';
            const horaFim = disp.hora_fim || '-';
            
            html += `
                <tr>
                    <td>${nome}</td>
                    <td>${tipo}</td>
                    <td>${horaInicio}</td>
                    <td>${horaFim}</td>
                    <td><span style="background: ${cor}; color: white; padding: 4px 8px; border-radius: 4px;">${statusTexto}</span></td>
                    <td>${disp.observacao || '-'}</td>
                </tr>
            `;
        });
    }
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
}

// Fechar detalhes da data
function fecharDetalhesData() {
    const modal = document.getElementById('modalDetalhesData');
    if (modal) modal.remove();
}

// Fechar modal
function fecharModalDisponibilidade() {
    const modal = document.getElementById('modalDisponibilidade');
    if (modal) modal.remove();
}

// Exportar funções
window.verificarDisponibilidadeEquipe = verificarDisponibilidadeEquipe;
window.mostrarDisponibilidadeElenco = mostrarDisponibilidadeElenco;
window.mostrarDetalhesData = mostrarDetalhesData;
window.fecharDetalhesData = fecharDetalhesData;
window.fecharModalDisponibilidade = fecharModalDisponibilidade;
