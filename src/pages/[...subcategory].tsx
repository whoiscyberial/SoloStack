import ToolPage from "@/components/ToolPage";
import ToolsList from "@/components/ToolsList";
import Container from "@/components/ui/Container";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { useRouter } from "next/router";

export default function Subcategory() {
  const router = useRouter();

  const { subcategory } = router.query;
  if (!subcategory) {
    return (
      <Container>
        <LoadingOverlay />
      </Container>
    );
  } else if (
    typeof subcategory != "string" &&
    subcategory.length === 2 &&
    typeof subcategory[1] != undefined
  ) {
    const slug = subcategory[0]!;
    const toolId = subcategory[1]!;
    return (
      <Container>
        <ToolPage subcategorySlug={slug} toolId={parseInt(toolId)} />
      </Container>
    );
  } else if (subcategory.length === 1) {
    return (
      <Container>
        <ToolsList sort="mostLikedFirst" subcategorySlug={subcategory[0]} />
      </Container>
    );
  }
}
