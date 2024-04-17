import { req } from './utils';

export async function init_room_id(short_id: number, sessdata?: string) {
  const body = await req<{ data: { room_id: number } }>(
    `https://api.live.bilibili.com/room/v1/Room/room_init?id=${short_id}`,
    'GET',
    sessdata
  );
  return body.data.room_id;
}

export async function room_play_url(room_id: number, sessdata?: string) {
  const u = new URL(
    'https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo'
  );
  u.searchParams.set('room_id', room_id.toString());
  u.searchParams.set('protocol', '0,1');
  u.searchParams.set('format', '1');
  u.searchParams.set('codec', '0,1');
  u.searchParams.set('platform', 'h5');
  const body = await req<any>(u.toString(), 'GET', sessdata);
  const c = body.data.playurl_info.playurl.stream[0].format[0].codec[0];
  return `${c.url_info[0].host}${c.base_url}${c.url_info[0].extra}`;
}
