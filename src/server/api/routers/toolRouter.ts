import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure,
} from "@/server/api/trpc";
import { createRateLimiter } from "@/server/redis";
import { TRPCError } from "@trpc/server";

// types for query inputs
const Tool = z.object({
  title: z.string().min(3, { message: "Title is required" }),
  description: z
    .string()
    .min(3, { message: "Description is required" })
    .max(9 * 6, { message: "Description is too long" }),
  subcategoryId: z.number().min(1, { message: "Please choose a Subcategory" }),
  link: z.string().url({ message: "Please provide a full link to tool" }),
  creatorId: z.string(),
  verified: z.boolean().default(false),
  logoUrl: z.string().url().optional(),
});
const ToolWithId = Tool.merge(z.object({ id: z.number() }));
const TOOL_SORT_TYPES = ["newestFirst", "mostLikedFirst"] as const;
const TOOL_VERIFICATION = ["VERIFIED", "NOT_VERIFIED"] as const;

export const toolRouter = createTRPCRouter({
  create: protectedProcedure.input(Tool).mutation(async ({ ctx, input }) => {
    if (ctx.session.user.role == "BANNED") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    if (ctx.session.user.role != "ADMIN") {
      const { success } = await createRateLimiter.limit(ctx.session.user.id);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
    }
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
        verification: z.enum(TOOL_VERIFICATION).optional(),
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
          favorites: {
            select: {
              id: true,
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
                favorites: { _count: "desc" },
              },
            }
          : null),
        ...(input.verification === "VERIFIED"
          ? {
              where: {
                verified: true,
              },
            }
          : null),
        ...(input.verification === "NOT_VERIFIED"
          ? {
              where: {
                verified: false,
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
        verification: z.enum(TOOL_VERIFICATION).optional(),
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
                favorites: { _count: "desc" },
              },
            }
          : null),
        ...(input.verification === "VERIFIED"
          ? {
              where: {
                verified: true,
              },
            }
          : null),
        ...(input.verification === "NOT_VERIFIED"
          ? {
              where: {
                verified: false,
              },
            }
          : null),
      });
    }),

  update: protectedProcedure.input(ToolWithId).mutation(({ ctx, input }) => {
    return ctx.db.tool.update({ where: { id: input.id }, data: input });
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
