import { toolRouter } from "@/server/api/routers/toolRouter";
import { postRouter } from "@/server/api/routers/postRouter";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tool: toolRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
