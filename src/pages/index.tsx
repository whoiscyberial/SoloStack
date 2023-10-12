import Head from "next/head";

import Sidebar from "@/components/Sidebar";
import Container from "@/components/ui/Container";
import ToolFormButton from "@/components/ToolFormButton.1";
import notification from "@/components/ui/notification";

export default function Home() {
  return (
    <>
      <Head>
        <title>Solostack</title>
        <meta name="description" content="Tools for indie-hackers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Container></Container>
      </>
    </>
  );
}
