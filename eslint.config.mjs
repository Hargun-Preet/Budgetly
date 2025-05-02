import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      // Disable specific TypeScript rules
      "@typescript-eslint/no-unused-vars": "off",      // Disable unused vars warning
      "@typescript-eslint/no-explicit-any": "off",     // Disable explicit any warning

      // Optionally, disable React hook warnings
      "react-hooks/exhaustive-deps": "off",            // Disable exhaustive-deps warning

      // Disable Next.js warnings related to the <img> tag
      "@next/next/no-img-element": "off",              // Disable warning for <img> tag
    },
  },
];

export default eslintConfig;
