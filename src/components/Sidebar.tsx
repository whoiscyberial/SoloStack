import React, { useEffect, useState } from "react";
import LoginButton from "@/components/ui/LoginButton";
import ToolFormButton from "./tool/ToolFormButton";
import Link from "next/link";
import Button from "./ui/Button";
import useCategoriesStore from "@/store/categoriesStore";
import { api } from "@/utils/api";
import useSidebarStore from "@/store/sidebarStore";
import { useSession } from "next-auth/react";

const Sidebar = () => {
  const categories = useCategoriesStore((state) => state.categories);
  const setCategories = useCategoriesStore((state) => state.setCategories);
  const activeSubcategory = useSidebarStore((state) => state.activeSubcategory);
  const setActiveSubcategory = useSidebarStore(
    (state) => state.setActiveSubcategory,
  );
  const { data: sessionData } = useSession();

  const [showSidebar, setShowSidebar] = useState(false);

  const fetch = api.category.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 24 * 60 * 60 * 1000,
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    setCategories(fetch.data!);
  }, [fetch.isSuccess]);

  if (!categories) {
    return;
  }

  return (
    <>
      {showSidebar === false && (
        <div className="sticky right-0 top-0 w-full md:hidden ">
          <Button
            className=" absolute right-4 top-4 px-[10px] py-[10px]"
            onClick={() => {
              setShowSidebar(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </Button>
        </div>
      )}
      {showSidebar === true && (
        <>
          <div
            className={`fixed left-0 top-0 z-10 h-full min-h-full w-[256px]  overflow-y-auto border-r border-neutral-800 bg-neutral-850 px-8 py-14`}
          >
            <div className="grid grid-flow-row gap-y-14">
              {categories.map((category) => {
                return (
                  <div
                    className="grid grid-flow-row gap-y-[4px]"
                    key={category.id}
                  >
                    <label className="mb-2 text-[12px] font-semibold dark:text-neutral-500">
                      {category.title}
                    </label>
                    {category.subcategories.map((subcategory) => {
                      return (
                        // <button className="w-full rounded-md bg-neutral-800 px-4 py-2 text-start  shadow-sm">
                        //   {subcategory.title}
                        // </button>
                        <Link
                          href={`/${subcategory.slug}`}
                          key={subcategory.id}
                          onClick={() => {
                            setActiveSubcategory(subcategory.id);
                          }}
                          className={`${
                            activeSubcategory === subcategory.id
                              ? "w-full rounded-md bg-neutral-800 px-4 py-2 text-start  shadow-sm"
                              : "w-full rounded-md px-4 py-2 text-start text-neutral-500 shadow-sm transition-all hover:text-neutral-200"
                          }`}
                        >
                          {subcategory.title}
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
              <div className="grid grid-flow-row gap-y-4">
                {sessionData && sessionData.user.role === "ADMIN" && (
                  <Button className="text-left" href="/admin">
                    Admin panel
                  </Button>
                )}
                <ToolFormButton className="text-left">
                  Add your tool
                </ToolFormButton>

                <LoginButton className="text-left" />
              </div>
            </div>
          </div>
          {showSidebar === true && (
            <div
              className="absolute right-0 top-0 z-10 h-screen w-[calc(100vw-256px)] bg-neutral-950/50"
              onClick={() => setShowSidebar(false)}
            ></div>
          )}
        </>
      )}
    </>
  );
};

export default Sidebar;
