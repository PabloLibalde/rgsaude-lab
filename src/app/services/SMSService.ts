/* eslint-disable import/prefer-default-export */


import axios, { AxiosError, AxiosResponse } from 'axios';
import SMSConfig from '../../config/SMSConfig';

const endpoint = SMSConfig.endpoints;

const api = axios.create({
  baseURL: SMSConfig.base_url,
});

/**
 * Envia mensagem de texto (SMS) para um usuário/celular
 *
 * @param identifier Identificador da mensagem (usado para apurar resposa das mesagens enviadas)
 * @param telNumber Número do celular
 * @param message Mensagem de texto com até 160 caracteres
 *
 * @example telNumber = '55DDNNNNNNNN'
 */
export async function sendForSingleUser(
  identifier: string,
  telNumber: string,
  message: string,
): Promise<any> {
  enum ESmsKeys {
    NumUsu = 'NumUsu',
    Senha = 'Senha',
    SeuNum = 'SeuNum',
    Celular = 'Celular',
    Mensagem = 'Mensagem',
  }

  const data = {
    [ESmsKeys.NumUsu]: SMSConfig.user,
    [ESmsKeys.Senha]: SMSConfig.password,
    [ESmsKeys.SeuNum]: identifier,
    [ESmsKeys.Celular]: telNumber,
    [ESmsKeys.Mensagem]: message,
  };


  const body = Object.keys(data)
    .map((key: ESmsKeys) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');

  try {
    const response: AxiosResponse = await api.request({
      method: endpoint.single_user.method,
      url: endpoint.single_user.url,
      data: body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  } catch (exception) {
    const error = exception as AxiosError;

    // Handle error
    return {
      isAxiosError: !!error.isAxiosError,
      code: error.code ? error.code : undefined,
      message: error.message ? error.message : undefined,
      reponseError: error.response.data ? error.response.data : undefined,
    };
  }
}
