import { toolRouter } from "@/server/api/routers/toolRouter";
import { postRouter } from "@/server/api/routers/postRouter";
import { createTRPCRouter } from "@/server/api/trpc";

// primary router
export const appRouter = createTRPCRouter({
  tool: toolRouter,
  post: postRouter,
});

// type definition of API
export type AppRouter = typeof appRouter;
