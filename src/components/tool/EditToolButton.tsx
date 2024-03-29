import React from "react";
import { useSession } from "next-auth/react";
import notification from "../ui/notification";
import useToolFormStore from "@/store/toolFormStore";
import { type ToolSchema } from "./ToolForm";

const EditToolButton = ({
  className,
  tool,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & {
  className?: string;
  tool: ToolSchema;
}) => {
  const open = useToolFormStore((state) => state.show);
  const setInitValue = useToolFormStore((state) => state.setInitValue);
  const { data: sessionData } = useSession();

  const clickFn = () => {
    if (!sessionData || sessionData?.user.role != "ADMIN") {
      notification("You are not logged in");
      return;
    } else {
      setInitValue(tool);
      open();
    }
  };

  // do not show button to users
  if (sessionData?.user.role != "ADMIN") {
    return;
  }

  return (
    <button
      {...props}
      className={`${className} mx-0 my-0 -mt-[2px] flex w-full items-center justify-between rounded-md border border-none px-0 py-0 text-center text-neutral-600 shadow-sm transition-all dark:border-neutral-700 dark:hover:text-neutral-200`}
      onClick={(e) => {
        e.preventDefault();
        clickFn();
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-7 w-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
    </button>
  );
};

export default EditToolButton;
