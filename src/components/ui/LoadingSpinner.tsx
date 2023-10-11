import React from "react";
import { Oval } from "react-loader-spinner";

const LoadingSpinner = () => {
  return (
    <Oval
      height={80}
      width={80}
      color="#a3a3a3"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="#404040"
      strokeWidth={4}
      strokeWidthSecondary={4}
    />
  );
};

export default LoadingSpinner;
