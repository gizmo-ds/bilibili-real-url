import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import { setup } from '@css-render/vue3-ssr';
import type { ViteSSGOptions } from 'vite-ssg/single-page';
import svgLoader from 'vite-svg-loader';

export default defineConfig({
  build: {
    outDir: fileURLToPath(new URL('./server/public', import.meta.url)),
    emptyOutDir: true,
    sourcemap: process.env.SOURCE_MAP === 'true'
  },
  resolve: {
    alias: {
      app: fileURLToPath(new URL('./app', import.meta.url)),
      '~': fileURLToPath(new URL('./', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/rpc': 'http://localhost:3000',
      '^/.+\\.mp4': 'http://localhost:3000',
      '^/.+\\.m3u8': 'http://localhost:3000'
    }
  },
  ssr: {
    noExternal: ['naive-ui', 'vueuc', 'date-fns']
  },
  ssgOptions: {
    async onBeforePageRender(_, __, appCtx) {
      const { collect } = setup(appCtx.app);
      (appCtx as any).__collectStyle = collect;
      return undefined;
    },
    async onPageRendered(_, renderedHTML, appCtx) {
      return renderedHTML.replace(
        /<\/head>/,
        `${(appCtx as any).__collectStyle()}</head>`
      );
    }
  } as ViteSSGOptions,
  plugins: [vue(), UnoCSS(), svgLoader()]
});
