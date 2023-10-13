import { api } from "@/utils/api";
import { type Category, type Subcategory } from "@prisma/client";
import {
  type PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

type Props = {
  close: () => void;
  categories: Array<Category & { subcategories: Array<Subcategory> }>;
  show: boolean;
};

export const CategoriesAndToolFormContext = createContext({
  state: {
    close: () => {},
    categories: [],
    show: false,
  },
  setState: () => {},
} as {
  state: {
    close: () => void;
    categories: Array<Category & { subcategories: Array<Subcategory> }>;
    show: boolean;
  };
  setState: React.Dispatch<React.SetStateAction<Props>>;
});

const ToolFormAndCategoriesProvider = ({ children }: PropsWithChildren) => {
  const categories = api.category.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 24 * 60 * 60 * 1000,
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
  const [contextState, setContexState] = useState<Props>({
    close: () => {},
    categories: [],
    show: false,
  });
  useEffect(() => {
    setContexState({ ...contextState, categories: categories.data! });
  }, [categories.isSuccess]);

  return (
    <CategoriesAndToolFormContext.Provider
      value={{
        state: {
          show: contextState.show,
          categories: contextState.categories,
          close: () => {
            setContexState({ ...contextState, show: !contextState.show });
          },
        },
        setState: setContexState,
      }}
    >
      {children}
    </CategoriesAndToolFormContext.Provider>
  );
};

export default ToolFormAndCategoriesProvider;
