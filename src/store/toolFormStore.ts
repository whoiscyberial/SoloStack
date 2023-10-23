import { create } from "zustand";
import { type ToolSchema } from "@/components/tool/ToolForm";

type InitValue = (ToolSchema & { id: number }) | undefined;

type Store = {
  isShown: boolean;
  show: () => void;
  close: () => void;
  initValue: InitValue;
  setInitValue: (tool: InitValue) => void;
};

const useToolFormStore = create<Store>()((set) => ({
  isShown: false,
  show: () => {
    set({ isShown: true });
  },
  close: () => {
    set({ isShown: false });
    set({ initValue: undefined });
  },
  initValue: undefined,
  setInitValue: (tool: InitValue) => {
    set({ initValue: tool });
  },
}));

export default useToolFormStore;
