export default {
  individuo: {
    erro_validaNomeCompleto: 'O nome informado não confere com os dados armazenados. '
    + 'Por favor, tente novamente. Caso o problema persista, vá até sua Unidade de Saúde '
    + 'para verificar seus dados.',

    erro_validaDataNascimento: 'A data de nascimento informada não confere com os dados '
    + 'armazenados. Por favor, tente novamente. Caso o problema persista, vá até sua Unidade de Saúde '
    + 'para verificar seus dados.',

    erro_ValidaNomeMae: 'O nome da mãe informado não confere com os dados armazenados. Por favor, '
    + 'tente novamente. Caso o problema persista, vá até sua Unidade de Saúde '
    + 'para verificar seus dados.',

    erro_individuoNaoCadastrado: 'CPF/CNS não encontrado. Verifique se preencheu o campo '
    + 'corretamente. Caso o problema persista, vá até sua Unidade de Saúde para verificar seus dados.',

    erro_individuoNaoPossuiVinculoFamilia: 'Você não possui vínculo com uma Família nos Sistema. '
    + 'Procure sua Agente de Saúde ou Unidade de Saúde para regularizar seu cadastro.',

    erro_individuoPossuiCadastroApp: (cpf_cns: string): string => 'Já existe cadastro no App para o '
    + `${cpf_cns.toLocaleUpperCase()} informado. Caso tenha esquecido a senha, utilize `
    + 'a opção "esqueceu a senha", localizada na parte inferior da tela de Login.',

    sms_cadastroRealizado: (password: string): string => `${'RG Saúde Mobile\n'
    + 'Cadastro realizado com sucesso! Sua senha de acesso é: '}${password}\n`
    + 'Você poderá altera-la no primeiro acesso.',

    sms_recuperacaoSenha: (password: string): string => `${'RG Saúde Mobile\n'
    + 'Sua nova senha de acesso é: '}${password}\n`
    + 'Você poderá altera-la no primeiro acesso.',
  },

  usuario: {},

  msg_padrao: {
    erro_buscarRegistro: 'Problemas em buscar os registros!',

    erro_login: 'Erro ao logar!',

    msg_registroSalvo: 'Registro salvo com sucesso!',

    msg_registroAlterado: 'Registro alterado com sucesso!',

    msg_registroDeletado: 'Registro deletado com sucesso!',
  },

};
