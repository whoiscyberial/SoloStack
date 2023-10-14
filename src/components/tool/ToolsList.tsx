import { api } from "@/utils/api";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import Link from "next/link";
import { z } from "zod";
import { motion } from "framer-motion";
import useMobile from "@/utils/useMobile";
import { type Tool } from "@prisma/client";
import Switch from "../ui/Switch";
import { useSession } from "next-auth/react";

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
  const fetchTools = api.tool.getBySubcategory.useQuery(
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

  const { data: sessionData } = useSession();
  const [tools, setTools] = useState<
    Array<Tool & { subcategory: { title: string; slug: string } }>
  >([]);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(true);
  useEffect(() => {
    if (fetchTools.data) {
      setTools(
        fetchTools.data.filter((value) => {
          return value.verified === showVerifiedOnly;
        }),
      );
    }
  }, [showVerifiedOnly, subcategorySlug, subcategoryId, fetchTools.isSuccess]);

  const isMobile = useMobile();

  if (!fetchTools.data) {
    return <LoadingSpinner />;
  }

  if (fetchTools.data.length === 0) {
    return <p>No tools in this subcategory</p>;
  }

  return (
    <motion.div
      key={tools[0]?.subcategory.slug}
      initial={{ opacity: 0, translateY: 30 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -30 }}
      transition={{ duration: 0.7 }}
      className="flex w-full max-w-[1280px] flex-col justify-center"
    >
      <h2 className="mb-8 w-full lg:mb-12">{tools[0]?.subcategory.title}</h2>
      {sessionData?.user.role === "ADMIN" && (
        <Switch
          className="mb-4"
          state={showVerifiedOnly}
          setState={setShowVerifiedOnly}
        />
      )}
      <div
        className={`grid w-full max-w-[1280px] grid-cols-1 gap-x-2  lg:grid-cols-2 xl:grid-cols-3 ${
          isMobile ? "" : "gap-y-4"
        }`}
      >
        {tools.map((tool) => {
          return (
            <Link
              key={tool.id}
              href={`/${tool.subcategory.slug}/${tool.id}`}
              className={`flex w-full flex-col items-start justify-center gap-1  px-4 text-start transition-all hover:bg-neutral-800 ${
                isMobile
                  ? "border-b border-neutral-800 py-3"
                  : "rounded-md border-b border-transparent py-2 "
              }`}
            >
              <h3>{tool.title}</h3>{" "}
              <span className="text-neutral-500">
                {tool.description}{" "}
                {tool.verified ? "(verified)" : "(not verified)"}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ToolsList;
