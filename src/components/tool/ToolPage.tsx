import { api } from "@/utils/api";
import { motion } from "framer-motion";
import React from "react";
import Button from "../ui/Button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { TRPCError } from "@trpc/server";
import EditToolButton from "./EditToolButton";
import { type ToolSchema } from "./ToolForm";
import DeleteToolButton from "./DeleteToolButton";
import LoadingOverlay from "../ui/LoadingOverlay";
import Head from "next/head";

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
    return <LoadingOverlay />;
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
    <>
      <Head>
        <title>{`${tool.title} | Solostack`}</title>
        <meta
          name="description"
          content={`Introduction to ${tool.title} for indie hackers, startups, and business owners by Solostack.`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-w-[360px] max-w-[640px] flex-col md:my-auto"
      >
        <nav className="mb-[32px] flex items-center gap-4">
          <Link
            href={`/${subcategorySlug}`}
            className="transition-all dark:text-neutral-500 dark:hover:text-neutral-200"
          >
            <BackIcon />
          </Link>
          <EditToolButton tool={tool} title="Edit tool" />
          <DeleteToolButton toolId={tool.id} title="Delete tool" />
        </nav>
        <section className="flex gap-1">
          <h2 className="tracking-tight text-neutral-300">
            {tool.title.toUpperCase()}
          </h2>
        </section>
        <span className="mt-1 text-neutral-400/70">{tool.description}</span>
        {tool.text && (
          <div className="mt-6">
            {/* <h2 className="text-center text-lg leading-5 tracking-tight text-neutral-500">
              ABOUT {tool.title.toLocaleUpperCase()}
            </h2> */}
            <p
              style={{ whiteSpace: "pre-line" }}
              className="mb-1 mt-1 text-justify dark:text-neutral-300 md:leading-6"
            >
              {tool.text}
            </p>
          </div>
        )}
        <Button className="mt-6" href={tool.link}>
          Visit {tool.title}
        </Button>
      </motion.div>
    </>
  );
};

const BackIcon = () => {
  return (
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
  );
};

export default ToolPage;
