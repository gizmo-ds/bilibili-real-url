import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/trpc/api-router';

export const trpc = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: '/rpc' })]
});
