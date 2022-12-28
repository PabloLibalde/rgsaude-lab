import md5 from 'md5';

import { IUsuario, usuarioSQL, IRG_SAUDE_USUARIO } from './interfaces/usuario';
import BaseManager from '../../database/BaseManager';

class Usuario {
  private table = 'RG_SAUDE_USUARIO';

  private cond = (value: number): { ID: number } => ({ ID: value });

  /**
   * Busca registro de usuário pelo Id
   *
   * @param id Id do usuário
   */
  public async find(id: number): Promise<IUsuario> {
    const queryResult: IRG_SAUDE_USUARIO = await BaseManager.search(
      this.table, this.cond(id), null, true,
    );

    if (queryResult) {
      const user: IUsuario = {
        id: queryResult.ID,
        id_familia: queryResult.ID_FAMILIA,
        id_esus_caddomiciliar: queryResult.ID_ESUS_CADDOMICILIAR,
        nome: queryResult.NOME,
        data_nascimento: queryResult.DATA_NASCIMENTO,
        sexo: queryResult.SEXO,
        cpf: queryResult.CPF,
        cns: queryResult.CNS,
        email: queryResult.EMAIL,
        senha: queryResult.SENHA,
        telefone: queryResult.CELULAR,
        criado_em: queryResult.CRIADO_EM,
        atualizado_em: queryResult.ATUALIZADO_EM,
        ultimo_acesso: queryResult.ULTIMO_ACESSO,
      };
      return user;
    }
    return {} as IUsuario;
  }

  /**
   * Atualiza um registro de usuário
   *
   * @param id Id do usuário
   * @param itens Itens para atualizar
   *
   * @example itens = { name: 'user name' }
   */
  public async update(id: number, itens: IRG_SAUDE_USUARIO): Promise<boolean> {
    const executed = await BaseManager.update(this.table, this.cond(id), itens);
    return executed || false;
  }

  /**
   * Insere um registro de usuário
   *
   * @param itens Itens pata inserir
   *
   * @example itens = { name: 'user name' }
   */
  public async insert(itens: IRG_SAUDE_USUARIO): Promise<boolean> {
    const executed = await BaseManager.insert(this.table, itens);
    return executed || false;
  }

  /**
   * Busca os dados do usuário através do CPF/CNS fornecido
   *
   * @param search Através de qual campo deve ser feita a busca
   * @param value Valor do campo
   */
  public async verificaUsuario(value: string, search: 'cpf'|'cns'): Promise<IUsuario> {
    const sql = search === 'cpf'
      ? usuarioSQL.verificaUsuarioCPF
      : usuarioSQL.verificaUsuarioCNS;

    const queryResult: IRG_SAUDE_USUARIO = await BaseManager.searchQuery(sql, [value], true);

    if (queryResult) {
      const user: IUsuario = {
        id: queryResult.ID,
        id_familia: queryResult.ID_FAMILIA,
        id_esus_caddomiciliar: queryResult.ID_ESUS_CADDOMICILIAR,
        nome: queryResult.NOME,
        data_nascimento: queryResult.DATA_NASCIMENTO,
        sexo: queryResult.SEXO,
        cpf: queryResult.CPF,
        cns: queryResult.CNS,
        email: queryResult.EMAIL,
        senha: queryResult.SENHA,
        telefone: queryResult.CELULAR,
        criado_em: queryResult.CRIADO_EM,
        atualizado_em: queryResult.ATUALIZADO_EM,
        ultimo_acesso: queryResult.ULTIMO_ACESSO,
      };
      return user;
    }
    return {} as IUsuario;
  }

  /**
   * Verifica se a senha informada corresponde com a senha gravada no banco de dados
   *
   * @param dbPassword Senha do banco de dados
   * @param password Senha informada pelo usuário
   */
  public checkPassword(dbPassword: string, password: string): boolean {
    const hash = md5(password).toLocaleUpperCase();
    return (dbPassword.toLocaleUpperCase() === hash);
  }
}

export default new Usuario();
