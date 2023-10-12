import Head from "next/head";
import Container from "@/components/ui/Container";

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
