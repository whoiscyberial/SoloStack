import React from "react";
import Button from "../ui/Button";
import { useSession } from "next-auth/react";
import notification from "../ui/notification";
import useToolFormStore from "@/store/toolFormStore";

const ToolFormButton = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & { className?: string }) => {
  const open = useToolFormStore((state) => state.show);
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

export default ToolFormButton;
