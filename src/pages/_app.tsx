import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

import { api } from "@/utils/api";
import { useTheme } from "@/utils/useTheme";

import "@/styles/globals.css";
import ToolFormAndCategoriesProvider from "@/context/ToolFormContext";
import ToolForm from "@/components/ToolForm";

const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useTheme();
  return (
    <SessionProvider session={session}>
      <main
        className={`${inter.className} flex min-h-screen w-screen flex-col items-center justify-center bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200`}
      >
        <ToolFormAndCategoriesProvider>
          <Component {...pageProps} />
          <Toaster position="bottom-left" reverseOrder={false} />
          <ToolForm />
        </ToolFormAndCategoriesProvider>
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
