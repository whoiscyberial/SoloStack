import React from "react";
import { Oval } from "react-loader-spinner";

const LoadingOverlay = () => {
  return (
    <div className="absolute left-0 top-0 z-10 h-screen w-screen bg-neutral-950/70">
      <div className="flex h-full w-full items-center justify-center">
        <Oval
          height={80}
          width={80}
          color="#4fa94d"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#4fa94d"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    </div>
  );
};

export default LoadingOverlay;
