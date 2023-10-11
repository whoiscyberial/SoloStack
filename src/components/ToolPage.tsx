import { api } from "@/utils/api";
import { motion } from "framer-motion";
import React from "react";
import LoadingSpinner from "./ui/LoadingSpinner";
import Button from "./ui/Button";

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
      className="flex flex-col"
    >
      <div className="flex items-center  gap-4">
        <h2>{tool.data.title}</h2>
        <span>{tool.data.verified ? "(V)" : "(X)"}</span>
      </div>
      <span className="mt-1">{tool.data.description}</span>
      {tool.data.text && <p className="mb-4 mt-10">{tool.data.text}</p>}
      <Button href={tool.data.link}>Check out {tool.data.title}</Button>
    </motion.div>
  );
};

export default ToolPage;
