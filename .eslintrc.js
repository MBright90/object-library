module.exports = {
  env: {
    browser: true,
  },
  extends: ["airbnb", "prettier"],
  plugins: ["prettier"],
  rules: {
    "no-alert": "off",
    "no-param-reassign": "off",
    "prettier/prettier": ["error", { semi: false }],
    semi: ["error", "never"],
  },
}
