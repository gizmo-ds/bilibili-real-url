import { fileURLToPath, URL } from 'node:url';

export default defineNitroConfig({
  compatibilityDate: '2025-04-24',
  srcDir: 'server',
  alias: { '@': fileURLToPath(new URL('./', import.meta.url)) },
  typescript: {
    generateRuntimeConfigTypes: false,
    generateTsConfig: false
  },
  esbuild: {
    options: { target: 'es2020' }
  }
});
