import { Method } from 'axios';

export default {
  user: 'rgsystem',
  password: 'sys2727',
  base_url: 'https://webservices2.twwwireless.com.br',
  endpoints: {
    single_user: {
      method: 'POST' as Method,
      url: '/reluzcap/wsreluzcap.asmx/EnviaSMS',
    },
  },
};
