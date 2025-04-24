<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { onMounted, watch, computed } from 'vue';
import { NSwitch } from 'naive-ui';

const isDarkMode = useStorage('app-darkmode', false);
const theme = computed({
  get: () => !isDarkMode.value,
  set: v => (isDarkMode.value = !v)
});
const onThemeChange = () =>
  (document.body.style.colorScheme = isDarkMode.value ? 'dark' : 'light');

watch(isDarkMode, onThemeChange);
onMounted(onThemeChange);
</script>

<template>
  <n-switch v-model:value="theme">
    <template #icon>
      <transition name="rotate" mode="out-in">
        <i v-if="isDarkMode" class="i-tabler-moon" />
        <i v-else class="i-tabler-sun" />
      </transition>
    </template>
  </n-switch>
</template>

<style scoped>
.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.2s ease-out;
}
.rotate-enter-from {
  opacity: 0;
  transform: rotate(270deg);
}
.rotate-leave-to {
  opacity: 0;
  transform: rotate(180deg);
}
</style>
