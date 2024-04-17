import { video_info, video_url } from '@/backend/bilibili/video';
import { vid2bv } from '../bilibili/utils';
import { H3Event, EventHandlerRequest } from 'h3';
import { init_room_id, room_play_url } from '../bilibili/live';

const token = process.env['SESSDATA'];

export default eventHandler(async e => {
  const [id, ext] = e.context.params.id.split('.');
  switch (ext) {
    case 'mp4':
      return await video(e, id);
    case 'm3u8':
      return await live(e, id);
    default:
      return sendError(e, new Error('Unknown ext'));
  }
});

async function video(e: H3Event<EventHandlerRequest>, id: string) {
  const bvid = vid2bv(id);
  const query = new URL(e.node.req.url, `http://${e.node.req.headers['host']}`)
    .searchParams;
  let page = parseInt(query.get('p') ?? '1') - 1;
  if (page < 0) page = 0;
  const info = await video_info(bvid, token);
  const url = await video_url(bvid, info.pages[page].cid, token);
  await sendRedirect(e, url, 302);
}

async function live(e: H3Event<EventHandlerRequest>, id: string) {
  const _id = parseInt(id);
  const room_id = _id < 100 ? await init_room_id(_id) : _id;
  if (isNaN(room_id)) return sendError(e, new Error('Invalid ID'));
  const url = await room_play_url(room_id, token);
  await sendRedirect(e, url, 302);
}
