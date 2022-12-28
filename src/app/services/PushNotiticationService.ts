import axios, { AxiosResponse, AxiosError } from 'axios';
import oneSignalConfig from '../../config/oneSignalConfig';

const endpoint = oneSignalConfig.endpoints; // endpoints
const segment = oneSignalConfig.segments; // segments

const api = axios.create({
  baseURL: oneSignalConfig.base_url,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    Authorization: `Basic ${oneSignalConfig.api_key}`,
  },
});

/**
 * Envia notificação para usuários especificados através do id do dispositivo (playerId)
 *
 * @param title Título da notificação
 * @param message Mensagem da notiicação
 * @param devices Id dos dispositivos para envio
 */
export async function sendForUsersByPlayerId(
  title: string,
  message: string,
  devices: string[],
): Promise<{}> {
  const notification = {
    app_id: oneSignalConfig.app_id,
    headings: {
      en: title,
      pt: title,
    },
    contents: {
      en: message,
      pt: message,
    },
    include_player_ids: devices,
    android_accent_color: oneSignalConfig.androidAccentColor,
  };

  try {
    const response: AxiosResponse = await api.post(endpoint.notifications, notification);
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

/**
 * Envia notificação para usuários especificados através de tags
 *
 * @param title Título da notificação
 * @param message Mensagem da notiicação
 * @param tag Usuários que possuem esta tag receberão a notificação
 *
 * @example tag = { tagName: 'tagValue' }
 */
export async function sendForUsersByTag(
  title: string,
  message: string,
  tag: {},
): Promise<{}> {
  const [tagName] = Object.keys(tag);
  const [tagValue] = Object.values(tag);

  const notification = {
    app_id: oneSignalConfig.app_id,
    headings: {
      en: title,
      pt: title,
    },
    contents: {
      en: message,
      pt: message,
    },
    filters: [
      {
        field: 'tag',
        key: tagName,
        relation: '=',
        value: tagValue,
      },
    ],
    android_accent_color: oneSignalConfig.androidAccentColor,
  };

  try {
    const response: AxiosResponse = await api.post(endpoint.notifications, notification);
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

/**
 * Envia notificação para todos usuários da aplicação
 *
 * @param title Título da notificação
 * @param message Mensagem da notificação
 */
export async function sendForAllUsers(title: string, message: string): Promise<{}> {
  const notification = {
    app_id: oneSignalConfig.app_id,
    headings: {
      en: title,
      pt: title,
    },
    contents: {
      en: message,
      pt: message,
    },
    included_segments: [segment.allUsers],
    android_accent_color: oneSignalConfig.androidAccentColor,
    data: {
      route: 'informacao',
      id: 256,
    },
  };

  try {
    const response: AxiosResponse = await api.post(endpoint.notifications, notification);
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
