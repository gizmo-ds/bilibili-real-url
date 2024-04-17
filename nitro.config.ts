import { fileURLToPath, URL } from 'node:url';

export default defineNitroConfig({
  srcDir: 'backend',
  alias: { '@': fileURLToPath(new URL('./', import.meta.url)) },
  esbuild: {
    options: {
      target: 'es2020'
    }
  }
});
