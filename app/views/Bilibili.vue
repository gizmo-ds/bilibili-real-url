<script lang="ts" setup>
import {
  useNotification,
  NInput,
  NInputGroup,
  NButton,
  NSelect,
  NCard,
  NAlert
} from 'naive-ui';
import { h, watch, ref } from 'vue';
import { useClipboard } from '@vueuse/core';
import ThemeSwitch from '../components/ThemeSwitch.vue';
import ExternalLink from '../components/ExternalLink.vue';
import BiliPreview from '../components/BiliPreview.vue';
import { trpc } from '../rpc';

const notification = useNotification();

const u = ref('');
const preview = ref('');
const page = ref(1);
const id = ref('');
const pages = ref<any[]>([]);
const loading = ref(false);
const { copy, copied } = useClipboard({ source: preview });
const videoInfo = ref<any | null>(null);
const liveRoomInfo = ref<any | null>(null);

watch(page, p => set_preview(`/${id.value}.mp4` + (p > 0 ? `?p=${p}` : '')));

function parse() {
  preview.value = '';
  pages.value = [];
  liveRoomInfo.value = null;
  videoInfo.value = null;

  const _u = new URL(u.value);
  if (_u.pathname.startsWith('/video')) return parse_video(_u);
  else if (_u.pathname.startsWith('/list')) return parse_video(_u);
  else if (_u.hostname.startsWith('live.')) return parse_live(u.value);
  else
    return notification.error({
      title: '解析失败',
      content: '不支持该链接',
      duration: 5000,
      meta: u.value
    });
}

function parse_video(u: URL) {
  let p = parseInt(u.searchParams.get('p') ?? '1');
  if (Number.isNaN(p)) p = 1;
  const _url = u.toString();
  id.value =
    u.searchParams.get('bvid') ??
    /av[0-9]+/gi.exec(u.pathname)?.[0] ??
    /bv\w+/gi.exec(u.pathname)?.[0] ??
    '';
  if (id.value === '') {
  }
  loading.value = true;
  trpc.getVideoInfo
    .query({ id: id.value })
    .finally(() => (loading.value = false))
    .then(result => {
      if (result.code !== 0)
        return notification.error({
          title: '解析失败',
          content: result.message,
          duration: 5000,
          meta: _url
        });

      videoInfo.value = result.data;
      page.value = p;

      pages.value = result.data.pages.map((item: any, index: number) => ({
        label: () =>
          h('span', {}, { default: () => `P${index + 1} ${item.part}` }),
        value: index + 1
      }));

      if (p > result.data.pages.length) return;
      if (p === page.value) {
        const query = new URLSearchParams();
        if (p > 1) query.set('p', p.toString());
        set_preview(`/${id.value}.mp4`, query);
      }
    });
}

function parse_live(_url: string) {
  id.value = /[0-9]+/g.exec(_url)?.[0] ?? '';
  if (!id.value || id.value === '') return;
  const room_id = parseInt(id.value);
  if (Number.isNaN(room_id)) {
    return;
  }

  loading.value = true;
  trpc.getRoomInfo
    .query(room_id)
    .finally(() => (loading.value = false))
    .then(result => {
      if (Array.isArray(result))
        return notification.error({
          title: '解析失败',
          content: '直播间不存在',
          duration: 5000,
          meta: _url
        });
      liveRoomInfo.value = result;
      if (result.live_status === 1) set_preview(`/${result.room_id}.m3u8`);
    });
}

function set_preview(path: string, query?: URLSearchParams) {
  const u = new URL(path, location.origin);
  if (query) u.search = query.toString();
  preview.value = u.toString();
}

function URLcanParse(u: string) {
  return URL.canParse(u);
}
</script>

<template>
  <n-card>
    <div class="flex flex-col gap-row-8px gap-col-12px">
      <div class="flex flex-row justify-between pb-2">
        <div class="line-height-22px flex flex-row gap-col-8px">
          <n-button
            text
            type="primary"
            @click="u = 'https://www.bilibili.com/video/BV1Mx4y137fa/'"
          >
            普通视频
          </n-button>
          <n-button
            text
            type="primary"
            @click="u = 'https://www.bilibili.com/video/BV1ms411b7Ph/'"
          >
            分P视频
          </n-button>
          <n-button
            text
            type="primary"
            @click="u = 'https://live.bilibili.com/5555734'"
          >
            直播链接
          </n-button>
        </div>
        <theme-switch />
      </div>

      <n-input-group>
        <n-input
          placeholder="请输入视频或直播链接"
          v-model:value="u"
          clearable
        />
        <n-button
          type="primary"
          :disabled="u === '' || !URLcanParse(u) || loading"
          @click="parse"
        >
          解析链接
        </n-button>
      </n-input-group>

      <div v-if="videoInfo?.title" class="font-size-16px font-bold">
        <span>{{ videoInfo?.title }}</span>
        <external-link
          :href="`https://www.bilibili.com/video/${id}?p=${page}`"
        />
      </div>
      <div v-if="videoInfo?.owner.name" class="line-height-loose">
        <span>作者：{{ videoInfo?.owner.name }}</span>
        <external-link
          :href="`https://space.bilibili.com/${videoInfo?.owner.mid}`"
        />
      </div>
      <div v-if="liveRoomInfo?.title" class="font-size-16px font-bold">
        <span>{{ liveRoomInfo?.title }}</span>
        <external-link :href="`https://live.bilibili.com/${id}`" />
      </div>

      <n-alert
        v-if="liveRoomInfo && liveRoomInfo.live_status === 0"
        type="warning"
      >
        该直播间当前未开播
      </n-alert>
      <n-alert
        v-else-if="liveRoomInfo && liveRoomInfo.live_status === 2"
        type="warning"
      >
        该直播间当前轮播中, 当前不支持解析轮播
      </n-alert>

      <n-select v-if="pages.length > 1" v-model:value="page" :options="pages" />

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

      <bili-preview
        v-if="preview"
        :preview="preview"
        :poster="videoInfo?.pic ?? liveRoomInfo?.user_cover"
      />
    </div>
  </n-card>
</template>
