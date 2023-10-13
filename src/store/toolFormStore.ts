import { create } from "zustand";

type Store = {
  show: boolean;
  switchShow: () => void;
};

const useToolFormStore = create<Store>()((set, get) => ({
  show: false,
  switchShow: () => {
    const show = get().show;
    set({ show: !show });
  },
}));

export default useToolFormStore;
