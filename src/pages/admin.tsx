import Container from "@/components/ui/Container";
import { TRPCError } from "@trpc/server";
import { useSession } from "next-auth/react";
import Head from "next/head";
import React from "react";

const Admin = () => {
  const { data: sessionData } = useSession();

  if (sessionData === null) {
    throw new TRPCError({ code: "FORBIDDEN" });
  } else {
    return (
      <>
        <Head>
          <title>{`Admin Page | Solostack`}</title>
          <meta
            name="description"
            content={`Administration Panel for moderators of Solostack.`}
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Container></Container>
      </>
    );
  }
};

export default Admin;
