import { ConnInfo, PathParams } from "./deps.ts";
import { cors_headers } from "./utils/mod.ts";

async function _roomId(id: string) {
  const body = await fetch(
    `https://api.live.bilibili.com/room/v1/Room/room_init?id=${id}`
  ).then((resp) => resp.json());
  return body.data.room_id;
}

async function _live(room_id: number) {
  const body = await fetch(
    `https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${room_id}&protocol=1&format=1&codec=0,1&platform=h5`
  ).then((resp) => resp.json());
  const c = body.data.playurl_info.playurl.stream[0].format[0].codec[0];
  return `${c.url_info[0].host}${c.base_url}${c.url_info[0].extra}`;
}

export async function biliLive(
  _req: Request,
  _conn: ConnInfo,
  params: PathParams
) {
  const { id } = params ?? {};
  const room_id = await _roomId(id);
  if (room_id === "")
    return new Response("Bad Request", {
      status: 400,
      headers: cors_headers,
    });
  return Response.redirect(await _live(room_id), 302);
}
