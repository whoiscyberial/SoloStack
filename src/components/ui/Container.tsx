import React from "react";
import Sidebar from "../Sidebar";

const Container = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  return (
    <>
      <Sidebar />
      <div
        {...props}
        className={`${className} xs:py-32 flex min-h-screen w-full flex-col items-center justify-center px-[32px] py-12 md:ml-[256px] md:w-[calc(100vw-256px)] lg:px-[64px] lg:py-[32px]`}
      >
        {children}
      </div>
    </>
  );
};

export default Container;
