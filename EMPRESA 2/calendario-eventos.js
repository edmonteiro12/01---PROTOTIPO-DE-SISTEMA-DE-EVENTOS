/**
 * ==========================================
 * CALENDÁRIO DE EVENTOS COM CORES DE STATUS
 * ==========================================
 * Integra os eventos cadastrados em "Reservar Evento" 
 * com o calendário visual do painel (dashboard)
 * Mostra cores de status dos eventos conforme status_evento e status_pagamento
 */

class CalendarioEventosSystem {
    constructor() {
        this.mesAtual = new Date().getMonth();
        this.anoAtual = new Date().getFullYear();
        this.eventos = [];
        this.corPorStatus = {
            'confirmado': '#28a745',      // Verde - Confirmado/Pago
            'pago': '#28a745',
            'pendente': '#ffc107',         // Amarelo - Pendente
            'reservado': '#007bff',        // Azul - Reservado
            'nao_pago': '#dc3545',         // Vermelho - Não Pago
            'cancelado': '#dc3545',
            'finalizados': '#6c757d'       // Cinza - Finalizado
        };
    }

    /**
     * Inicializa o calendário
     */
    init() {
        this.carregarEventos();
        this.renderizarCalendario();
        this.anexarEventosBotoes();
    }

    /**
     * Carrega eventos do localStorage
     */
    carregarEventos() {
        this.eventos = JSON.parse(localStorage.getItem('eventos_cadastrados') || '[]');
    }

    /**
     * Renderiza o calendário do mês
     */
    renderizarCalendario() {
        const container = document.getElementById('calendar');
        if (!container) return;

        const hoje = new Date();
        const primeiroDia = new Date(this.anoAtual, this.mesAtual, 1).getDay();
        const diasNoMes = new Date(this.anoAtual, this.mesAtual + 1, 0).getDate();

        // Atualizar cabeçalho do mês
        const nomeMes = new Date(this.anoAtual, this.mesAtual, 1).toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
        });
        const headerMes = document.getElementById('currentMonth');
        if (headerMes) {
            headerMes.textContent = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
        }

        // Cabeçalho dos dias da semana
        const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
        let html = '';
        
        diasSemana.forEach(dia => {
            html += `<div class="calendar-day-header">${dia}</div>`;
        });

        // Dias vazios antes do mês
        for (let i = 0; i < primeiroDia; i++) {
            html += '<div class="calendar-empty-day"></div>';
        }

        // Dias do mês
        for (let dia = 1; dia <= diasNoMes; dia++) {
            const dataDia = new Date(this.anoAtual, this.mesAtual, dia);
            dataDia.setHours(0, 0, 0, 0);
            const dataStr = dataDia.toISOString().split('T')[0];

            // Buscar eventos deste dia
            const eventosDia = this.obterEventosDia(dataStr);
            const ehHoje = dataDia.getTime() === new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).getTime();

            // Determinar cor baseada no evento principal do dia
            let corFundo = '#fff';
            let corBorda = '#ddd';
            let indicador = '';

            if (eventosDia.length > 0) {
                const evento = eventosDia[0];
                const status = this.determinarStatus(evento);
                const cor = this.obterCorPorStatus(status);
                corFundo = cor + '20'; // Transparência 20%
                corBorda = cor;
                indicador = `<div class="event-indicator" style="background:${cor}; border-radius:50%; width:6px; height:6px; margin:0 auto; margin-top:2px;"></div>`;
            }

            const styleHoje = ehHoje ? 'box-shadow: inset 0 0 0 2px #667eea;' : '';

            html += `
                <div class="calendar-day" data-data="${dataStr}" 
                     style="
                        background: ${corFundo}; 
                        border: 2px solid ${corBorda}; 
                        cursor: pointer;
                        ${styleHoje}
                     "
                     onclick="mostrarEventosDiaCalendario('${dataStr}')">
                    <div class="calendar-day-number">${dia}</div>
                    ${indicador}
                </div>
            `;
        }

        container.innerHTML = html;
    }

    /**
     * Obtém eventos de um dia específico
     */
    obterEventosDia(dataStr) {
        return this.eventos.filter(evento => {
            const dataEvento = evento.data_evento ? evento.data_evento.split('T')[0] : '';
            return dataEvento === dataStr;
        });
    }

    /**
     * Determina o status do evento
     */
    determinarStatus(evento) {
        const statusPagamento = (evento.status_pagamento || '').toLowerCase();
        const statusEvento = (evento.status_evento || '').toLowerCase();

        // Prioridade: pagamento > evento
        if (statusPagamento.includes('pago') || statusPagamento.includes('confirmado')) {
            return 'confirmado';
        }
        if (statusPagamento.includes('não') || statusPagamento.includes('nao')) {
            return 'nao_pago';
        }
        if (statusEvento.includes('confirmado')) {
            return 'confirmado';
        }
        if (statusEvento.includes('finalizado')) {
            return 'finalizados';
        }
        if (statusEvento.includes('reservado')) {
            return 'reservado';
        }
        return 'pendente';
    }

    /**
     * Obtém a cor para um status
     */
    obterCorPorStatus(status) {
        return this.corPorStatus[status?.toLowerCase()] || '#007bff';
    }

    /**
     * Navega para o mês anterior
     */
    mesAnterior() {
        this.mesAtual--;
        if (this.mesAtual < 0) {
            this.mesAtual = 11;
            this.anoAtual--;
        }
        this.renderizarCalendario();
    }

    /**
     * Navega para o próximo mês
     */
    proximoMes() {
        this.mesAtual++;
        if (this.mesAtual > 11) {
            this.mesAtual = 0;
            this.anoAtual++;
        }
        this.renderizarCalendario();
    }

    /**
     * Navega para o mês/ano atual
     */
    irParaHoje() {
        const hoje = new Date();
        this.mesAtual = hoje.getMonth();
        this.anoAtual = hoje.getFullYear();
        this.renderizarCalendario();
    }

    /**
     * Anexa eventos aos botões de navegação
     */
    anexarEventosBotoes() {
        // Os botões já estão com onclick no HTML, mas vamos criar funções globais
        window.previousMonth = () => this.mesAnterior();
        window.nextMonth = () => this.proximoMes();
        window.irParaHoje = () => this.irParaHoje();
    }
}

/**
 * Função global para mostrar eventos do dia
 */
function mostrarEventosDiaCalendario(dataStr) {
    const calendario = window.calendarioEventos;
    if (!calendario) return;

    const eventosDia = calendario.obterEventosDia(dataStr);
    
    if (eventosDia.length === 0) {
        alert('Nenhum evento neste dia');
        return;
    }

    const dataBR = new Date(dataStr + 'T00:00:00').toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    let mensagem = `📅 Eventos em ${dataBR}:\n\n`;
    eventosDia.forEach((evento, index) => {
        const status = calendario.determinarStatus(evento);
        const nomeCliente = evento.nome_cliente_evento || 'Sem nome';
        const hora = evento.hora_evento || 'Não informada';
        const local = evento.nome_local_evento || 'Não informado';
        
        mensagem += `${index + 1}. ${nomeCliente}\n`;
        mensagem += `   📍 Local: ${local}\n`;
        mensagem += `   🕐 Horário: ${hora}\n`;
        mensagem += `   📊 Status: ${status}\n\n`;
    });

    alert(mensagem);
}

/**
 * Inicializa quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', () => {
    window.calendarioEventos = new CalendarioEventosSystem();
    window.calendarioEventos.init();
});

/**
 * Atualiza calendário quando novos eventos são adicionados
 */
function atualizarCalendarioEventos() {
    if (window.calendarioEventos) {
        window.calendarioEventos.carregarEventos();
        window.calendarioEventos.renderizarCalendario();
    }
}
