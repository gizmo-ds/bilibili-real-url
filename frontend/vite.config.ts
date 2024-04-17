import path from 'path';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import { VitePWA } from 'vite-plugin-pwa';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    svgLoader(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: '屑站解析',
        short_name: '屑站解析',
        description: '让bilibili视频与直播在VRChat中播放更简单',
        lang: 'zh-Hans',
        theme_color: '#101014',
        background_color: '#101014',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
    AutoImport({
      resolvers: [NaiveUiResolver()],
      dts: path.resolve('src/auto-imports.d.ts')
    }),
    Components({
      resolvers: [NaiveUiResolver()],
      dts: path.resolve('src/components.d.ts')
    })
  ],
  server: {
    proxy: { '/api': 'http://127.0.0.1:3000' }
  },
  build: {
    outDir: '../backend/public',
    emptyOutDir: true,
    sourcemap: process.env.SOURCE_MAP === 'true'
  }
});
