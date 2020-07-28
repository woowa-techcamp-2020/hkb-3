module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    // Airbnb style guide 적용
    'airbnb-base',
    // TypeScript ESLint recommanded style 적용
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  rules: {
    'no-console': 'off',
    indent: ['error', 2],
    semi: ['error', 'always'],
    'no-trailing-spaces': 0,
    'keyword-spacing': 0,
    'no-unused-vars': 1,
    'no-multiple-empty-lines': 0,
    'space-before-function-paren': 0,
    'eol-last': 0,
    'import/no-unresolved': 'off',
    'import/extensions': ['off'],
    'no-use-before-define': ['error', { functions: false, classes: true }],
    'no-restricted-globals': ['off'],
  },
};
