import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import notification from "@/components/ui/notification";

import { api } from "@/utils/api";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ToolsList from "@/components/ToolsList";
import Container from "@/components/ui/Container";

export default function Home() {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Solostack</title>
        <meta name="description" content="Tools for indie-hackers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Sidebar />
        <Container></Container>
      </>
    </>
  );
}
