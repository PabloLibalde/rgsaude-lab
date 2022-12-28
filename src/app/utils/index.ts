import { Buffer } from 'buffer';
import { databases } from '../../config/databaseConfig';

/**
 * Gera hash de senha alfanumérico
 *
 * @param passwordLength Comprimento da senha
 */
export function generatePassword(passwordLength: number): string {
  return [...Array(passwordLength)].map(() => (~~(Math.random() * 36)).toString(36)).join('');
}


/**
 * Extrai todos os números de uma string
 *
 * @param string
 */
export function extractNumbersFromString(string: string): string {
  return string ? string.replace(/\D/g, '') : string;
}

/**
 * Verifica se um objeto está vazio (não possui chaves)
 *
 * @param object
 */
export function emptyObject(object: Record<string, any>): boolean {
  return !!((Object.entries(object).length === 0 && object.constructor === Object));
}

/**
 * Transforma blob em Buffer
 *
 * @param blob Blob retornado da base de dados
 */
export function blobToBuffer(blob: Function): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const buffers = [];

    blob((err, name, event) => {
      event.on('data', (chunk) => { buffers.push(chunk); });

      event.once('end', () => {
        const buffer = Buffer.concat(buffers);
        resolve(buffer);
      });

      event.once('error', (ex) => { reject(ex); });
    });
  });
}

/**
 * Verifica se o banco de dados do município usa a antiga ou nova estrutura de dados
 *
 * @param ibge IBGE do município
 *
 * @returns Retorna 'true' para nova estrutura, 'false' para estrutura antiga
 */
export function databaseUseNewStructure(ibge: string): boolean {
  const [database] = databases.filter((d) => d.ibge === ibge);

  return database ? database.novaEstrutura : false;
}

/**
 * Remove os acentos de uma string
 *
 * @param text
 *
 * @returns String sem os acentos
 */
export function removeAccents(text: string): string {
  return text ? text.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
}
