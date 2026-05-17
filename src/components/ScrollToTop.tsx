import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { lenis } from "@/main";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    lenis.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
