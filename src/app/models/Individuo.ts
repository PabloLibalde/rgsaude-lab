import BaseManager from '../../database/BaseManager';
import { IIndividuo, individuoSQL, ITSI_CADPAC } from './interfaces/individuo';

class Individuo {
  private table = 'TSI_CADPAC';

  private cond = (value: number): { CSI_CODPAC: number } => ({ CSI_CODPAC: value });

  public async getIndividuosFamilia(
    cond: { ID_FAMILIA: number; ID_ESUS_CADDOMICILIAR: number; },
    novaEstrutura = true,
  ): Promise<IIndividuo[]> {
    const queryResult = await BaseManager.search(
      this.table,
      novaEstrutura
        ? { ID_FAMILIA: cond.ID_FAMILIA }
        : { ID_ESUS_CADDOMICILIAR: cond.ID_ESUS_CADDOMICILIAR },
      'CSI_NOMPAC',
    );

    if (queryResult) {
      return queryResult.map((i: ITSI_CADPAC) => ({
        id: i.CSI_CODPAC,
        nome: i.CSI_NOMPAC,
        data_nascimento: new Date(i.CSI_DTNASC),
        sexo: i.CSI_SEXPAC,
        cpf: i.CSI_CPFPAC,
        cns: i.CSI_NCARTAO,
        nome_mae: i.CSI_MAEPAC,
        telefone: i.CSI_CELULAR,
        email: i.EMIAL,
      } as IIndividuo));
    }
    return [] as IIndividuo[];
  }

  /**
   * Busca registro de indivíduo pelo Id
   *
   * @param id Id do indivíduo
   */
  public async find(id: number): Promise<IIndividuo> {
    const queryResult: ITSI_CADPAC = await BaseManager.search(
      this.table, this.cond(id), null, true,
    );

    if (queryResult) {
      const individuo: IIndividuo = {
        id: queryResult.CSI_CODPAC,
        id_familia: queryResult.ID_FAMILIA,
        id_esus_caddomiciliar: queryResult.ID_ESUS_CADDOMICILIAR,
        nome: queryResult.CSI_NOMPAC,
        data_nascimento: queryResult.CSI_DTNASC,
        sexo: queryResult.CSI_SEXPAC,
        cpf: queryResult.CSI_CPFPAC,
        cns: queryResult.CSI_NCARTAO,
        email: queryResult.EMIAL,
        telefone: queryResult.CSI_CELULAR,
        nome_mae: queryResult.CSI_MAEPAC,
      };
      return individuo;
    }
    return {} as IIndividuo;
  }

  public async verificaIndividuo(value: string, search: 'cpf' | 'cns'): Promise<IIndividuo> {
    const sql = search === 'cpf'
      ? individuoSQL.verificaIndividuoCPF
      : individuoSQL.verificaIndividuoCNS;

    const queryResult: ITSI_CADPAC = await BaseManager.searchQuery(sql, [value], true);

    if (queryResult) {
      const individuo: IIndividuo = {
        id: queryResult.CSI_CODPAC,
        id_familia: queryResult.ID_FAMILIA,
        id_esus_caddomiciliar: queryResult.ID_ESUS_CADDOMICILIAR,
        nome: queryResult.CSI_NOMPAC,
        data_nascimento: new Date(queryResult.CSI_DTNASC),
        sexo: queryResult.CSI_SEXPAC,
        cpf: queryResult.CSI_CPFPAC,
        cns: queryResult.CSI_NCARTAO,
        nome_mae: queryResult.CSI_MAEPAC,
        telefone: queryResult.CSI_CELULAR,
        email: queryResult.EMIAL,
      };
      return individuo;
    }
    return {} as IIndividuo;
  }

  /**
   * Atualiza um registro de indivíduo
   *
   * @param id Id do indivíduo
   * @param itens Itens para atualizar
   *
   * @example itens = { name: 'user name' }
   */
  public async update(id: number, itens: ITSI_CADPAC): Promise<boolean> {
    const executed = await BaseManager.update(this.table, this.cond(id), itens);
    return executed || false;
  }
}

export default new Individuo();
