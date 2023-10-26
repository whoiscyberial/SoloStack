import Link from "next/link";
import React from "react";

type ButtonProps = {
  href?: string;
  disableIcon?: boolean;
};

const Button = ({
  href,
  children,
  className,
  disableIcon,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & ButtonProps) => {
  if (href) {
    return (
      <Link href={href}>
        <button
          {...props}
          className={`${className} flex w-full items-center justify-between rounded-md border px-4 py-2 text-center text-neutral-500 shadow-sm transition-all dark:border-neutral-700 dark:bg-neutral-850 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
        >
          {children}
          {!disableIcon && (
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
                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          )}
        </button>
      </Link>
    );
  }

  return (
    <button
      {...props}
      className={`${className} rounded-md border px-4 py-2 text-neutral-500 shadow-sm transition-all dark:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`}
    >
      {children}
    </button>
  );
};

export default Button;
