import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { type Tool } from "@prisma/client";
import Switch from "../ui/Switch";
import { useSession } from "next-auth/react";
import Image from "next/image";
// import { type ToolSchema } from "./ToolForm";

// PROPS FOR OLD METHOD
// const ToolsListPropsZod = z.object({
//   subcategoryId: z.number().optional(),
//   subcategorySlug: z.string().optional(),
//   sort: z.enum(["newestFirst", "mostLikedFirst"] as const),
// });

// PROPS FOR NEW METHOD
type ToolsListProps = {
  data: Array<Tool & { subcategory: { title: string; slug: string } }>;
  subcategorySlug: string;
};

const ToolsList = ({ data, subcategorySlug }: ToolsListProps) => {
  const [tools, setTools] =
    useState<Array<Tool & { subcategory: { title: string; slug: string } }>>(
      data,
    );
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(true);

  useEffect(() => {
    setTools(
      data
        .filter((value) => {
          return value.verified === showVerifiedOnly;
        })
        .filter((value) => {
          return value.subcategory.slug === subcategorySlug;
        }),
    );
  }, [showVerifiedOnly, subcategorySlug]);

  // OLD METHOD TO FETCH DATA (ONE BY ONE SUBCATEGORY)
  // const fetchTools = api.tool.getBySubcategory.useQuery(
  //   {
  //     ...(subcategoryId ? { subcategoryId: subcategoryId } : null),
  //     ...(subcategorySlug ? { slug: subcategorySlug } : null),
  //     sort: sort,
  //   },
  //   {
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //     cacheTime: 1 * 60 * 60 * 1000,
  //     staleTime: 1 * 60 * 60 * 1000,
  //     retry: 1,
  //   },
  // );

  // useEffect(() => {
  //   if (fetchTools.data) {
  //     setTools(
  //       fetchTools.data.filter((value) => {
  //         return value.verified === showVerifiedOnly;
  //       }),
  //     );
  //   }
  // }, [showVerifiedOnly, subcategorySlug, subcategoryId, fetchTools.isSuccess]);

  // if (!fetchTools.data) {
  //   return <LoadingSpinner />;
  // }

  // if (fetchTools.data.length === 0) {
  //   return <p>No tools in this subcategory</p>;
  // }

  const { data: sessionData } = useSession();
  return (
    <motion.div
      key={tools[0]?.subcategory.slug}
      initial={{ opacity: 0, translateY: 30 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -30 }}
      transition={{ duration: 0.7 }}
      className="flex w-full max-w-[1280px] flex-col justify-center"
    >
      <div className="mb-8 w-full lg:mb-12">
        <h2>{tools[0]?.subcategory.title}</h2>
        {sessionData?.user.role === "ADMIN" && (
          <Switch
            className="mt-4"
            state={showVerifiedOnly}
            setState={setShowVerifiedOnly}
            message="Show not verified tools"
          />
        )}
      </div>
      <div
        className={`grid w-full max-w-[1280px] grid-cols-1 gap-x-2  gap-y-4 md:gap-y-0 lg:grid-cols-2 xl:grid-cols-3`}
      >
        {tools.map((tool) => {
          return (
            <Link
              href={`/${tool.subcategory.slug}/${tool.id}`}
              key={tool.id}
              className={`flex w-full flex-row items-start  gap-1  border-b border-neutral-800 px-4 py-3 text-start transition-all hover:bg-neutral-800 md:rounded-md md:border-b md:border-transparent md:py-2`}
            >
              {tool.logoUrl && (
                <Image
                  src={tool.logoUrl as string}
                  height={40}
                  width={40}
                  alt="logo"
                  className="-mt-[2px] mr-2 rounded-md border border-neutral-800"
                />
              )}
              <section>
                <h3 className="mb-[2px]">{tool.title}</h3>
                <span className="text-neutral-400/70">{tool.description}</span>
              </section>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ToolsList;
