import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { type Subcategory, type Tool } from "@prisma/client";
import Switch from "../ui/Switch";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { api } from "@/utils/api";
import notification from "../ui/notification";
import useSidebarStore from "@/store/sidebarStore";

export type ToolArray = Array<ToolWithAddons>;

type ToolWithAddons = Tool & {
  subcategory: { title: string; slug: string };
  favorites: Array<{ id: string }>;
};
type ToolsListProps = {
  data: ToolArray;
  subcategory: Subcategory;
};

const ToolsList = ({ data, subcategory }: ToolsListProps) => {
  const [tools, setTools] = useState<Array<ToolWithAddons>>(data);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(true);
  const setActiveSubcategory = useSidebarStore(
    (state) => state.setActiveSubcategory,
  );

  useEffect(() => {
    setActiveSubcategory(subcategory.id);
  }, []);

  useEffect(() => {
    setTools(
      data
        .filter((value) => {
          return value.verified === showVerifiedOnly;
        })
        .filter((value) => {
          if (subcategory.slug === "favorites") {
            return true;
          }
          return value.subcategory.slug === subcategory.slug;
        }),
    );
  }, [showVerifiedOnly, subcategory]);

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
        <h2>{subcategory.title}</h2>
        <Switch
          className="mt-4"
          state={showVerifiedOnly}
          setState={setShowVerifiedOnly}
          firstMessage="Verified"
          secondMessage="Unverified"
        />
        {showVerifiedOnly ? null : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-justify font-mono text-red-500"
          >
            If you decide to use unverified tools, it becomes crucial to rely on
            your risk detection skills. If tool is paid or it requires your
            data, then carefully analyze the tool
            {"'"}s origin, user reviews, and any available information.
          </motion.p>
        )}
      </div>
      <div
        className={`grid w-full max-w-[1280px] grid-cols-1 gap-x-2  gap-y-4 md:gap-y-0 lg:grid-cols-2 xl:grid-cols-3`}
      >
        {tools.map((tool) => {
          return <Tool tool={tool} key={tool.id} />;
        })}
      </div>
    </motion.div>
  );
};

const Tool = ({ tool }: { tool: ToolWithAddons }) => {
  const { data: sessionData } = useSession();
  const [favoritesCount, setFavoritesCount] = useState(tool.favorites.length);
  return (
    <Link
      href={`/${tool.subcategory.slug}/${tool.id}`}
      key={tool.id}
      className={`flex w-full flex-row items-center justify-between gap-1  border-b border-neutral-800 px-4 py-3 text-start transition-all hover:bg-neutral-800 md:rounded-md md:border-b md:border-transparent md:py-2`}
    >
      <section className="flex w-full flex-row items-center gap-1">
        {tool.logoUrl && (
          <Image
            src={tool.logoUrl as string}
            height={40}
            width={40}
            alt={`${tool.title}'s logotype`}
            style={{ objectFit: "cover" }}
            className="-mt-[2px] mr-2 h-[40px] w-[40px] rounded-md border border-neutral-800"
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
          active={
            sessionData
              ? tool.favorites.find((elem) => {
                  return elem.id === sessionData.user.id;
                }) != undefined
              : false
          }
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

  const { data: sessionData } = useSession();

  return (
    <button
      className={`flex items-center justify-center`}
      onClick={(e) => {
        // add to favorites:
        e.preventDefault();
        if (!sessionData) {
          notification("You are not logged in.");
        } else if (
          deleteFromFavoritesMutation.isLoading ||
          addToFavoritesMutation.isLoading
        ) {
          notification("You are clicking too fast..");
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
