module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh','prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "@typescript-eslint/no-explicit-any": 0,
    'react/jsx-use-react': 0, // React V17开始JSX已经不再需要引入React
    'react/react-in-jsx-scope': 0, // 同上
    'import/first': 0, // 消除绝对路径必须要在相对路径前引入，
    'no-mixed-spaces-and-tabs': 2, // 禁止空格和 tab 的混合缩进
    'no-debugger': 2, // 禁止有debugger
    'space-infix-ops': 2, // 要求操作符周围有空格
    'space-before-blocks': 2, // 要求语句块之前有空格
    '@typescript-eslint/explicit-function-return-type': 0, // 禁止函数必须要定义返回类型
  },
}
