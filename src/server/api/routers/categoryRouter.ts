import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "@/server/api/trpc";

const Category = z.object({ title: z.string() });

export const categoryRouter = createTRPCRouter({
  // CATEGORY

  create: adminProcedure.input(Category).mutation(({ ctx, input }) => {
    return ctx.db.category.create({ data: input });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.category.findMany({
      include: {
        subcategories: true,
      },
    });
  }),

  update: adminProcedure
    .input(Category.extend({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.category.update({ where: { id: input.id }, data: input });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.category.delete({ where: { id: input.id } });
    }),
});
