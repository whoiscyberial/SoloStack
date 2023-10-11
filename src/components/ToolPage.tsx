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
      <div className="flex items-center  gap-4">
        <h2>{tool.data.title}</h2>
        <span>{tool.data.verified ? <Verified /> : <NotVerified />}</span>
      </div>
      <span className="mt-1">{tool.data.description}</span>
      {tool.data.text && (
        <p className="mb-4 mt-10 dark:text-neutral-300">{tool.data.text}</p>
      )}
      <Button href={tool.data.link}>Check out {tool.data.title}</Button>
    </motion.div>
  );
};

const Verified = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="-mx-3 -my-6 h-7 w-7 transition-all dark:text-neutral-500 dark:hover:text-emerald-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
      />
    </svg>
  );
};

const NotVerified = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="-mx-3 -my-6 h-7 w-7  transition-all dark:text-neutral-500 dark:hover:text-red-600"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

export default ToolPage;
