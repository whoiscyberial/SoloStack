import { useSession } from "next-auth/react";
import ToolPage from "@/components/tool/ToolPage";
import ToolsList from "@/components/tool/ToolsList";
import Container from "@/components/ui/Container";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import useCategoriesStore from "@/store/categoriesStore";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { type Subcategory } from "@prisma/client";
import { redirect } from "next/navigation";
import { OutgoingMessage } from "http";

export default function Subcategory() {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const categories = useCategoriesStore((state) => state.categories);
  const setCategories = useCategoriesStore((state) => state.setCategories);

  // FETCH ALL DATA METHOD (may be slow in future):
  const { data: tools } = api.tool.getAll.useQuery(
    { sort: "mostLikedFirst" },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      cacheTime: 24 * 60 * 60 * 1000,
      staleTime: 24 * 60 * 60 * 1000,
      retry: 1,
    },
  );

  // fetch categories for sidebar and set them to update sidebar
  const categoryFetch = api.category.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 24 * 60 * 60 * 1000,
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
  useEffect(() => {
    if (categoryFetch.isSuccess) {
      setCategories(categoryFetch.data!);
    }
  }, [categoryFetch.isSuccess]);

  const { subcategory } = router.query;
  if (!subcategory || !categories || tools === undefined) {
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
    // tool page:
    const slug = subcategory[0]!;
    const toolId = subcategory[1]!;
    return (
      <Container>
        <ToolPage subcategorySlug={slug} toolId={parseInt(toolId)} />
      </Container>
    );
  } else if (subcategory[0] && subcategory.length === 1) {
    // subcategory pages:
    // if tools page (index page):

    //if favorites page:
    if (subcategory[0] == "favorites") {
      if (!sessionData) {
        redirect("/auth/signin");
      } else {
        const filteredTools = tools.filter((tool) => {
          return (
            tool.favorites.find((favorite) => {
              return favorite.id === sessionData.user.id;
            }) != undefined
          );
        });
        return (
          <Container>
            <ToolsList
              data={filteredTools}
              subcategory={{
                title: "Favorites",
                categoryId: -9234214241,
                id: -9234214241,
                slug: "favorites",
              }}
            />
          </Container>
        );
      }
    } else {
      let querySubcategory: Subcategory | undefined = undefined;
      categories.find((categ) => {
        categ.subcategories.find((subcateg) => {
          if (subcateg.slug === subcategory[0]) {
            querySubcategory = subcateg;
            return true;
          }
        });
      });

      if (!querySubcategory) {
        return (
          <Container>
            <p>No such subcategory</p>
          </Container>
        );
      }

      // PASSING ALL TOOLS TO EACH PAGE (may be slow in future)
      return (
        <Container>
          <ToolsList subcategory={querySubcategory} data={tools} />
        </Container>
      );
    }
  }
}
