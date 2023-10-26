import ToolPage from "@/components/tool/ToolPage";
import ToolsList from "@/components/tool/ToolsList";
import Container from "@/components/ui/Container";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import useCategoriesStore from "@/store/categoriesStore";
import useSidebarStore from "@/store/sidebarStore";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Subcategory() {
  const router = useRouter();
  const categories = useCategoriesStore((state) => state.categories);
  const setCategories = useCategoriesStore((state) => state.setCategories);
  const setActiveSubcategory = useSidebarStore(
    (state) => state.setActiveSubcategory,
  );

  const fetch = api.category.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 24 * 60 * 60 * 1000,
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    setCategories(fetch.data!);
  }, [fetch.isSuccess]);

  const { subcategory } = router.query;
  if (!subcategory || !categories) {
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
    categories.map((c) => {
      c.subcategories.map((subc) => {
        if (subc.slug === subcategory[0]) {
          setActiveSubcategory(subc.id);
        }
      });
    });

    return (
      <Container>
        <ToolsList sort="mostLikedFirst" subcategorySlug={subcategory[0]} />
      </Container>
    );
  }
}
