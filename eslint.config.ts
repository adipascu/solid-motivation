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

const APP_SOURCE = ["src/**"];
const APP_SOURCE_EXCEPTIONS = [
  "src/**/*.test.ts",
  "src/**/*.test.tsx",
  "src/test-helpers/**",
];

const NUMBER_GLOBALS = [
  { name: "isNaN", message: "Use Number.isNaN instead." },
  { name: "isFinite", message: "Use Number.isFinite instead." },
];

const RESTRICTED_GLOBALS = [
  {
    name: "Date",
    message:
      "Use Temporal from temporal-polyfill instead of Date. Keep Date only at third-party boundaries that require it.",
  },
];

const RESTRICTED_PLATFORM_GLOBALS = [
  {
    name: "localStorage",
    message:
      "Use KeyValueStore from @effect/platform instead of localStorage. Raw Storage throws on denied access and returns untyped strings, so failures escape the typed error channel.",
  },
  {
    name: "sessionStorage",
    message:
      "Use KeyValueStore from @effect/platform instead of sessionStorage. Raw Storage throws on denied access and returns untyped strings, so failures escape the typed error channel.",
  },
  {
    name: "fetch",
    message:
      "Use HttpClient from @effect/platform instead of fetch. It carries request and response failures in the typed error channel rather than a rejected promise plus a manual response.ok check.",
  },
  {
    name: "setTimeout",
    message:
      "Use Effect.sleep instead of setTimeout. A sleeping fiber is interruptible and composes with Effect.timeout and Effect.race, which a bare timer handle does not.",
  },
  {
    name: "setInterval",
    message:
      "Use Effect.repeat with a Schedule instead of setInterval. The schedule is interruptible and cannot overlap with a slow tick the way a raw interval does.",
  },
];

const APP_SOURCE_GLOBALS = [
  ...NUMBER_GLOBALS,
  ...RESTRICTED_GLOBALS,
  ...RESTRICTED_PLATFORM_GLOBALS,
];

const PLATFORM_GLOBAL_NAMES = RESTRICTED_PLATFORM_GLOBALS.map(
  ({ name }) => name,
).join("|");

const QUALIFIED_PLATFORM_GLOBAL_SYNTAX = {
  selector: `MemberExpression[object.name=/^(window|globalThis|self)$/][property.name=/^(${PLATFORM_GLOBAL_NAMES})$/]`,
  message:
    "Reaching a banned platform global through window or globalThis is the same call. Use the matching @effect/platform service.",
};

const FILE_SYSTEM_SPECIFIERS = [
  "node:fs",
  "node:fs/promises",
  "fs",
  "fs/promises",
];

const PATH_SPECIFIERS = ["node:path", "path"];

const CRYPTO_SPECIFIERS = ["node:crypto", "crypto"];

const ID_LIBRARY_SPECIFIERS = [
  "uuid",
  "uuidv4",
  "@lukeed/uuid",
  "short-uuid",
  "shortid",
  "nanoid",
  "ulid",
  "cuid",
  "@paralleldrive/cuid2",
  "typeid-js",
  "crypto-random-string",
];

const NEW_ID_MESSAGE =
  "This extension mints no identifiers. Add one deliberately rather than reaching for a UUID.";

const UUID_SYNTAX = [
  {
    selector: "Identifier[name='randomUUID']:not(ImportSpecifier > Identifier)",
    message: NEW_ID_MESSAGE,
  },
  {
    selector: "MemberExpression[computed=true][property.value='randomUUID']",
    message: NEW_ID_MESSAGE,
  },
];

const UUID_RESTRICTED_IMPORTS = [
  ...CRYPTO_SPECIFIERS.map((name) => ({
    name,
    importNames: ["randomUUID", "webcrypto"],
    message: NEW_ID_MESSAGE,
  })),
  ...ID_LIBRARY_SPECIFIERS.map((name) => ({
    name,
    message: NEW_ID_MESSAGE,
  })),
];

const RESTRICTED_PLATFORM_IMPORTS = [
  ...FILE_SYSTEM_SPECIFIERS.map((name) => ({
    name,
    allowTypeImports: true,
    message:
      "Use FileSystem from @effect/platform instead. It models missing files and permission errors as typed failures.",
  })),
  ...PATH_SPECIFIERS.map((name) => ({
    name,
    allowTypeImports: true,
    message:
      "Use Path from @effect/platform instead, so path handling arrives through the Requirements channel like every other platform service.",
  })),
];

const EFFECT_SYNTAX = [
  {
    selector: "ThrowStatement",
    message:
      "Model failures in Effect's typed error channel and let an Effect boundary throw.",
  },
  {
    selector: "TryStatement",
    message:
      "Wrap throwing code with Effect.try or Effect.tryPromise at the edge instead of try/catch.",
  },
  {
    selector:
      "CallExpression[callee.object.name='Promise'][callee.property.name=/^(all|allSettled|race|any)$/]",
    message:
      "Use Effect.all and its concurrency options instead of Promise combinators.",
  },
  {
    selector:
      "MemberExpression[object.name='Promise']:not([property.name=/^(all|allSettled|race|any)$/])",
    message: "Author async code with Effect instead of Promise statics.",
  },
  {
    selector: "NewExpression[callee.name='Promise']",
    message: "Author async code with Effect instead of new Promise.",
  },
  {
    selector: "CallExpression[callee.property.name=/^(then|catch|finally)$/]",
    message: "Compose async work with Effect instead of promise chaining.",
  },
  {
    selector:
      ":matches(FunctionDeclaration, FunctionExpression, ArrowFunctionExpression)[async=true]",
    message: "Return an Effect instead of authoring an async function.",
  },
];

const RESTRICTED_TYPES = {
  Date: {
    message:
      "Use Temporal from temporal-polyfill instead of Date. Keep Date only at third-party boundaries that require it.",
  },
  Promise: {
    message:
      "Model async with Effect types. Wrap third-party promises at the edge with Effect.promise or Effect.tryPromise.",
  },
  PromiseLike: {
    message:
      "Model async with Effect types. Wrap third-party promises at the edge with Effect.promise or Effect.tryPromise.",
  },
};

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
      "no-restricted-globals": ["error", ...NUMBER_GLOBALS],
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
    files: APP_SOURCE,
    ignores: APP_SOURCE_EXCEPTIONS,
    rules: {
      "no-restricted-globals": ["error", ...APP_SOURCE_GLOBALS],
      "@typescript-eslint/no-restricted-imports": [
        "error",
        { paths: [...RESTRICTED_PLATFORM_IMPORTS, ...UUID_RESTRICTED_IMPORTS] },
      ],
      "no-restricted-syntax": [
        "error",
        QUALIFIED_PLATFORM_GLOBAL_SYNTAX,
        ...UUID_SYNTAX,
        ...EFFECT_SYNTAX,
      ],
      "@typescript-eslint/no-restricted-types": [
        "error",
        { types: RESTRICTED_TYPES },
      ],
    },
  },
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
