import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure,
} from "@/server/api/trpc";

const TOOL_SORT_TYPES = ["newestFirst", "mostLikedFirst"] as const;

export const toolRouter = createTRPCRouter({
  // CATEGORY

  getCategories: publicProcedure.query(({ ctx }) => {
    return ctx.db.category.findMany();
  }),

  deleteCategory: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.category.delete({
        where: { id: input.id },
      });
    }),

  // SUBCATEGORY

  getSubcategories: publicProcedure.query(({ ctx }) => {
    return ctx.db.subcategory.findMany();
  }),

  deleteSubcategory: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.subcategory.delete({
        where: { id: input.id },
      });
    }),

  // TOOL

  getTool: publicProcedure
    .input(z.object({ toolId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.tool.findUnique({ where: { id: input.toolId } });
    }),

  getTools: publicProcedure
    .input(
      z.object({
        sort: z.enum(TOOL_SORT_TYPES),
      }),
    )
    .query(({ ctx, input }) => {
      if (input.sort === "newestFirst") {
        return ctx.db.tool.findMany({
          select: {
            title: true,
            description: true,
            favorites: true,
            id: true,
            subcategory: { select: { title: true } },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } else if (input.sort === "mostLikedFirst") {
        return ctx.db.tool.findMany({
          select: {
            title: true,
            description: true,
            favorites: true,
            id: true,
            subcategory: { select: { title: true } },
          },
          orderBy: {
            favoritesCount: "desc",
          },
        });
      }
    }),

  getToolsBySubcategory: publicProcedure
    .input(
      z.object({
        subcategoryId: z.number(),
        sort: z.enum(TOOL_SORT_TYPES),
      }),
    )
    .query(({ ctx, input }) => {
      if (input.sort === "newestFirst") {
        return ctx.db.tool.findMany({
          where: {
            subcategoryId: input.subcategoryId,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } else if (input.sort === "mostLikedFirst") {
        return ctx.db.tool.findMany({
          where: {
            subcategoryId: input.subcategoryId,
          },
          orderBy: {
            favoritesCount: "desc",
          },
        });
      }
    }),

  deleteTool: adminProcedure
    .input(z.object({ toolId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.tool.delete({
        where: {
          id: input.toolId,
        },
      });
    }),
});
