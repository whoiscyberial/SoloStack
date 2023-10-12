import ToolForm from "@/components/ToolForm";
import Button from "@/components/ui/Button";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import notification from "@/components/ui/notification";
import { api } from "@/utils/api";
import { Category, Subcategory } from "@prisma/client";
import { useSession } from "next-auth/react";
import {
  Context,
  PropsWithChildren,
  createContext,
  useContext,
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

const ToolFormButtonConsumer = ({
  className,
  children,
  ...props
}: PropsWithChildren & { className: string }) => {
  const { state, setState } = useContext(CategoriesAndToolFormContext);
  const { data: sessionData } = useSession();

  const clickFn = () => {
    if (!sessionData) {
      notification("You are not logged in");
      return;
    } else {
      setState({ ...state, show: !state.show });
    }
  };

  return (
    <Button {...props} className={className} onClick={clickFn}>
      {children}
    </Button>
  );
};

const ToolFormAndCategoriesProvider = ({ children }: PropsWithChildren) => {
  const categories = api.category.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const [contextState, setContexState] = useState<Props>({
    close: () => {},
    categories: [],
    show: false,
  });
  useEffect(() => {
    setContexState({ ...contextState, categories: categories.data! });
  }, [categories.isSuccess]);
  // if (!categories.data) {
  //   return <LoadingOverlay />;
  // }

  // if (!categories) {
  //   return <>{contextState.show && <LoadingOverlay />}</>;
  // }

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
// const ToolFormButtonConsumer = ({
//   className,
//   children,
//   ...props
// }: PropsWithChildren & { className: string }) => {
//   const { data: sessionData } = useSession();
//   const clickFn = (
//     state: {
//       close: () => void;
//       categories: Array<Category & { subcategories: Array<Subcategory> }>;
//       show: boolean;
//     },
//     setState: React.Dispatch<React.SetStateAction<Props>>,
//   ) => {
//     if (!sessionData) {
//       notification("You are not logged in");
//       return;
//     } else {
//       setState({ ...state, show: !state.show });
//     }
//   };
//   return (
//     <ToolFormContext.Consumer>
//       {({ state, setState }) => (
//         <Button
//           {...props}
//           className={className}
//           onClick={() => {
//             clickFn(state, setState);
//           }}
//         >
//           {children}
//         </Button>
//       )}
//     </ToolFormContext.Consumer>
//   );
// };

// export const ToolFormContextProvider = ({ children }: PropsWithChildren) => {
//   return (
// 		<ToolFormContext.Provider value={}></ToolFormContext.Provider>
// 	)
// };

{
  /* <ToolForm
        categories={value.state.categories}
        close={value.state.close}
        show={value.state.show}
      />
     */
}
