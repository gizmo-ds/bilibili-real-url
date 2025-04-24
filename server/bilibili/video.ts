import { req, type BVID } from './utils';

export interface VideoInfo {
  bvid: string;
  aid: number;
  videos: number;
  tid: number;
  tid_v2: number;
  copyright: number; // 1原创 2转载
  pic: string;
  title: string;
  desc: string;
  desc_v2: string;
  owner: { name: string; mid: number };
  pages: VideoPageInfo[];
}
export interface VideoPageInfo {
  cid: number;
  page: number;
  part: string;
}

export async function video_info(bvid: BVID, sessdata?: string) {
  return await req<{
    code: number;
    message: string;
    data: VideoInfo;
  }>(
    `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
    'GET',
    sessdata
  );
}

export async function video_url(bvid: BVID, cid: number, sessdata?: string) {
  const query = new URLSearchParams({
    bvid,
    cid: cid.toString(),
    qn: '80',
    otype: 'json',
    platform: 'html5',
    high_quality: '1'
  });
  const body = await req<{ data: { durl: { url: string }[] } }>(
    'https://api.bilibili.com/x/player/playurl?' + query.toString(),
    'GET',
    sessdata
  );
  return body.data.durl[0].url;
}
