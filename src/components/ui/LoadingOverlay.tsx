import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const LoadingOverlay = () => {
  return (
    <div className="absolute left-0 top-0 z-10 h-screen w-screen bg-neutral-950/70">
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    </div>
  );
};

export default LoadingOverlay;
