<script setup lang="ts">
import { darkTheme } from 'naive-ui';
import { UseDark } from '@vueuse/components';
import bilibili from './views/Bilibili.vue';
</script>

<template>
  <use-dark v-slot="{ isDark, toggleDark }">
    <n-config-provider
      :theme="isDark ? darkTheme : undefined"
      :style="{ colorScheme: isDark ? 'dark' : 'light' }"
    >
      <n-notification-provider placement="bottom-right">
        <GitHubCorners />
        <n-layout embedded class="layout" style="height: 100vh">
          <h1>
            <img src="/favicon.png" alt="logo" />
            <span>屑站解析</span>
          </h1>

          <div class="content">
            <bilibili :is-dark="isDark" :toggle-dark="toggleDark" />
          </div>
        </n-layout>
      </n-notification-provider>
    </n-config-provider>
  </use-dark>
</template>

<style scoped lang="scss">
h1 {
  text-align: center;
  * {
    vertical-align: middle;
  }
  img {
    height: 30px;
    border-radius: 4px;
    margin-right: 8px;
  }
}
.content {
  max-width: 800px;
  margin: 0 auto;
}
</style>
