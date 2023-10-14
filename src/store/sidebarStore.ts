import { type Category, type Subcategory } from "@prisma/client";
import { create } from "zustand";

type Store = {
  activeSubcategory: number;
  setActiveSubcategory: (id: number) => void;
};

const useSidebarStore = create<Store>()((set) => ({
  activeSubcategory: 0,
  setActiveSubcategory: (id: number) => {
    set({ activeSubcategory: id });
  },
}));

export default useSidebarStore;
