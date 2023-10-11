import { useRouter } from "next/router";

export default function Subcategory() {
  const router = useRouter();
  return <p>Post: {router.query.slug}</p>;
}
