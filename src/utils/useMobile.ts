import { useWindowSize } from "@uidotdev/usehooks";

const useMobile = () => {
  const windowSize = useWindowSize();
  const isMobile: boolean = windowSize.width! < 768;
  return isMobile;
};

export default useMobile;
