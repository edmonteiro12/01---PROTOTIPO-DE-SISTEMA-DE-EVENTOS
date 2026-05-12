// Estrutura de autorização de usuários por empresa
const autorizacoesUsuario = {
    cpf_usuario: "12345678900",
    empresas_autorizadas: [
        {
            id_empresa: "empresa_1",
            nome_empresa: "Eventos Produções LTDA",
            cnpj_empresa: "12.345.678/0001-90",
            cpf_titular: "11122233344", // CPF do titular da empresa
            data_autorizacao: "2024-01-15T10:30:00",
            status: "ativo", // ativo, bloqueado, pendente
            cargo: "elenco", // elenco, motorista
            observacoes: "Cadastrado pelo admin"
        },
        {
            id_empresa: "empresa_2",
            nome_empresa: "Festa & Cia Eventos",
            cnpj_empresa: "98.765.432/0001-10",
            cpf_titular: "55566677788", // CPF do titular da empresa
            data_autorizacao: "2024-01-20T14:20:00",
            status: "ativo",
            cargo: "motorista"
        }
    ],
    ultimo_acesso: "2024-01-25T08:15:00",
    total_acessos: 47
};

// Log de atividades do usuário
const logAtividadesUsuario = [
    {
        id: 1,
        cpf_usuario: "12345678900",
        id_empresa: "empresa_1",
        tipo_atividade: "visualizacao_escala",
        data_hora: "2024-01-25T08:15:00",
        detalhes: "Visualizou eventos do dia 25/01/2024"
    },
    {
        id: 2,
        cpf_usuario: "12345678900",
        id_empresa: "empresa_1",
        tipo_atividade: "disponibilidade",
        data_hora: "2024-01-24T19:30:00",
        detalhes: "Marcou indisponível dia 30/01/2024"
    }
];