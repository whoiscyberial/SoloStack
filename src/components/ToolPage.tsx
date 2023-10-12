import { api } from "@/utils/api";
import { motion } from "framer-motion";
import React from "react";
import LoadingSpinner from "./ui/LoadingSpinner";
import Button from "./ui/Button";
import Link from "next/link";

type ToolPage = {
  subcategorySlug: string;
  toolId: number;
};

const ToolPage = ({ subcategorySlug, toolId }: ToolPage) => {
  const tool = api.tool.getById.useQuery(
    { id: toolId },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      cacheTime: 24 * 60 * 60 * 1000,
      staleTime: 24 * 60 * 60 * 1000,
      retry: 1,
    },
  );

  if (!tool.data) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-w-[360px] max-w-[640px] flex-col"
    >
      <Link
        href={`/${subcategorySlug}`}
        className="mb-[32px] transition-all dark:text-neutral-500 dark:hover:text-neutral-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
          />
        </svg>
      </Link>
      <h2>{tool.data.title}</h2>
      <span className="mt-1">{tool.data.description}</span>
      {tool.data.text && (
        <div className="mt-10">
          <h3 className="">About</h3>
          <p className="mb-1 mt-1 dark:text-neutral-300">{tool.data.text}</p>
        </div>
      )}
      <Button className="mt-4" href={tool.data.link}>
        Check out {tool.data.title}
      </Button>
    </motion.div>
  );
};

export default ToolPage;
