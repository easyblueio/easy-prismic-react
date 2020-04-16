module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  ignorePatterns: [
    'next.config.js',
    'node_modules/'
  ],
  rules: {
    // Eslint
    'quotes': ['error', 'single'],
    'object-curly-spacing': ['error', 'always'],
    // Typescript
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        'allowExpressions': true
      }
    ],
    // React
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0,
    'react/display-name': 0,
    'react/no-unescaped-entities': 0
  },
  settings: {
    react: {
      version: 'detect'
    },
  },
};
