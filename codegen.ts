import { printSchema } from "graphql";
import { schema } from "./server/utils/schema";

import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: printSchema(schema),
  documents: ["graphql/**/*.graphql"],
  generates: {
    "generated/schema.graphql": {
      plugins: ["schema-ast"],
    },
    "generated/schema.ts": {
      plugins: ["typescript"],
    },
    "composables/": {
      preset: "near-operation-file",
      presetConfig: {
        baseTypesPath: "../generated/schema.ts",
        extension: ".ts",
        folder: "../composables",
      },
      config: {
        documentMode: "documentNode",
      },
      plugins: ["typescript-operations", "typescript-vue-urql"],
    },
  },
};

export default config;
