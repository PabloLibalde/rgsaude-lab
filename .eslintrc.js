module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    es6: true,
    node: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'airbnb-base',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  settings: {
    'import/extensions': [
      '.js',
      '.ts'
    ],
    'class-methods-use-this': false,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        'js': 'never',
        'mjs': 'never',
        'jsx': 'never',
        'ts': 'never',
        'tsx': 'never'
      }
    ],
    'class-methods-use-this': 0,
    'no-param-reassign': 0,
    'camelcase': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/interface-name-prefix': ['error', {"prefixWithI": "always"}],
    '@typescript-eslint/class-name-casing': 0,
    'no-restricted-syntax': 0,
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    // "prefixWithI": "always"
    // '@typescript-eslint/camelcase': ['error', {
    //   'properties': 'never',
    //   'ignoreDestructuring': true,
    //   'genericType': 'never',
    // }],
  },
};
