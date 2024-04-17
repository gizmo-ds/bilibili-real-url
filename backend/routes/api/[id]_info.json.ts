import { vid2bv } from '@/backend/bilibili/utils';
import { video_info } from '@/backend/bilibili/video';

const token = process.env['SESSDATA'];

export default eventHandler(async e => {
  const bvid = vid2bv(e.context.params['id_info.json'].slice(0, -10));
  return await video_info(bvid, token);
});
