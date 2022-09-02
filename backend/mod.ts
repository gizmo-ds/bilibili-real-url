import "https://deno.land/std@0.147.0/dotenv/load.ts";
import { biliVideo, biliVideoInfo } from "./video.ts";
import { serve, serveStatic } from "./deps.ts";
import { biliLive } from "./live.ts";

serve(
  {
    "/bilibili/:id.json": biliVideoInfo,
    "/bilibili/:id.mp4": biliVideo,
    "/bilibili/:id.m3u8": biliLive,

    "/": serveStatic("../public/index.html", { baseUrl: import.meta.url }),
    "/:filename+": serveStatic("../public", { baseUrl: import.meta.url }),
  },
  { port: 8080 }
);
