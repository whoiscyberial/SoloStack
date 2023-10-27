import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { type Tool } from "@prisma/client";
import Switch from "../ui/Switch";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { api } from "@/utils/api";
import useUserStore from "@/store/userStore";
import notification from "../ui/notification";
// import { type ToolSchema } from "./ToolForm";

// PROPS FOR OLD METHOD
// const ToolsListPropsZod = z.object({
//   subcategoryId: z.number().optional(),
//   subcategorySlug: z.string().optional(),
//   sort: z.enum(["newestFirst", "mostLikedFirst"] as const),
// });

// PROPS FOR NEW METHOD
export type ToolArray = Array<
  Tool & { subcategory: { title: string; slug: string } }
>;
type ToolWithAddons = Tool & { subcategory: { title: string; slug: string } };
type ToolsListProps = {
  data: ToolArray;
  subcategorySlug: string;
};

const ToolsList = ({ data, subcategorySlug }: ToolsListProps) => {
  const favoriteTools = useUserStore((state) => state.favoriteTools);
  const favoriteIds: Array<number> = [];
  favoriteTools.map((tool) => {
    favoriteIds.push(tool.id);
  });

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
          if (subcategorySlug === "favorites") {
            return true;
          }
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
          return <Tool tool={tool} key={tool.id} favoriteIds={favoriteIds} />;
        })}
      </div>
    </motion.div>
  );
};

const Tool = ({
  tool,
  favoriteIds,
}: {
  tool: ToolWithAddons;
  favoriteIds: Array<number>;
}) => {
  const [favoritesCount, setFavoritesCount] = useState(tool.favoritesCount);
  return (
    <Link
      href={`/${tool.subcategory.slug}/${tool.id}`}
      key={tool.id}
      className={`flex w-full flex-row items-center justify-between gap-1  border-b border-neutral-800 px-4 py-3 text-start transition-all hover:bg-neutral-800 md:rounded-md md:border-b md:border-transparent md:py-2`}
    >
      <section className="flex w-full flex-row gap-1">
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
      </section>
      <section className="flex items-center gap-2">
        <Like
          toolId={tool.id}
          active={favoriteIds.includes(tool.id)}
          setFavoritesCount={setFavoritesCount}
          favoritesCount={favoritesCount}
        />
        <span className="text-[0.9rem] font-medium text-neutral-600">
          {favoritesCount}
        </span>
      </section>
    </Link>
  );
};

const Like = ({
  toolId,
  active,
  favoritesCount,
  setFavoritesCount,
}: {
  toolId: number;
  favoritesCount: number;
  active: boolean;
  setFavoritesCount: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [activeState, setActiveState] = useState(active);
  // add to favorites:
  const addToFavoritesMutation = api.user.addToFavorites.useMutation();
  const addToFavorites = (id: number) => {
    addToFavoritesMutation.mutate({ toolId: id });
    setActiveState(true);
    setFavoritesCount(favoritesCount + 1);
  };

  // delete from favorites:
  const deleteFromFavoritesMutation =
    api.user.deleteFromFavorites.useMutation();
  const deleteFromFavorites = (id: number) => {
    deleteFromFavoritesMutation.mutate({ toolId: id });
    setActiveState(false);
    setFavoritesCount(favoritesCount - 1);
  };

  return (
    <button
      className={`flex items-center justify-center`}
      onClick={(e) => {
        // add to favorites:
        e.preventDefault();
        if (
          deleteFromFavoritesMutation.isLoading ||
          addToFavoritesMutation.isLoading
        ) {
          notification("Too much requests. Please try again in 10 seconds.");
        } else {
          activeState ? deleteFromFavorites(toolId) : addToFavorites(toolId);
        }
      }}
    >
      <LikeIcon active={activeState} />
    </button>
  );
};

const LikeIcon = ({ active }: { active: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`${
        active
          ? "fill-red-800 stroke-red-800 hover:fill-red-700 hover:stroke-red-700"
          : ""
      } h-7 w-7 text-neutral-600 outline-none transition-all hover:text-neutral-200 focus:outline-none`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
};

export default ToolsList;
