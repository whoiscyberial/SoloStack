import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure,
} from "@/server/api/trpc";

type sortBy = {};

export const postRouter = createTRPCRouter({
  getPosts: publicProcedure
    .input(z.object({ sort: z.enum(["newestFirst"]) }))
    .query(({ ctx, input }) => {
      if (input.sort === "newestFirst") {
        return ctx.db.post.findMany({
          select: {
            title: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        });
      }

      // else if (input.sort === ...)
    }),

  getPost: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.post.findUnique({ where: { id: input.postId } });
    }),

  deletePost: adminProcedure
    .input(z.object({ postId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.post.delete({ where: { id: input.postId } });
    }),
});
