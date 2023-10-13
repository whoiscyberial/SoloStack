import React, { useContext, useEffect, useState } from "react";
import LoginButton from "@/components/LoginButton";
import ToolFormButton from "./ToolFormButton";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Button from "./ui/Button";
import useMobile from "@/utils/useMobile";
import { CategoriesAndToolFormContext } from "@/context/ToolFormContext";

const Sidebar = () => {
  const { state } = useContext(CategoriesAndToolFormContext);
  const { categories } = state;
  const [activeSubcategory, setActiveSubcategory] = useState<number>(-1);
  const isMobile = useMobile();
  const [showSidebar, setShowSidebar] = useState(false);
  useEffect(() => {
    setShowSidebar(isMobile === false);
  }, [isMobile]);

  if (!categories) {
    return;
  }

  return (
    <>
      {showSidebar === false && isMobile === true && (
        <div className="sticky right-0 top-0 w-full ">
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
      <AnimatePresence>
        {showSidebar === true && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=""
          >
            <div
              className={`bg-neutral-850 fixed left-0 top-0 z-10 h-full min-h-full  w-[256px] overflow-y-auto border-r border-neutral-800 px-8 py-14`}
            >
              <div className="grid grid-flow-row gap-y-14">
                {categories.map((category) => {
                  return (
                    <motion.div
                      key={category.id}
                      className="grid grid-flow-row gap-y-[4px]"
                      initial={{ translateX: -80, opacity: 0 }}
                      transition={{
                        delay: category.id / 5 - 0.25,
                        duration: 0.6,
                      }}
                      animate={{ translateX: 0, opacity: 1 }}
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
                              if (isMobile) {
                                setShowSidebar(false);
                              }
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
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: categories.length / 5 + 0.4,
                    duration: 0.6,
                  }}
                  className="grid grid-flow-row gap-y-4"
                >
                  <ToolFormButton className="text-left">
                    Add your tool
                  </ToolFormButton>
                  <LoginButton className="text-left" />
                </motion.div>
              </div>
            </div>
            {showSidebar === true && isMobile === true && (
              <div
                className="absolute right-0 top-0 z-10 h-screen w-[calc(100vw-256px)] bg-transparent"
                onClick={() => setShowSidebar(false)}
              ></div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
