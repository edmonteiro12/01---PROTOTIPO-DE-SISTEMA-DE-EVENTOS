// ==================== SISTEMA FINANCEIRO COMPLETO ====================

// ==================== CONTAS A RECEBER ====================
function carregarContasReceber() {
    const eventos = JSON.parse(localStorage.getItem('eventos_cadastrados') || '[]');
    const tbody = document.getElementById('tabelaContasReceber');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let totalReceber = 0;
    let totalRecebido = 0;
    
    eventos.forEach(evento => {
        const valorTotal = parseFloat((evento.valor_total || '0').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        const valorFalta = parseFloat((evento.valor_falta_receber || '0').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        const valorRecebido = valorTotal - valorFalta;
        
        if (valorFalta > 0) {
            totalReceber += valorFalta;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${evento.nome_cliente_evento || '-'}</td>
                <td>${evento.data_evento || '-'}</td>
                <td>R$ ${valorFalta.toFixed(2).replace('.', ',')}</td>
                <td><span class="badge badge-pendente">Pendente</span></td>
                <td><button class="btn btn-sm" onclick="registrarRecebimento('${evento.id || evento.data_evento}')">Receber</button></td>
            `;
            tbody.appendChild(tr);
        }
        
        if (valorRecebido > 0) {
            totalRecebido += valorRecebido;
        }
    });
    
    if (tbody.children.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;">Nenhuma conta a receber</td></tr>';
    }
    
    const totalReceberEl = document.getElementById('totalContasReceber');
    const totalRecebidoEl = document.getElementById('totalRecebido');
    if (totalReceberEl) totalReceberEl.textContent = `R$ ${totalReceber.toFixed(2).replace('.', ',')}`;
    if (totalRecebidoEl) totalRecebidoEl.textContent = `R$ ${totalRecebido.toFixed(2).replace('.', ',')}`;
}

function registrarRecebimento(eventoId) {
    const eventos = JSON.parse(localStorage.getItem('eventos_cadastrados') || '[]');
    const index = eventos.findIndex(e => (e.id || e.data_evento) === eventoId);
    
    if (index !== -1) {
        eventos[index].valor_falta_receber = 'R$ 0,00';
        eventos[index].status_pagamento = 'Pago';
        localStorage.setItem('eventos_cadastrados', JSON.stringify(eventos));
        alert('Recebimento registrado com sucesso!');
        carregarContasReceber();
    }
}

// ==================== CONTAS A PAGAR ====================
function carregarContasPagar() {
    const contas = JSON.parse(localStorage.getItem('contas_pagar') || '[]');
    const tbody = document.getElementById('tabelaContasPagar');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let totalPagar = 0;
    let totalPago = 0;
    
    contas.forEach((conta, index) => {
        const valor = parseFloat(conta.valor || 0);
        
        if (conta.status === 'pendente') {
            totalPagar += valor;
        } else {
            totalPago += valor;
        }
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${conta.descricao || '-'}</td>
            <td>${conta.categoria || '-'}</td>
            <td>${conta.vencimento || '-'}</td>
            <td>R$ ${valor.toFixed(2).replace('.', ',')}</td>
            <td><span class="badge badge-${conta.status}">${conta.status === 'pago' ? 'Pago' : 'Pendente'}</span></td>
            <td>
                ${conta.status === 'pendente' ? 
                    `<button class="btn btn-sm" onclick="registrarPagamento(${index})">Pagar</button>` : 
                    `<button class="btn btn-sm" onclick="excluirConta(${index})">Excluir</button>`
                }
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    if (tbody.children.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;">Nenhuma conta cadastrada</td></tr>';
    }
    
    const totalPagarEl = document.getElementById('totalContasPagar');
    const totalPagoEl = document.getElementById('totalPago');
    if (totalPagarEl) totalPagarEl.textContent = `R$ ${totalPagar.toFixed(2).replace('.', ',')}`;
    if (totalPagoEl) totalPagoEl.textContent = `R$ ${totalPago.toFixed(2).replace('.', ',')}`;
}

function adicionarContaPagar() {
    const descricao = document.getElementById('descricao_conta')?.value;
    const categoria = document.getElementById('categoria_conta')?.value;
    const vencimento = document.getElementById('vencimento_conta')?.value;
    const valorStr = document.getElementById('valor_conta')?.value || '0';
    const valor = parseFloat(valorStr.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    
    if (!descricao || !categoria || !vencimento || valor <= 0) {
        alert('Preencha todos os campos!');
        return;
    }
    
    const contas = JSON.parse(localStorage.getItem('contas_pagar') || '[]');
    contas.push({
        descricao,
        categoria,
        vencimento,
        valor,
        status: 'pendente',
        dataCadastro: new Date().toISOString()
    });
    
    localStorage.setItem('contas_pagar', JSON.stringify(contas));
    
    document.getElementById('descricao_conta').value = '';
    document.getElementById('categoria_conta').value = '';
    document.getElementById('vencimento_conta').value = '';
    document.getElementById('valor_conta').value = '';
    
    alert('Conta cadastrada com sucesso!');
    carregarContasPagar();
}

function registrarPagamento(index) {
    const contas = JSON.parse(localStorage.getItem('contas_pagar') || '[]');
    
    if (contas[index]) {
        contas[index].status = 'pago';
        contas[index].dataPagamento = new Date().toISOString();
        localStorage.setItem('contas_pagar', JSON.stringify(contas));
        alert('Pagamento registrado!');
        carregarContasPagar();
    }
}

function excluirConta(index) {
    if (!confirm('Deseja excluir esta conta?')) return;
    
    const contas = JSON.parse(localStorage.getItem('contas_pagar') || '[]');
    contas.splice(index, 1);
    localStorage.setItem('contas_pagar', JSON.stringify(contas));
    carregarContasPagar();
}

// ==================== FLUXO DE CAIXA COMPLETO ====================
function carregarFluxoCaixa() {
    const eventos = JSON.parse(localStorage.getItem('eventos_cadastrados') || '[]');
    const contas = JSON.parse(localStorage.getItem('contas_pagar') || '[]');
    const tbody = document.getElementById('tabelaFluxoCaixa');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    let saldo = 0;
    let totalRecebidos = 0;
    let totalReceber = 0;
    let totalGastos = 0;
    let totalPagar = 0;
    
    const movimentacoes = [];
    
    // ========== ENTRADAS - PAGAMENTOS RECEBIDOS ==========
    eventos.forEach(evento => {
        const valorTotal = parseFloat((evento.valor_total || '0').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        const valorFalta = parseFloat((evento.valor_falta_receber || '0').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        const valorRecebido = valorTotal - valorFalta;
        
        // Valores já recebidos
        if (valorRecebido > 0) {
            totalRecebidos += valorRecebido;
            movimentacoes.push({
                data: evento.data_evento,
                descricao: `Evento - ${evento.nome_cliente_evento || 'Cliente'}`,
                tipo: 'Recebido',
                categoria: 'Receita de Eventos',
                origem: `🎉 Cliente: ${evento.nome_cliente_evento || '-'} | Local: ${evento.nome_local || '-'} | Personagens: ${evento.personagens_selecionados?.length || 0}`,
                valor: valorRecebido,
                entrada: valorRecebido,
                saida: 0,
                status: 'Recebido',
                statusColor: '#28a745'
            });
        }
        
        // Valores a receber (FALTA RECEBER)
        if (valorFalta > 0) {
            totalReceber += valorFalta;
            movimentacoes.push({
                data: evento.data_evento,
                descricao: `⏳ A Receber - ${evento.nome_cliente_evento || 'Cliente'}`,
                tipo: 'A Receber',
                categoria: 'Receita Pendente',
                origem: `💰 Cliente: ${evento.nome_cliente_evento || '-'} | Valor Pendente: R$ ${valorFalta.toFixed(2).replace('.', ',')} | Evento: ${evento.data_evento || '-'}`,
                valor: valorFalta,
                entrada: 0,
                saida: 0,
                status: 'Pendente',
                statusColor: '#ffc107'
            });
        }
    });
    
    // ========== SAÍDAS - GASTOS E CONTAS A PAGAR ==========
    contas.forEach(conta => {
        const valor = parseFloat(conta.valor || 0);
        
        // Gastos já pagos
        if (conta.status === 'pago') {
            totalGastos += valor;
            movimentacoes.push({
                data: conta.dataPagamento || conta.vencimento,
                descricao: `📤 ${conta.descricao}`,
                tipo: 'Pago',
                categoria: conta.categoria || 'Despesas',
                origem: `💳 Categoria: ${conta.categoria || 'Despesas'} | Forma: ${conta.formaPagamento || 'Não informado'} | Pago em: ${conta.dataPagamento || '-'}`,
                valor: valor,
                entrada: 0,
                saida: valor,
                status: 'Pago',
                statusColor: '#dc3545'
            });
        } 
        // Contas a pagar (pendentes)
        else if (conta.status === 'pendente') {
            totalPagar += valor;
            movimentacoes.push({
                data: conta.vencimento,
                descricao: `⏳ A Pagar - ${conta.descricao}`,
                tipo: 'A Pagar',
                categoria: conta.categoria || 'Despesas',
                origem: `📅 Categoria: ${conta.categoria || 'Despesas'} | Vencimento: ${conta.vencimento || '-'} | Valor: R$ ${valor.toFixed(2).replace('.', ',')}`,
                valor: valor,
                entrada: 0,
                saida: 0,
                status: 'Pendente',
                statusColor: '#6c757d'
            });
        }
    });
    
    // Ordenar por data
    movimentacoes.sort((a, b) => new Date(a.data) - new Date(b.data));
    
    // Gerar linhas da tabela
    movimentacoes.forEach(mov => {
        saldo += mov.entrada - mov.saida;
        
        const tr = document.createElement('tr');
        tr.style.borderLeft = `4px solid ${mov.statusColor}`;
        
        tr.innerHTML = `
            <td style="font-weight: 500;">${formatarData(mov.data) || '-'}</td>
            <td style="font-weight: 500;">${mov.descricao}</td>
            <td>
                <span style="padding: 4px 12px; border-radius: 20px; background: ${mov.statusColor}; color: white; font-size: 11px; font-weight: 600; text-transform: uppercase;">
                    ${mov.tipo}
                </span>
            </td>
            <td style="color: #666;">${mov.categoria}</td>
            <td style="font-size: 12px; color: #666; max-width: 300px;">${mov.origem}</td>
            <td style="color: #28a745; font-weight: bold; font-size: 15px;">
                ${mov.entrada > 0 ? 'R$ ' + mov.entrada.toFixed(2).replace('.', ',') : '-'}
            </td>
            <td style="color: #dc3545; font-weight: bold; font-size: 15px;">
                ${mov.saida > 0 ? 'R$ ' + mov.saida.toFixed(2).replace('.', ',') : '-'}
            </td>
            <td style="font-weight: bold; color: ${saldo >= 0 ? '#0056b3' : '#dc3545'}; font-size: 15px;">
                R$ ${saldo.toFixed(2).replace('.', ',')}
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    if (tbody.children.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:2rem;color:#999;">Nenhuma movimentação financeira registrada</td></tr>';
    }
    
    // Calcular lucro (receitas - despesas)
    const lucro = totalRecebidos - totalGastos;
    const saldoAtual = totalRecebidos - totalGastos;
    
    // Atualizar cards de resumo
    const totalRecebidosEl = document.getElementById('totalRecebidos');
    const totalReceberEl = document.getElementById('totalReceber');
    const totalGastosEl = document.getElementById('totalGastos');
    const totalPagarEl = document.getElementById('totalPagar');
    const saldoAtualEl = document.getElementById('saldoAtual');
    const lucroEl = document.getElementById('lucroTotal');
    
    if (totalRecebidosEl) totalRecebidosEl.textContent = `R$ ${totalRecebidos.toFixed(2).replace('.', ',')}`;
    if (totalReceberEl) totalReceberEl.textContent = `R$ ${totalReceber.toFixed(2).replace('.', ',')}`;
    if (totalGastosEl) totalGastosEl.textContent = `R$ ${totalGastos.toFixed(2).replace('.', ',')}`;
    if (totalPagarEl) totalPagarEl.textContent = `R$ ${totalPagar.toFixed(2).replace('.', ',')}`;
    
    if (saldoAtualEl) {
        saldoAtualEl.textContent = `R$ ${saldoAtual.toFixed(2).replace('.', ',')}`;
        saldoAtualEl.style.color = saldoAtual >= 0 ? '#004085' : '#dc3545';
    }
    
    if (lucroEl) {
        lucroEl.textContent = `R$ ${lucro.toFixed(2).replace('.', ',')}`;
        lucroEl.style.color = lucro >= 0 ? 'white' : '#ffcccc';
    }
}

// Função auxiliar para formatar data
function formatarData(data) {
    if (!data) return '-';
    const partes = data.split('-');
    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return data;
}

// Filtrar fluxo de caixa
function filtrarFluxoCaixa() {
    const periodo = document.getElementById('periodoFluxo')?.value;
    const tipo = document.getElementById('tipoFluxo')?.value;
    
    // Mostrar/ocultar campos de data personalizada
    const dataInicioDiv = document.getElementById('dataInicioFluxoDiv');
    const dataFimDiv = document.getElementById('dataFimFluxoDiv');
    
    if (periodo === 'personalizado') {
        if (dataInicioDiv) dataInicioDiv.style.display = 'block';
        if (dataFimDiv) dataFimDiv.style.display = 'block';
    } else {
        if (dataInicioDiv) dataInicioDiv.style.display = 'none';
        if (dataFimDiv) dataFimDiv.style.display = 'none';
    }
    
    carregarFluxoCaixa();
}

// Resetar filtros
function resetarFiltrosFluxo() {
    const periodoEl = document.getElementById('periodoFluxo');
    const tipoEl = document.getElementById('tipoFluxo');
    const dataInicioEl = document.getElementById('dataInicioFluxo');
    const dataFimEl = document.getElementById('dataFimFluxo');
    
    if (periodoEl) periodoEl.value = 'todos';
    if (tipoEl) tipoEl.value = 'todos';
    if (dataInicioEl) dataInicioEl.value = '';
    if (dataFimEl) dataFimEl.value = '';
    
    const dataInicioDiv = document.getElementById('dataInicioFluxoDiv');
    const dataFimDiv = document.getElementById('dataFimFluxoDiv');
    if (dataInicioDiv) dataInicioDiv.style.display = 'none';
    if (dataFimDiv) dataFimDiv.style.display = 'none';
    
    carregarFluxoCaixa();
}

// Exportar fluxo de caixa
function exportarFluxoCaixa() {
    alert('Função de exportação em desenvolvimento');
}

// Imprimir fluxo de caixa
function imprimirFluxoCaixa() {
    window.print();
}

// Exportar funções
window.carregarContasReceber = carregarContasReceber;
window.registrarRecebimento = registrarRecebimento;
window.carregarContasPagar = carregarContasPagar;
window.adicionarContaPagar = adicionarContaPagar;
window.registrarPagamento = registrarPagamento;
window.excluirConta = excluirConta;
window.carregarFluxoCaixa = carregarFluxoCaixa;
window.filtrarFluxoCaixa = filtrarFluxoCaixa;
window.resetarFiltrosFluxo = resetarFiltrosFluxo;
window.exportarFluxoCaixa = exportarFluxoCaixa;
window.imprimirFluxoCaixa = imprimirFluxoCaixa;

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.classList && mutation.target.classList.contains('active')) {
                const pageId = mutation.target.id;
                
                if (pageId === 'contas_receber') {
                    setTimeout(carregarContasReceber, 100);
                } else if (pageId === 'contas_pagar') {
                    setTimeout(carregarContasPagar, 100);
                } else if (pageId === 'fluxo_caixa') {
                    setTimeout(carregarFluxoCaixa, 100);
                }
            }
        });
    });
    
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        observer.observe(page, { attributes: true, attributeFilter: ['class'] });
    });
});

console.log('sistema-financeiro.js carregado com sucesso');
