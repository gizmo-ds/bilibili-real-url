<script lang="ts" setup>
import github from '../assets/github-corner-right.svg';
import { useStorage } from '@vueuse/core';

const isDarkMode = useStorage('app-darkmode', false);
</script>

<template>
  <a
    href="https://github.com/gizmo-ds/bilibili-real-url"
    target="_blank"
    class="github-corner"
    aria-label="View source on GitHub"
    title="View source on GitHub"
  >
    <github :class="isDarkMode ? 'dark' : 'light'" />
  </a>
</template>
