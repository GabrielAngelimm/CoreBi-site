// @ts-check
import { defineConfig } from "astro/config";

// O domínio próprio entra aqui (ou na variável SITE_URL da Vercel) quando existir.
const site = process.env.SITE_URL ?? "https://corebi.vercel.app";

export default defineConfig({
  site,
  trailingSlash: "never",
  build: {
    format: "file",
    inlineStylesheets: "auto",
  },
  prefetch: false,
  devToolbar: { enabled: false },
});
