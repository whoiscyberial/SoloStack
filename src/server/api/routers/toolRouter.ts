import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure,
} from "@/server/api/trpc";

const Tool = z.object({
  title: z.string().min(3, { message: "Title is required" }),
  description: z
    .string()
    .min(3, { message: "Description is required" })
    .max(9 * 6, { message: "Description is too long" }),
  text: z.string().optional(),
  subcategoryId: z.number().min(1, { message: "Please choose a Subcategory" }),
  link: z.string().url({ message: "Please provide a full link to tool" }),
  creatorId: z.string(),
  verified: z.boolean().default(false),
});

export const TOOL_SORT_TYPES = ["newestFirst", "mostLikedFirst"] as const;

export const toolRouter = createTRPCRouter({
  // TOOL

  create: publicProcedure.input(Tool).mutation(({ ctx, input }) => {
    return ctx.db.tool.create({ data: input });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.tool.findUnique({ where: { id: input.id } });
    }),

  getAll: publicProcedure
    .input(
      z.object({
        sort: z.enum(TOOL_SORT_TYPES),
        verifiedOnly: z.boolean().default(false),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.tool.findMany({
        include: {
          subcategory: {
            select: {
              category: {
                select: { title: true },
              },
              title: true,
              slug: true,
            },
          },
        },

        ...(input.sort === "newestFirst"
          ? {
              orderBy: {
                createdAt: "desc",
              },
            }
          : null),
        ...(input.sort === "mostLikedFirst"
          ? {
              orderBy: {
                favoritesCount: "desc",
              },
            }
          : null),
        ...(input.verifiedOnly === true
          ? {
              where: {
                verified: true,
              },
            }
          : null),
      });
    }),

  getBySubcategory: publicProcedure
    .input(
      z.object({
        subcategoryId: z.number().optional(),
        slug: z.string().optional(),
        sort: z.enum(TOOL_SORT_TYPES),
        verifiedOnly: z.boolean().default(false),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.tool.findMany({
        where: {
          ...(input.slug
            ? {
                subcategory: {
                  slug: input.slug,
                },
              }
            : null),
          ...(input.subcategoryId
            ? {
                subcategoryId: input.subcategoryId,
              }
            : null),
        },
        include: {
          subcategory: {
            select: {
              category: {
                select: { title: true },
              },
              title: true,
              slug: true,
            },
          },
        },
        ...(input.sort === "newestFirst"
          ? {
              orderBy: {
                createdAt: "desc",
              },
            }
          : null),
        ...(input.sort === "mostLikedFirst"
          ? {
              orderBy: {
                favoritesCount: "desc",
              },
            }
          : null),
        ...(input.verifiedOnly === true
          ? {
              where: {
                verified: true,
              },
            }
          : null),
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.tool.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
