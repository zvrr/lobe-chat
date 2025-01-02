/**
 * This file contains the edge router of Lobe Chat tRPC-backend
 */
import { publicProcedure, router } from '@/libs/trpc';

import { appStatusRouter } from './appStatus';
import { configRouter } from './config';
import { uploadRouter } from './upload';

export const edgeRouter = router({
  appStatus: appStatusRouter,
  config: configRouter,
  healthcheck: publicProcedure.query(() => "i'm live!"),
  upload: uploadRouter,
});

export type EdgeRouter = typeof edgeRouter;
