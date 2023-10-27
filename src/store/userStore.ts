import { type ToolArray } from "@/components/tool/ToolsList";
import { create } from "zustand";

type Store = {
  favoriteTools: ToolArray;
  setFavoriteTools: (tools: ToolArray) => void;
};

const useUserStore = create<Store>()((set) => ({
  favoriteTools: [],
  setFavoriteTools: (tools: ToolArray) => {
    set({ favoriteTools: tools });
  },
}));

export default useUserStore;
