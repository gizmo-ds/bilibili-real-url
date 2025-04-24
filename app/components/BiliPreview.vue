<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  preview?: string;
  poster?: string;
}>();

const showLivePreview = ref(false);

const preview_url = computed(() =>
  props.preview ? new URL(props.preview) : null
);
const poster_url = computed(() => {
  if (!props.poster) return undefined;
  const u = new URL('https://api.codetabs.com/v1/proxy');
  u.searchParams.append('quest', props.poster);
  return u.toString();
});
const hlsplayer_url = computed(() => {
  if (!props.preview) return undefined;
  const u = new URL('https://www.hlsplayer.org/play');
  u.searchParams.append('url', props.preview);
  return u.toString();
});

onMounted(() => {
  if (!props.poster || props.poster === '') showLivePreview.value = true;
});

onUnmounted(() => {
  showLivePreview.value = false;
});
</script>

<template>
  <video
    class="w-full border-rounded"
    controls
    loop
    crossorigin="anonymous"
    v-if="preview && preview_url?.pathname.endsWith('.mp4')"
    :src="preview"
    :poster="poster_url"
  />
  <div v-else-if="preview && preview_url?.pathname.endsWith('.m3u8')">
    <div
      v-if="!showLivePreview"
      class="w-full min-h-350px cursor-pointer"
      @click="showLivePreview = true"
    >
      <img v-if="!showLivePreview" :src="poster_url" class="w-full" />
      <div class="float-start">
        <span class="absolute left-[calc(50%-35px)] top-[calc(50%+35px)]">
          <div class="i-tabler-circle-caret-right w-70px h-70px"></div>
        </span>
      </div>
    </div>
    <iframe
      v-if="showLivePreview"
      class="w-full min-h-400px border-0 border-rounded"
      :src="hlsplayer_url"
      allowfullscreen
      credentialless
      sandbox="allow-scripts"
      referrerpolicy="no-referrer"
    />
  </div>
</template>
