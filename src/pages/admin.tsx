import { TRPCError } from "@trpc/server";
import { useSession } from "next-auth/react";
import React from "react";

const Admin = () => {
  const { data: sessionData } = useSession();

  if (!sessionData) {
    return <div>Loading</div>;
  } else if (sessionData === null) {
    throw new TRPCError({ code: "FORBIDDEN" });
  } else {
    return <div></div>;
  }
};

export default Admin;
