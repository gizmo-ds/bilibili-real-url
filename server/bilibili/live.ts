import { req } from './utils';

export interface RoomInfo {
  room_id: number;
  short_id: number;
  uid: number;
  live_status: number; // 0未开播 1直播中 2轮播中
  title: string;
  user_cover: string;
}

export async function room_info(room_id: number, sessdata?: string) {
  const u = new URL('https://api.live.bilibili.com/room/v1/Room/get_info');
  u.searchParams.set('room_id', room_id.toString());
  const body = await req<{
    code: number;
    message: string;
    data: RoomInfo;
  }>(u.toString(), 'GET', sessdata);
  return body.data;
}

export interface RoomPlayInfo {
  room_id: number;
  short_id: number;
  uid: number;
  is_hidden: boolean;
  is_locked: boolean;
  is_portrait: boolean;
  live_status: number; // 0未开播 1直播中 2轮播中
  encrypted: boolean;
  pwd_verified: boolean;
  playurl_info: PlayUrlInfo;
}
export interface PlayUrlInfo {
  conf_json: string;
  playurl: {
    cid: number;
    g_qn_desc: GQnDesc[];
    stream: StreamObject[];
  };
}
export interface GQnDesc {
  qn: number;
  desc: string;
  hdr_desc: string;
}
export interface StreamObject {
  protocol_name: string;
  format: {
    format_name: string;
    codec: Codec[];
  }[];
}
export interface Codec {
  codec_name: string;
  current_qn: number;
  accept_qn: number[];
  base_url: string;
  url_info: {
    host: string;
    extra: string;
    stream_ttl: number;
  }[];
}

export async function room_play_info(room_id: number, sessdata?: string) {
  const u = new URL(
    'https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo'
  );
  u.searchParams.set('room_id', room_id.toString());
  u.searchParams.set('protocol', '0,1');
  u.searchParams.set('format', '1');
  u.searchParams.set('codec', '0,1');
  u.searchParams.set('platform', 'h5');
  return await req<{
    code: number;
    message: string;
    data: RoomPlayInfo;
  }>(u.toString(), 'GET', sessdata);
}

export async function room_play_url(room_id: number, sessdata?: string) {
  const body = await room_play_info(room_id, sessdata);
  const c =
    body.data?.playurl_info?.playurl?.stream?.[0]?.format?.[0]?.codec?.[0];
  if (!c) return '';
  return `${c.url_info[0].host}${c.base_url}${c.url_info[0].extra}`;
}
