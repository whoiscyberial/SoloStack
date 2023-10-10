import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure,
} from "@/server/api/trpc";

type sortBy = {};

export const postRouter = createTRPCRouter({
  getAll: publicProcedure
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

  getById: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.post.findUnique({ where: { id: input.postId } });
    }),

  delete: adminProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.post.delete({ where: { id: input.postId } });
    }),
});
