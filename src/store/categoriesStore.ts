import { api } from "@/utils/api";
import { type Category, type Subcategory } from "@prisma/client";
import { create } from "zustand";

type Categories = Array<Category & { subcategories: Array<Subcategory> }>;

type Store = {
  categories: Categories;
  setCategories: (categories: Categories) => void;
};

const useCategoriesStore = create<Store>()((set) => ({
  categories: [],
  setCategories: (categories: Categories) => {
    set({ categories: categories });
  },
}));

export default useCategoriesStore;
