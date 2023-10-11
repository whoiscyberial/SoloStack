import { api } from "@/utils/api";
import React from "react";
import LoadingSpinner from "./ui/LoadingSpinner";
import Link from "next/link";

const ToolsList = ({ subcategoryId }: { subcategoryId: number }) => {
  const tools = api.tool.getBySubcategory.useQuery(
    { subcategoryId: subcategoryId, sort: "mostLikedFirst" },
    {
      refetchOnWindowFocus: false,
    },
  );

  if (!tools.data) {
    return <LoadingSpinner />;
  }

  return (
    <div className="grid w-full max-w-[1280px] grid-cols-1 gap-x-2 gap-y-4 lg:grid-cols-2 xl:grid-cols-3">
      {tools.data.map((tool) => {
        return (
          <Link
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
    </div>
  );
};

export default ToolsList;
