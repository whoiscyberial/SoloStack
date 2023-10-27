import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getFavorites: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { favoriteTools: { include: { subcategory: true } } },
    });
  }),
});
