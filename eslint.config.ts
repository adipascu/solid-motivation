import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import importX from "eslint-plugin-import-x";
import prettier from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

const TEST_AND_TOOLING = [
  "**/*.test.ts",
  "**/*.test.tsx",
  "src/test-helpers/**",
  "*.mts",
  "*.ts",
];

export default defineConfig(
  {
    ignores: [".claude/**", "coverage/**", "dist/**", "node_modules/**"],
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  prettier,
  {
    plugins: { "import-x": importX },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "import-x/no-duplicates": "error",
      "import-x/no-extraneous-dependencies": [
        "error",
        { devDependencies: TEST_AND_TOOLING },
      ],
      curly: ["error", "all"],
      eqeqeq: ["error", "always", { null: "ignore" }],
      "array-callback-return": "error",
      "default-case": "error",
      "func-style": ["error", "expression"],
      "no-console": "error",
      "no-else-return": "error",
      "no-nested-ternary": "error",
      "no-param-reassign": "error",
      "no-promise-executor-return": "error",
      "no-restricted-globals": [
        "error",
        { name: "isNaN", message: "Use Number.isNaN instead." },
        { name: "isFinite", message: "Use Number.isFinite instead." },
      ],
      "no-return-assign": "error",
      "no-self-compare": "error",
      "no-shadow": "off",
      "no-template-curly-in-string": "error",
      "no-unreachable-loop": "error",
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      radix: "error",
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "never" },
      ],
      "@typescript-eslint/no-loop-func": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
          enforceForJSX: true,
        },
      ],
      "@typescript-eslint/no-use-before-define": "error",
    },
  },
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
