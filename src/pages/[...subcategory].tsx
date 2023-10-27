import { signIn, useSession } from "next-auth/react";
import ToolPage from "@/components/tool/ToolPage";
import ToolsList from "@/components/tool/ToolsList";
import Container from "@/components/ui/Container";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import useCategoriesStore from "@/store/categoriesStore";
import useSidebarStore from "@/store/sidebarStore";
import useUserStore from "@/store/userStore";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Subcategory() {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const categories = useCategoriesStore((state) => state.categories);
  const setCategories = useCategoriesStore((state) => state.setCategories);
  const setActiveSubcategory = useSidebarStore(
    (state) => state.setActiveSubcategory,
  );

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

  // fetch favorite tools of user
  const favoriteToolsFetch = api.user.getFavorites.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 24 * 60 * 60 * 1000,
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
  const favoriteTools = favoriteToolsFetch?.data?.favoriteTools;
  const setFavoriteTools = useUserStore((state) => state.setFavoriteTools);
  useEffect(() => {
    if (favoriteToolsFetch.data) {
      setFavoriteTools(favoriteToolsFetch.data.favoriteTools!);
    }
  }, [favoriteToolsFetch.isSuccess]);

  // fetch categories for sidebar
  const categoryFetch = api.category.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 24 * 60 * 60 * 1000,
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
  useEffect(() => {
    setCategories(categoryFetch.data!);
  }, [categoryFetch.isSuccess]);

  const { subcategory } = router.query;
  if (!subcategory || !categories || !tools || !favoriteTools) {
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
    // subcategory page:

    //if favorites page:
    if (subcategory[0] == "favorites") {
      if (!sessionData) {
        () => signIn();
      } else {
        const filteredTools = tools.filter((tool) => {
          return (
            tool.favorites.find((favorite) => {
              console.log(favorite.id);
              console.log(sessionData.user.id);
              console.log(favorite.id === sessionData.user.id);
              return favorite.id === sessionData.user.id;
            }) != undefined
          );
        });
        console.log("filtered tools: ", filteredTools);
        return (
          <Container>
            <ToolsList data={filteredTools} subcategorySlug="favorites" />
          </Container>
        );
      }
    }

    // else:
    categories.map((categ) => {
      categ.subcategories.map((subcateg) => {
        if (subcateg.slug === subcategory[0]) {
          setActiveSubcategory(subcateg.id);
        }
      });
    });

    // PASSING ALL TOOLS TO EACH PAGE (may be slow in future)
    return (
      <Container>
        <ToolsList subcategorySlug={subcategory[0]} data={tools} />
      </Container>
    );
  }
}
