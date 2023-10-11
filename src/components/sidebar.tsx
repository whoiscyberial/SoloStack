import React, { useState } from "react";
import LoginButton from "@/components/LoginButton";
import Button from "./ui/Button";
import ToolForm from "./ToolForm";
import ToolFormButton from "./ToolFormButton";
import { api } from "@/utils/api";
import LoadingOverlay from "./ui/LoadingOverlay";
import { motion } from "framer-motion";

const Sidebar = () => {
  const categories = api.category.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const [activeSubcategory, setActiveSubcategory] = useState(-1);

  if (!categories.data || categories.isLoading) {
    return (
      <div className="absolute left-0 top-0 h-screen w-[256px] border-r border-neutral-800 bg-neutral-800/50 px-8 py-16"></div>
    );
  }

  return (
    <>
      <div className="fixed left-0 top-0 h-screen w-[256px] border-r border-neutral-800 bg-neutral-800/50 px-8 py-16">
        <div className="grid grid-flow-row gap-y-16">
          {categories.data.map((category) => {
            return (
              <motion.div
                className="grid grid-flow-row gap-y-[6px]"
                initial={{ translateX: -80, opacity: 0 }}
                transition={{ delay: category.id / 4 - 0.25, duration: 0.6 }}
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
                    <button
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
                    </button>
                  );
                })}
              </motion.div>
            );
          })}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: categories.data.length / 4 + 0.6,
              duration: 0.6,
            }}
            className="grid grid-flow-row gap-y-4"
          >
            <ToolFormButton categories={categories.data} className="text-left">
              Add your tool
            </ToolFormButton>
            <LoginButton className="text-start" />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
