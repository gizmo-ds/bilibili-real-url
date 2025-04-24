<script setup lang="ts">
import { usePreferredDark, useStorage } from '@vueuse/core';
import {
  darkTheme,
  lightTheme,
  NConfigProvider,
  NNotificationProvider,
  NLayout
} from 'naive-ui';
import { computed } from 'vue';
import GitHubCorners from './components/GitHubCorners.vue';
import Bilibili from './views/Bilibili.vue';

const isDark = usePreferredDark();
const isDarkMode = useStorage('app-darkmode', isDark.value);
const theme = computed(() => (isDarkMode.value ? darkTheme : lightTheme));
</script>

<template>
  <n-config-provider :theme="theme" inline-theme-disabled>
    <n-notification-provider placement="bottom-right">
      <GitHubCorners />
      <n-layout embedded class="h-screen">
        <h1 class="text-center align-middle">
          <img
            src="/favicon.png"
            alt="logo"
            class="h-30px mr-8px rounded-4px align-middle"
          />
          <span>屑站解析</span>
        </h1>

        <div class="max-w-800px my-0 mx-auto">
          <bilibili />
        </div>
      </n-layout>
    </n-notification-provider>
  </n-config-provider>
</template>
