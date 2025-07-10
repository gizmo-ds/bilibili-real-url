import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import { setup } from '@css-render/vue3-ssr';
import type { ViteSSGOptions } from 'vite-ssg/single-page';
import svgLoader from 'vite-svg-loader';
import { VitePWA } from 'vite-plugin-pwa';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
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
  plugins: [
    vue(),
    UnoCSS(),
    svgLoader(),
    vueJsx(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png'],
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg}'] },
      manifest: {
        name: '屑站解析',
        short_name: '屑站解析',
        description: '让bilibili视频与直播在VRChat中播放更简单',
        theme_color: '#101014',
        background_color: '#101014',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  build: {
    outDir: fileURLToPath(new URL('./server/public', import.meta.url)),
    emptyOutDir: true,
    sourcemap: process.env.SOURCE_MAP === 'true'
  }
});
