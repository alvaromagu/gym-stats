import love from 'eslint-config-love';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default [
  {
    ...love,
    files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
  },
  eslintConfigPrettier,
];
