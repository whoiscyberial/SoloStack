import Sidebar from "@/components/Sidebar";
import ToolPage from "@/components/ToolPage";
import ToolsList from "@/components/ToolsList";
import Container from "@/components/ui/Container";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { useRouter } from "next/router";

export default function Subcategory() {
  const router = useRouter();

  const { subcategory } = router.query;
  if (!subcategory) {
    return <LoadingOverlay />;
  } else if (
    typeof subcategory != "string" &&
    subcategory.length === 2 &&
    typeof subcategory[1] != undefined
  ) {
    const slug = subcategory[0]!;
    const toolId = subcategory[1]!;
    return (
      <>
        <Sidebar />
        <Container>
          <div>
            <ToolPage subcategorySlug={slug} toolId={parseInt(toolId)} />
          </div>
        </Container>
      </>
    );
  } else if (subcategory.length === 1) {
    return (
      <>
        <Sidebar />
        <Container>
          <ToolsList sort="mostLikedFirst" subcategorySlug={subcategory[0]} />
        </Container>
      </>
    );
  }
}
