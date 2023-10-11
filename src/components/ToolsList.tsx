import { api } from "@/utils/api";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "./ui/LoadingSpinner";
import Link from "next/link";
import { z } from "zod";
import { Tool } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";

const ToolsListPropsZod = z.object({
  subcategoryId: z.number().optional(),
  subcategorySlug: z.string().optional(),
  sort: z.enum(["newestFirst", "mostLikedFirst"] as const),
});

const ToolsList = ({
  subcategoryId,
  subcategorySlug,
  sort,
}: z.infer<typeof ToolsListPropsZod>) => {
  const tools = api.tool.getBySubcategory.useQuery(
    {
      ...(subcategoryId ? { subcategoryId: subcategoryId } : null),
      ...(subcategorySlug ? { slug: subcategorySlug } : null),
      sort: sort,
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      cacheTime: 1 * 60 * 60 * 1000,
      staleTime: 1 * 60 * 60 * 1000,
      retry: 1,
    },
  );

  if (!tools.data) {
    return <LoadingSpinner />;
  }

  if (tools.data.length === 0) {
    return <p>No tools in this subcategory</p>;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="grid w-full max-w-[1280px] grid-cols-1 gap-x-2 gap-y-4 lg:grid-cols-2 xl:grid-cols-3"
      >
        {tools.data.map((tool) => {
          return (
            <Link
              key={tool.id}
              href={`/${tool.subcategory.slug}/${tool.id}`}
              className="flex w-full flex-col items-start justify-center gap-1 rounded-md px-4 py-2 text-start transition-all hover:bg-neutral-800"
            >
              <h3>{tool.title}</h3>
              <span className="text-neutral-500">
                {tool.description}{" "}
                {tool.verified ? "(verified)" : "(not verified)"}
              </span>
            </Link>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};

export default ToolsList;
