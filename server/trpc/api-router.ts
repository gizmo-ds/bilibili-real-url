import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { video_info } from '../bilibili/video';
import { vid2bv } from '../bilibili/utils';
import { room_info } from '../bilibili/live';

export const appRouter = router({
  getVideoInfo: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async opts => {
      const { input } = opts;
      const bvid = vid2bv(input.id);
      return video_info(bvid);
    }),
  getRoomInfo: publicProcedure.input(z.number()).query(async opts => {
    const { input } = opts;
    return room_info(input);
  })
});

export type AppRouter = typeof appRouter;
