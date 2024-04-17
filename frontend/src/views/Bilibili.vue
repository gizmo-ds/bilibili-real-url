<script lang="ts" setup>
import { useNotification } from 'naive-ui';
import { h, watch, computed, ref } from 'vue';
import { Sun } from '@vicons/tabler';
import { useClipboard } from '@vueuse/core';

const props = defineProps({
  isDark: Boolean,
  toggleDark: Function
});

const notification = useNotification();

const u = ref('');
const preview = ref('');
const page = ref(1);
const id = ref('');
const title = ref('');
const author = ref('');
const pages = ref([]);
const parse_type = ref('video');
const loading = ref(false);
const { copy, copied } = useClipboard({ source: preview });

watch(page, p => {
  return (preview.value = `/${id.value}.mp4` + (p > 0 ? `?p=${p}` : ''));
});

const parse = () => {
  const _u = new URL(u.value);
  const p = _u.searchParams.get('p');

  if (_u.pathname.indexOf('/video') !== -1)
    return parse_video(u.value, parseInt(p ?? '1'));
  if (_u.hostname.indexOf('live.') !== -1) return parse_live(u.value);
};

function parse_video(_url: string, _p: number) {
  parse_type.value = 'video';
  if (isNaN(_p)) _p = 1;
  id.value = /av[0-9]+/gi.exec(_url)?.[0] ?? /bv\w+/gi.exec(_url)?.[0] ?? '';
  loading.value = true;
  fetch(`/api/${id.value}_info.json`)
    .finally(() => (loading.value = false))
    .then(resp => resp.json())
    .then(body => {
      if (body.error)
        return notification.error({
          title: '解析失败',
          content: body.error,
          duration: 5000,
          meta: _url
        });

      [title.value, author.value, page.value] = [body.title, body.author, _p];
      pages.value = body.pages.map((item: any, index: number) => ({
        label: () =>
          h('span', {}, { default: () => `P${index + 1} ${item.part}` }),
        value: index + 1
      }));
      if (_p > body.pages.length) return;
      if (_p === page.value) {
        const query = new URLSearchParams();
        if (_p > 1) query.set('p', _p.toString());
        set_preview(`/${id.value}.mp4`, query);
      }
    });
}
function parse_live(_url: string) {
  id.value = /[0-9]+/g.exec(_url)?.[0] ?? '';
  if (!id.value || id.value === '') return;
  parse_type.value = 'live';
  [preview.value, title.value, author.value] = '';
  pages.value = [];
  set_preview(`/${id.value}.m3u8`);
}
function set_preview(path: string, query?: URLSearchParams) {
  const u = new URL(path, location.origin);
  if (query) u.search = query.toString();
  preview.value = u.toString();
}
function toggle_dark(v: boolean) {
  props.toggleDark!(v);
}
</script>

<template>
  <n-card>
    <template #header>
      <n-tabs v-model:value="parse_type">
        <n-tab-pane name="video" tab="视频"> </n-tab-pane>
        <n-tab-pane name="live" tab="直播"> </n-tab-pane>
      </n-tabs>
    </template>
    <template #header-extra>
      <n-icon size="18px" :style="{ paddingRight: '5px' }">
        <sun />
      </n-icon>
      <!-- @ts-ignore -->
      <n-switch
        size="small"
        :value="isDark"
        @update:value="toggle_dark"
        :checked-value="false"
        :unchecked-value="true"
      />
    </template>

    <n-space vertical>
      <n-input-group>
        <n-input
          :placeholder="
            '如：' +
            (parse_type === 'video'
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
        <n-input v-model:value="preview" readonly />
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
