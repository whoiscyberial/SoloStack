import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure,
} from "@/server/api/trpc";

const TOOL_SORT_TYPES = ["newestFirst", "mostLikedFirst"] as const;

export const toolRouter = createTRPCRouter({
  // TOOL

  getById: publicProcedure
    .input(z.object({ toolId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.tool.findUnique({ where: { id: input.toolId } });
    }),

  getAll: publicProcedure
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

  getBySubcategory: publicProcedure
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

  delete: adminProcedure
    .input(z.object({ toolId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.tool.delete({
        where: {
          id: input.toolId,
        },
      });
    }),
});
