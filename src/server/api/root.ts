import { toolRouter } from "@/server/api/routers/toolRouter";
import { postRouter } from "@/server/api/routers/postRouter";
import { categoryRouter } from "@/server/api/routers/categoryRouter";
import { subcategoryRouter } from "@/server/api/routers/subcategoryRouter";

import { createTRPCRouter } from "@/server/api/trpc";

// primary router
export const appRouter = createTRPCRouter({
  tool: toolRouter,
  post: postRouter,
  category: categoryRouter,
  subcategory: subcategoryRouter,
});

// type definition of API
export type AppRouter = typeof appRouter;
