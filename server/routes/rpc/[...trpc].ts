import { defineTRPCEventHandler } from '@falcondev-oss/nitro-trpc-event-handler';
import { appRouter } from '../../trpc/api-router';

export default defineTRPCEventHandler({
  router: appRouter,
  createContext: async _event => {}
});
