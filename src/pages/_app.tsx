import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { EdgeStoreProvider } from "@/server/edgestore";

import { api } from "@/utils/api";
import { useTheme } from "@/utils/useTheme";

import "@/styles/globals.css";
import ToolForm from "@/components/tool/ToolForm";
import { AnimatePresence, motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useTheme();
  return (
    <AnimatePresence mode="wait">
      <EdgeStoreProvider>
        <SessionProvider session={session}>
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${inter.className} flex min-h-screen w-screen flex-col items-center justify-center bg-neutral-900 text-neutral-200`}
          >
            <Component {...pageProps} />
            <Toaster position="bottom-left" reverseOrder={false} />
            <ToolForm />
          </motion.main>
        </SessionProvider>
      </EdgeStoreProvider>
    </AnimatePresence>
  );
};

export default api.withTRPC(MyApp);
