import {
  eventHandler,
  handleCors,
  sendRedirect,
  sendNoContent,
  send
} from 'h3';
import { vid2bv } from '../bilibili/utils';
import { video_info, video_url } from '../bilibili/video';
import { room_play_url } from '../bilibili/live';

export default eventHandler(async event => {
  if (
    handleCors(event, {
      origin: '*',
      methods: ['GET'],
      preflight: { statusCode: 204 }
    })
  )
    return;

  const [id, ext] = event.context.params!.filename.split('.');
  const searchParams = new URL(event.node.req.url!, 'http://localhost')
    .searchParams;
  switch (ext) {
    case 'mp4': {
      const bvid = vid2bv(id);
      let page = parseInt(searchParams.get('p') ?? '1');
      if (Number.isNaN(page) || page < 1) page = 1;
      const info = await video_info(bvid);
      const url = await video_url(bvid, info.data.pages[page - 1].cid);
      return sendRedirect(event, url, 302);
    }
    case 'm3u8': {
      const room_id = parseInt(id);
      if (Number.isNaN(room_id))
        return send(event, { error: 'Invalid ID' }, 'application/json');
      const url = await room_play_url(room_id);
      return sendRedirect(event, url, 302);
    }
    default:
      return sendNoContent(event, 404);
  }
});
