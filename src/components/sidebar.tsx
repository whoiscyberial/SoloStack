import React from "react";
import LoginButton from "@/components/LoginButton";

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-screen w-[256px] border-r border-neutral-800 bg-neutral-800/50 px-8 py-16">
      <div className="grid grid-flow-row gap-y-16">
        <div className="grid grid-flow-row gap-y-2">
          <label className="mb-2 text-[12px] font-semibold dark:text-neutral-500">
            DEVELOPMENT
          </label>
          <button className="w-full rounded-md bg-neutral-800 px-4 py-2 text-start  shadow-sm">
            No-code tools
          </button>
          <button className="w-full rounded-md px-4 py-2 text-start text-neutral-500 shadow-sm transition-all hover:text-neutral-200">
            Analytics
          </button>
          <button className="w-full rounded-md px-4 py-2 text-start text-neutral-500 shadow-sm transition-all hover:text-neutral-200">
            Databases and Storages
          </button>
        </div>
        <div className="grid grid-flow-row gap-y-2">
          <label className="mb-2 text-[12px] font-semibold dark:text-neutral-500">
            DESIGN
          </label>
          <button className="w-full rounded-md px-4 py-2 text-start text-neutral-500 shadow-sm transition-all hover:text-neutral-200">
            Presentations
          </button>
          <button className="w-full rounded-md px-4 py-2 text-start text-neutral-500 shadow-sm transition-all hover:text-neutral-200">
            Prototyping
          </button>
          <button className="w-full rounded-md px-4 py-2 text-start text-neutral-500 shadow-sm transition-all hover:text-neutral-200">
            Video editing
          </button>
        </div>
        <LoginButton />
      </div>
    </div>
  );
};

export default Sidebar;
