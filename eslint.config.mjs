import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // server/ is a separate, plain-CommonJS Node.js deployable with its own
    // package.json — not part of the Next.js app's TypeScript/ESM lint rules.
    "server/**",
  ]),
]);

export default eslintConfig;
