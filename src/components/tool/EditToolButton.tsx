import React, { type PropsWithChildren } from "react";
import Button from "../ui/Button";
import { useSession } from "next-auth/react";
import notification from "../ui/notification";
import useToolFormStore from "@/store/toolFormStore";
import { type ToolSchema } from "./ToolForm";

const EditToolButton = ({
  className,
  children,
  tool,
  ...props
}: PropsWithChildren & { className?: string; tool: ToolSchema }) => {
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

  return (
    <Button {...props} className={className} onClick={clickFn}>
      {children}
    </Button>
  );
};

export default EditToolButton;
