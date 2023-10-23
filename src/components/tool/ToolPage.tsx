import { api } from "@/utils/api";
import { motion } from "framer-motion";
import React from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import Button from "../ui/Button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { TRPCError } from "@trpc/server";
import EditToolButton from "./EditToolButton";
import { type ToolSchema } from "./ToolForm";

type ToolPage = {
  subcategorySlug: string;
  toolId: number;
};

const ToolPage = ({ subcategorySlug, toolId }: ToolPage) => {
  const { data: sessionData } = useSession();
  const fetchTool = api.tool.getById.useQuery(
    { id: toolId },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      cacheTime: 24 * 60 * 60 * 1000,
      staleTime: 24 * 60 * 60 * 1000,
      retry: 1,
    },
  );

  if (!fetchTool.data) {
    return <LoadingSpinner />;
  }

  if (fetchTool.data.verified === false && sessionData?.user.role != "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  const data = fetchTool.data;
  const tool: ToolSchema = {
    id: data.id,
    title: data.title,
    description: data.description,
    link: data.link,
    subcategoryId: data.subcategoryId.toString(),
    ...(data.text ? { text: data.text } : null),
  };

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
      <section className="flex gap-4">
        <h2>{tool.title}</h2>
        <EditToolButton
          className="border-none px-2 py-2 hover:dark:bg-transparent"
          tool={tool}
          title="Edit tool"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="-mb-[1px] h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </EditToolButton>
      </section>
      <span className="mt-1 text-neutral-500">{tool.description}</span>
      {tool.text && (
        <div className="mt-10">
          <h3 className="">About</h3>
          <p className="mb-1 mt-1 dark:text-neutral-300 ">{tool.text}</p>
        </div>
      )}
      <Button className="mt-4" href={tool.link}>
        Check out {tool.title}
      </Button>
    </motion.div>
  );
};

export default ToolPage;
