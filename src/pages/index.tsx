import Button from "@/components/ui/Button";
import { db } from "@/server/db";
import { motion } from "framer-motion";
import { type InferGetServerSidePropsType } from "next";
import Head from "next/head";

export default function Home({
  subcategories,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Solostack</title>
        <meta
          name="description"
          content="Community-driven catalog of tools for indie hackers, startups, and business owners"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen w-full max-w-lg flex-col justify-center px-10 pb-24 pt-24">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 4 }}
          className="text-center"
        >
          <h1 className="text-2xl font-extrabold">SOLOSTACK</h1>
          <p className="text-neutral-400">Community-Driven Toolbox</p>
        </motion.section>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <p className=" mt-4 py-4 text-justify text-neutral-500">
            Introducing the ultimate toolbox for indie hackers, startups, and
            business owners.
            <br />
            <br /> This website aims to improve the way you discover and access
            essential tools for your business or side-project success. Step into
            our community-driven catalog of tools, where every user can
            contribute their favorite resources and suggestions. Our vibrant
            community ensures that you will always have an up-to-date and
            curated collection of the best tools at your fingertips. <br />
            <br />
            We value quality and authenticity. Our team of moderators verifies
            each suggested tool, guaranteeing its reliability and usefulness.
            Say goodbye to wasting time on trial and error — our toolbox is
            designed to empower you with the right tools from the start.
            Increase your productivity, efficiency, and overall success with
            ease.
            <br />
            <br /> Explore the website, contribute your favorite tools, and
            improve the way you work.
          </p>
          <Button
            className={`${subcategories[0] ? "" : "cursor-not-allowed"} mt-8`}
            href={`/${subcategories[0] ? subcategories[0].slug : ""}`}
          >
            {subcategories[0]
              ? "Browse tools"
              : "Website is currently not working"}
          </Button>
        </motion.section>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const req = await db.subcategory.findMany();
  const subcategories: typeof req = JSON.parse(
    JSON.stringify(req),
  ) as typeof req;

  return {
    props: { subcategories },
  };
}
