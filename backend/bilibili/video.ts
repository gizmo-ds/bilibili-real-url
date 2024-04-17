import { req, BVID } from './utils';

export async function video_info(bvid: BVID, sessdata?: string) {
  const body = await req<{
    code: number;
    message: string;
    data: {
      title: string;
      owner: { name: string; mid: number };
      pic: string;
      aid: number;
      pages: { cid: number }[];
    };
  }>(
    `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
    'GET',
    sessdata
  );
  return {
    error: body.code !== 0 ? body.message : undefined,
    title: body?.data?.title,
    author: body?.data?.owner?.name,
    mid: body?.data?.owner?.mid,
    pic: body?.data?.pic,
    aid: body?.data?.aid,
    pages: body?.data?.pages
  };
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
