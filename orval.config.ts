/** @format */

import { defineConfig } from "orval";

export default defineConfig({
  comfyCreator: {
    output: {
      httpClient: "axios",
      mode: "tags-split",
      target: "src/api",
      schemas: "src/api/models",
      client: "axios-functions",
      override: {
        mutator: {
          path: "src/lib/api.ts",
          name: "api",
        },
      },
    },
    input: {
      filters: {
        mode: "exclude",
        tags: ["webhooks"],
      },
      target: "./specs.json",
    },
  },

  comfyCreatorZod: {
    output: {
      mode: "tags-split",
      target: "src/api",
      client: "zod",
      fileExtension: ".schema.ts",
    },
    input: {
      target: "./specs.json",
    },
  },
});
