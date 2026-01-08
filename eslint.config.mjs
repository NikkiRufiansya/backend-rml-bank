import js from "@eslint/js";
import globals from "globals";
import security from "eslint-plugin-security";

export default [
  js.configs.recommended,

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node   // ✅ backend Node.js
      }
    },
    plugins: {
      security
    },
    rules: {
      ...security.configs.recommended.rules,

      // opsional (tuning)
      "security/detect-object-injection": "warn"
    }
  }
];