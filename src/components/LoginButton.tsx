import { api } from "@/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import Button from "./ui/Button";

type LoginButtonProps = {};

const LoginButton = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button">) => {
  const { data: sessionData } = useSession();

  return (
    <Button
      {...props}
      className={className}
      onClick={sessionData ? () => void signOut() : () => void signIn()}
    >
      {sessionData ? "Sign out" : "Sign in with GitHub"}
    </Button>
  );
};

export default LoginButton;
