import { toolRouter } from "@/server/api/routers/toolRouter";
import { categoryRouter } from "@/server/api/routers/categoryRouter";
import { subcategoryRouter } from "@/server/api/routers/subcategoryRouter";
import { userRouter } from "./routers/userRouter";

import { createTRPCRouter } from "@/server/api/trpc";

// primary router
export const appRouter = createTRPCRouter({
  tool: toolRouter,
  category: categoryRouter,
  subcategory: subcategoryRouter,
  user: userRouter,
});

// type definition of API
export type AppRouter = typeof appRouter;
