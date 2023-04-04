module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
  },
  env: {
    browser: true,
  },
  extends: ["airbnb", "prettier"],
  plugins: ["prettier"],
  rules: {
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "no-alert": "off",
    "no-param-reassign": "off",
    "prettier/prettier": ["error", { semi: false }],
    semi: ["error", "never"],
  },
}
