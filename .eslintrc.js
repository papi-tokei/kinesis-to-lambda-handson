module.exports = {
  extends: [
    "prettier",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["prettier"],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        // 各種設定
      },
    ],
  },
};
