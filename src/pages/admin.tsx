import Container from "@/components/ui/Container";
import { TRPCError } from "@trpc/server";
import { useSession } from "next-auth/react";
import React from "react";

const Admin = () => {
  const { data: sessionData } = useSession();

  if (sessionData === null) {
    throw new TRPCError({ code: "FORBIDDEN" });
  } else {
    return <Container></Container>;
  }
};

export default Admin;
