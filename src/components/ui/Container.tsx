import React from "react";

const Container = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      {...props}
      className={`${className} flex min-h-screen w-full flex-col items-start justify-center px-[32px] py-32 md:ml-[256px] md:w-[calc(100vw-256px)] lg:px-[64px] lg:py-[32px]`}
    >
      {children}
    </div>
  );
};

export default Container;
