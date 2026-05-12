// Script para verificar dados no localStorage
console.log('=== VERIFICAÇÃO DE DADOS NO SISTEMA ===');

// Verificar dados da matriz
const matrizEmpresas = JSON.parse(localStorage.getItem('matriz_empresas') || '[]');
console.log('Empresas cadastradas na matriz:', matrizEmpresas);

const matrizCredenciais = JSON.parse(localStorage.getItem('matriz_empresas_credenciais') || '[]');
console.log('Credenciais na matriz:', matrizCredenciais);

const usuariosApp = JSON.parse(localStorage.getItem('matriz_usuarios_app_autorizados') || '[]');
console.log('Usuários autorizados:', usuariosApp);

// Verificar dados nas pastas
const empresasEmpresa1 = JSON.parse(localStorage.getItem('empresas_login_EMPRESA 1') || '[]');
console.log('Empresas na pasta EMPRESA 1:', empresasEmpresa1);

const empresasEmpresa2 = JSON.parse(localStorage.getItem('empresas_login_EMPRESA 2') || '[]');
console.log('Empresas na pasta EMPRESA 2:', empresasEmpresa2);

// Teste de login
function testarLogin(pasta, login, senha) {
    console.log(`\n=== TESTE DE LOGIN: ${pasta} - ${login} ===`);

    const key = `empresas_login_${pasta}`;
    let empresas = JSON.parse(localStorage.getItem(key) || '[]');

    if (!empresas.length) {
        console.log('Nenhuma empresa na pasta, tentando carregar da matriz...');
        // Simular carregamento da matriz
        const empresasMatriz = JSON.parse(localStorage.getItem('matriz_empresas') || '[]');
        const credenciais = JSON.parse(localStorage.getItem('matriz_empresas_credenciais') || '[]');
        const usuariosApp = JSON.parse(localStorage.getItem('matriz_usuarios_app_autorizados') || '[]');

        empresas = credenciais
            .map(c => {
                const empresa = empresasMatriz.find(e => e.id === c.id_empresa);
                if (!empresa || empresa.pastaSistema !== pasta) return null;
                return {
                    id: c.id_empresa,
                    nome: empresa.nome || 'Empresa',
                    login: c.login,
                    senha: c.senha,
                    senha_provisoria: c.senha_provisoria || false,
                    pasta: empresa.pastaSistema
                };
            })
            .filter(Boolean);

        console.log('Empresas carregadas da matriz:', empresas);
    }

    const loginLower = login.toLowerCase();
    const empresa = empresas.find(e => e.login && e.login.toLowerCase() === loginLower);

    if (!empresa) {
        console.log('❌ Empresa não encontrada');
        return false;
    }

    console.log('Empresa encontrada:', empresa);

    if (empresa.senha !== senha) {
        console.log('❌ Senha incorreta');
        return false;
    }

    console.log('✅ Login bem-sucedido!');
    console.log('Senha provisória:', empresa.senha_provisoria);

    return empresa;
}

// Testar alguns logins comuns
testarLogin('EMPRESA 1', 'empresa1', 'senha123');
testarLogin('EMPRESA 2', 'empresa2', 'senha456');

console.log('\n=== INSTRUÇÕES ===');
console.log('Para testar o login:');
console.log('1. Abra Sistema matriz/painel-admin.html');
console.log('2. Cadastre uma empresa na pasta EMPRESA 1');
console.log('3. Adicione o usuário em "Usuários Autorizados"');
console.log('4. Teste o login em EMPRESA 1/login.html');