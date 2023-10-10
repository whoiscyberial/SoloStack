import { api } from "@/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

type LoginButtonProps = {};

const LoginButton = () => {
  const { data: sessionData } = useSession();

  return (
    <button
      className="flex w-full items-center gap-2 rounded-md border px-4 py-2 text-center text-neutral-500 shadow-sm transition-all dark:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
      onClick={sessionData ? () => void signOut() : () => void signIn()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-[18px] w-[18px]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
        />
      </svg>
      {sessionData ? "Sign out" : "Sign in with GitHub"}
    </button>
  );
};

export default LoginButton;
