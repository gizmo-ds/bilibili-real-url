<script setup lang="ts">
import { NText } from 'naive-ui';

defineProps<{
  href: string;
  title?: string;
}>();
</script>

<template>
  <n-text
    tag="a"
    type="primary"
    :href="href"
    :title="title"
    target="_blank"
    rel="noopener noreferrer"
    class="ml-1 align-middle"
  >
    <span class="i-tabler-external-link inline-block"></span>
  </n-text>
</template>
