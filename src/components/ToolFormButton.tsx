import React, { type PropsWithChildren, useContext } from "react";
import Button from "./ui/Button";
import { useSession } from "next-auth/react";
import notification from "./ui/notification";
import { CategoriesAndToolFormContext } from "@/context/ToolFormContext";
import useToolFormStore from "@/store/toolFormStore";

const ToolFormButton = ({
  className,
  children,
  ...props
}: PropsWithChildren & { className?: string }) => {
  const open = useToolFormStore((state) => state.switchShow);
  const { data: sessionData } = useSession();

  const clickFn = () => {
    if (!sessionData) {
      notification("You are not logged in");
      return;
    } else {
      open();
    }
  };

  return (
    <Button {...props} className={className} onClick={clickFn}>
      {children}
    </Button>
  );
};

// const ToolFormButton = ({
//   children,
//   className,
//   categories,
//   ...props
// }: React.ComponentPropsWithoutRef<"button"> & {
//   categories: Array<Category & { subcategories: Array<Subcategory> }>;
// }) => {
//   const [toolFormActive, setToolFormActive] = useState(false);
//   const { data: sessionData } = useSession();
//   const clickFn = () => {
//     if (!sessionData) {
//       notification("You are not logged in");
//       return;
//     } else {
//       setToolFormActive(!toolFormActive);
//     }
//   };

//   return (
//     <div className="grid grid-flow-col gap-0 transition-all">
//       <ToolForm
//         close={() => setToolFormActive(!toolFormActive)}
//         categories={categories}
//         show={toolFormActive}
//       />
//       <Button {...props} className={className} onClick={clickFn}>
//         {children}
//       </Button>
//     </div>
//   );
// };

export default ToolFormButton;
