// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  {
    // Código de terceiros (OriginKit, React Bits) mantido próximo do original.
    ignores: [
      'src/components/ilhas/vendor/',
      'dist/',
      '.astro/',
      'node_modules/',
      '.vercel/',
      '.lighthouseci/',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-strict'],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
];
