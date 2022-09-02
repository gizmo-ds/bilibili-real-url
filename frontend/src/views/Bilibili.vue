<script lang="ts" setup>
import { useNotification } from "naive-ui";
import { h, watch, computed } from "vue";
import { Sun } from "@vicons/tabler";
import { useClipboard } from "@vueuse/core";

defineProps({
  isDark: Boolean,
  toggleDark: Function,
});

const notification = useNotification();

let video = $ref(undefined);

let u = $ref("");
let preview = $ref("");
let page = $ref(1);
let id = $ref("");
let title = $ref("");
let author = $ref("");
let pages = $ref([]);
let pType = $ref("video");
let loading = $ref(false);
let nu = computed(() => `${location.origin}${preview}`);
const { copy, copied } = useClipboard({ source: nu });

watch($$(page), (p) => {
  preview = `/bilibili/${id}.mp4?p=${p}`;
});

const parse = () => {
  const _u = new URL(u);
  const p = _u.searchParams.get("p");

  if (_u.pathname.indexOf("/video") !== -1)
    return _parseVideo(u, parseInt(p ?? "1"));
  if (_u.hostname.indexOf("live.") !== -1) return _parseLive(u);
};

function _parseVideo(_url: string, _p: number) {
  pType = "video";
  if (isNaN(_p)) _p = 1;
  id = /av[0-9]+/gi.exec(_url)?.[0] ?? /bv\w+/gi.exec(_url)?.[0] ?? "";
  loading = true;
  fetch(`/bilibili/${id}.json`)
    .finally(() => {
      loading = false;
    })
    .then((resp) => resp.json())
    .then((body) => {
      if (body.error)
        return notification.error({
          title: "解析失败",
          content: body.error,
          duration: 5000,
          meta: _url,
        });

      [title, author, page] = [body.title, body.author, _p];
      pages = body.pages.map((item: any, index: number) => ({
        label: () =>
          h("span", {}, { default: () => `P${index + 1} ${item.part}` }),
        value: index + 1,
      }));
      if (_p > body.pages.length) return;
      if (_p === page) preview = `/bilibili/${id}.mp4?p=${_p}`;
    });
}
function _parseLive(_url: string) {
  id = /[0-9]+/g.exec(_url)?.[0] ?? "";
  if (!id || id === "") return;
  pType = "live";
  [preview, title, author] = "";
  pages = [];
  preview = `/bilibili/live/${id}.m3u8`;
}
</script>

<template>
  <n-card>
    <template #header>
      <n-tabs v-model:value="pType">
        <n-tab-pane name="video" tab="视频"> </n-tab-pane>
        <n-tab-pane name="live" tab="直播"> </n-tab-pane>
      </n-tabs>
    </template>
    <template #header-extra>
      <n-icon size="18px" :style="{ paddingRight: '5px' }">
        <sun />
      </n-icon>
      <n-switch
        size="small"
        :value="isDark"
        @update:value="toggleDark"
        :checked-value="false"
        :unchecked-value="true"
      />
    </template>

    <n-space vertical>
      <n-input-group>
        <n-input
          :placeholder="
            '如：' +
            (pType === 'video'
              ? 'https://www.bilibili.com/video/BV1iF41157gM'
              : 'https://live.bilibili.com/5555734 (不支持轮播)')
          "
          v-model:value="u"
          :loading="loading"
          clearable
        />
        <n-button type="primary" :disabled="u === '' || loading" @click="parse">
          解析链接
        </n-button>
      </n-input-group>

      <n-thing v-if="title" :title="title" :description="'作者：' + author" />

      <n-select v-model:value="page" :options="pages" v-if="pages.length > 0" />

      <n-input-group v-if="preview">
        <n-input v-model:value="nu" readonly />
        <n-button
          type="primary"
          :disabled="u === '' || loading"
          @click="copy()"
        >
          <span v-if="!copied">复制</span>
          <span v-else>复制成功!</span>
        </n-button>
      </n-input-group>

      <video
        controls
        v-if="preview && preview.indexOf('.mp4') > -1"
        :src="preview"
      ></video>
    </n-space>
  </n-card>
</template>

<style lang="scss" scoped>
video {
  width: 100%;
}
</style>

<style>
.n-tab-pane {
  display: none;
}
</style>
