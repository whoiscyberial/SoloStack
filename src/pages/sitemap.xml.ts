import { db } from "@/server/db";
import { type Subcategory } from "@prisma/client";
import { type OutgoingMessage } from "http";

const SUBCATEGORIES_ROOT_URL = "https://solostack.ru";

function generateSiteMap(categories: Array<Subcategory>) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://solostack.ru</loc>
     </url>
     ${categories
       .map((subcategory) => {
         return `
       <url>
           <loc>${`${SUBCATEGORIES_ROOT_URL}/${subcategory.slug}`}</loc>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }: { res: OutgoingMessage }) {
  // We make an API call to gather the URLs for our site
  const subcategories = await db.subcategory.findMany();

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(subcategories);
  console.log(sitemap);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
