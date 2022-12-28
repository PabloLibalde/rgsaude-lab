const databases = [
  {
    municipio: 'Z_SGP_TESTE_LINUX',
    ibge: '3204708',
    novaEstrutura: false,
    databaseOptions: {
      host: '189.113.1.62',
      port: 3050,
      database: '/var/BD_teste/TESTE_SGP.fdb',
      user: 'SYSDBA',
      password: 'masterkey',
      lowercase_keys: false,
      role: null, // default
      pageSize: 4096,
    },
  },
];

/**
 *  ------------------| FOTOS |------------------
 */

const databasesFotos = [
  {
    municipio: 'Z_SGP_TESTE_LINUX_FOTOS',
    ibge: '3204708',
    novaEstrutura: false,
    databaseOptions: {
      host: '189.113.1.62',
      port: 3050,
      database: '/var/BD_teste/TESTE_SGP_FOTOS.fdb',
      user: 'SYSDBA',
      password: 'masterkey',
      lowercase_keys: false,
      role: null, // default
      pageSize: 4096,
    },
  },
];

export { databases, databasesFotos };
