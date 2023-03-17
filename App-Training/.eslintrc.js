module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/standard',
        '@vue/typescript/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        'eol-last': [2, 'never'],
        indent: [2, 4, { SwitchCase: 1 }],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        semi: [2, 'always'],
        'space-before-function-paren': [2, 'never'],
        'symbol-description': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }]
    },
    overrides: [
        {
            files: ['*.{j,t}s'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off'
            }
        }, {
            files: ['*.vue'],
            rules: {
                'vue/valid-v-slot': ['error', { allowModifiers: true }]
            }
        }]
};