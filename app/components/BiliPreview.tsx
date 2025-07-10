import {
  defineComponent,
  computed,
  ref,
  onMounted,
  onUnmounted,
  type Ref
} from 'vue';

export default defineComponent<{
  preview?: string;
  poster?: string;
}>(
  props => {
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

    onUnmounted(() => (showLivePreview.value = false));

    return () => (
      <>
        {props.preview &&
          preview_url.value?.pathname.endsWith('.mp4') &&
          videoPreview(props.preview, poster_url.value)}

        {props.preview &&
          preview_url.value?.pathname.endsWith('.m3u8') &&
          hlsplayer_url.value &&
          livePreview(showLivePreview, hlsplayer_url.value, poster_url.value)}
      </>
    );
  },
  {
    props: ['preview', 'poster']
  }
);

function videoPreview(preview: string, poster_url?: string) {
  return (
    <video
      class="w-full rounded-3px"
      controls
      loop
      crossorigin="anonymous"
      src={preview}
      poster={poster_url}
    />
  );
}

function livePreview(
  show: Ref<boolean>,
  hlsplayer_url: string,
  poster_url?: string
) {
  return !show.value ? (
    <div
      class="w-full min-h-350px cursor-pointer"
      onClick={() => (show.value = true)}
    >
      <img src={poster_url} class="w-full rounded-3px" />
      <div class="float-start">
        <span class="absolute left-[calc(50%-35px)] top-[calc(50%+35px)]">
          <div class="i-tabler-circle-caret-right w-70px h-70px"></div>
        </span>
      </div>
    </div>
  ) : (
    <iframe
      class="w-full min-h-400px border-0 rounded-3px"
      src={hlsplayer_url}
      allowfullscreen
      sandbox="allow-scripts"
      referrerpolicy="no-referrer"
    />
  );
}
