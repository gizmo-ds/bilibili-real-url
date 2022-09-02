import { ConnInfo, json, PathParams } from "./deps.ts";
import { IDUTIL, cors_headers } from "./utils/mod.ts";

const idutil = new IDUTIL();

export async function biliVideoInfo(
  _req: Request,
  _conn: ConnInfo,
  params: PathParams
) {
  let { id } = params ?? {};
  if (id.toLowerCase().indexOf("av") === 0)
    id = idutil.av2bv(parseInt(id.replace(/[^0-9]/gu, "")));
  if (id.toLowerCase().indexOf("bv") !== 0)
    return new Response("Bad Request", {
      status: 400,
      headers: cors_headers,
    });
  return json(await _biliVideoInfo(id));
}

export async function biliVideo(
  req: Request,
  _conn: ConnInfo,
  params: PathParams
) {
  const { id } = params ?? {};
  let cid = new URL(req.url).searchParams.get("cid");
  const p = parseInt(new URL(req.url).searchParams.get("p")!);
  const bvid =
    id.toLowerCase().indexOf("bv") === 0
      ? id
      : idutil.av2bv(parseInt(id.replace(/[^0-9]/gu, "")));
  const avid = parseInt(idutil.bv2av(bvid).replace(/[^0-9]/gu, ""));
  if (!cid) {
    const info = await _biliVideoInfo(bvid);
    cid = info.pages[p ? p - 1 : 0].cid;
  }
  return Response.redirect(await _biliVideo(avid, parseInt(cid!)), 302);
}

async function _biliVideo(avid: number, cid: number) {
  const body = await fetch(
    `https://api.bilibili.com/x/player/playurl?avid=${avid}&cid=${cid}&qn=1&type=&otype=json&platform=html5&high_quality=1`
  ).then((resp) => resp.json());
  return body.data.durl[0].url;
}

async function _biliVideoInfo(bvid: string) {
  const body = await fetch(
    `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`
  ).then((resp) => resp.json());
  return {
    error: body.code !== 0 ? body.message : undefined,
    title: body?.data?.title,
    author: body?.data?.owner?.name,
    mid: body?.data?.owner?.mid,
    pic: body?.data?.pic,
    aid: body?.data?.aid,
    pages: body?.data?.pages,
  };
}
