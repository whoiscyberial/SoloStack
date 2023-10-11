import React from "react";

const Container = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      {...props}
      className={`${className} ml-[256px] flex min-h-screen min-w-[calc(100vw-256px)] items-center justify-center px-[32px] py-[24px] lg:px-[64px] lg:py-[32px]`}
    >
      {children}
    </div>
  );
};

export default Container;
