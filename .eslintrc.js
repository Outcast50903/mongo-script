module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'max-len': [2, { code: 120, ignoreUrls: true }],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['warn'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'max-lines-per-function': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off'
  },
  settings: {
    'import/extensions': ['.ts'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts']
    },
    'import/resolver': {
      node: {
        extensions: ['.ts']
      }
    }
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint']
}
