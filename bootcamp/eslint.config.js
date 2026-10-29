import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['node_modules', 'dist', '.verify-tmp'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      // Exercise starters have parameters you have not used yet; that is fine.
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
    },
  },
  {
    // 01-js/03 step 7's starter uses var in a loop on purpose: finding why that breaks the closures is the exercise.
    files: ['01-js/03-scope-closures/exercises.js'],
    rules: { 'no-var': 'off' },
  },
  {
    // Type-level checks: each @ts-expect-error and test value is the check, and the comment above it is the message juniors see.
    files: ['scripts/checks/**/*.types.ts'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
);
