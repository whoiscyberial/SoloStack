import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure,
} from "@/server/api/trpc";

const Subcategory = z.object({ title: z.string(), categoryId: z.number() });

export const subcategoryRouter = createTRPCRouter({
  // CATEGORY

  create: adminProcedure.input(Subcategory).mutation(({ ctx, input }) => {
    return ctx.db.subcategory.create({ data: input });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.subcategory.findMany({
      include: { category: true },
    });
  }),

  update: adminProcedure
    .input(Subcategory.extend({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.subcategory.update({
        where: { id: input.id },
        data: input,
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.subcategory.delete({ where: { id: input.id } });
    }),
});
