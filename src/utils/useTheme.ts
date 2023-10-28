// import { useEffect } from "react";

export const useTheme = () => {
  // since no light theme is available now, i set dark theme manually.
  document.documentElement.classList.add("dark");

  // useEffect(() => {
  //   if (
  //     localStorage.theme === "dark" ||
  //     (!("theme" in localStorage) &&
  //       window.matchMedia("(prefers-color-scheme: dark)").matches)
  //   ) {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  //   localStorage.theme = "dark";
  // }, []);
};
