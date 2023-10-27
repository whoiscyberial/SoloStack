import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getFavorites: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { favoriteTools: { include: { subcategory: true } } },
    });
  }),

  addToFavorites: protectedProcedure
    .input(z.object({ toolId: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { favoriteTools: { connect: [{ id: input.toolId }] } },
      });
    }),

  deleteFromFavorites: protectedProcedure
    .input(z.object({ toolId: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { favoriteTools: { disconnect: [{ id: input.toolId }] } },
      });
    }),
});
