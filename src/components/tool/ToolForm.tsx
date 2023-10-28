import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/ui/Button";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import notification from "../ui/notification";
import LoadingOverlay from "../ui/LoadingOverlay";
import { AnimatePresence, motion } from "framer-motion";
import useCategoriesStore from "@/store/categoriesStore";
import useToolFormStore from "@/store/toolFormStore";
import { useEdgeStore } from "@/server/edgestore";

const PLACEHOLDER_IMAGE_URL =
  "https://files.edgestore.dev/wcjllha84x9p1pkv/logotypes/_public/no-code-tools/d53c8031-b222-446c-b4e2-ea289eac26a7-thumb.png";
const validationSchema = z.object({
  id: z.number().optional().default(-1),
  title: z.string().min(3, { message: "Title is required" }),
  description: z
    .string()
    .min(3, { message: "Description is required" })
    .max(9 * 6, { message: "Description is too long" }),
  text: z.string().optional(),
  subcategoryId: z.string().min(1, { message: "Please choose a Subcategory" }),
  link: z.string().url({ message: "Please provide a full link to tool" }),
  verified: z.boolean().optional(),
  logoUrl: z.string().url().optional(),
});
export type ToolSchema = z.infer<typeof validationSchema>;

const ToolForm = () => {
  // edge store and images.
  const [logo, setLogo] = useState<File>();
  const { edgestore } = useEdgeStore();

  // zustand store
  const initValue = useToolFormStore((state) => state.initValue);
  const close = useToolFormStore((state) => state.close);
  const isShown = useToolFormStore((state) => state.isShown);
  const categories = useCategoriesStore((state) => state.categories);

  // react hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting, isValidating },
  } = useForm<ToolSchema>({
    resolver: zodResolver(validationSchema),
    values: initValue,
  });

  // trpc procedures
  const createTool = api.tool.create.useMutation();
  const updateTool = api.tool.update.useMutation();
  const subcategoriesFetch = api.subcategory.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    cacheTime: 24 * 60 * 60 * 1000,
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
  const subcategories = subcategoriesFetch.data;

  // session
  const { data: sessionData } = useSession();

  // action on submit
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      notification(
        "Thank you for sharing! It will take time to verificate your tool.",
      );
      close();
      setLogo(undefined);
    }
  }, [isSubmitSuccessful, reset]);

  // action on render
  useEffect(() => {
    !isShown
      ? setTimeout(() => {
          reset();
          setLogo(undefined);
        }, 300)
      : null;
  }, [isShown]);

  // loading
  if (!categories || !sessionData || !subcategories) {
    return <>{isShown && <LoadingOverlay />}</>;
  }

  // handle submit
  const onSubmit: SubmitHandler<ToolSchema> = async (data) => {
    sessionData.user.role === "ADMIN"
      ? (data.verified = true)
      : (data.verified = false);

    if (logo) {
      const selectedSubcategory = subcategories.find((subcategory) => {
        return subcategory.id == parseInt(data.subcategoryId);
      });
      const subcategoryTitle = selectedSubcategory?.slug;
      const logoResult = await edgestore.logotypes.upload({
        input: { subcategory: subcategoryTitle! },
        file: logo,
        onProgressChange: (progress) => {
          console.log(progress);
        },
      });
      logoResult.thumbnailUrl ? (data.logoUrl = logoResult.thumbnailUrl) : null;
    }

    if (initValue) {
      updateTool.mutate({
        id: initValue.id,
        title: data.title,
        description: data.description,
        text: data.text,
        link: data.link,
        subcategoryId: parseInt(data.subcategoryId),
        creatorId: sessionData.user.id,
        verified: data.verified,
        ...(data.logoUrl
          ? { logoUrl: data.logoUrl }
          : { logoUrl: PLACEHOLDER_IMAGE_URL }),
      });
    } else {
      createTool.mutate({
        title: data.title,
        description: data.description,
        text: data.text,
        link: data.link,
        subcategoryId: parseInt(data.subcategoryId),
        creatorId: sessionData.user.id,
        verified: data.verified,
        ...(data.logoUrl
          ? { logoUrl: data.logoUrl }
          : { logoUrl: PLACEHOLDER_IMAGE_URL }),
      });
    }
  };

  return (
    <AnimatePresence>
      {isShown && (
        <motion.div
          onClick={close}
          className="absolute left-0 top-0 z-10 h-screen w-screen items-center justify-center bg-neutral-950/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <form
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="z-20 mb-4 flex h-fit min-h-screen w-screen flex-col rounded-md border border-neutral-800/30 px-8 pb-8 pt-6 dark:bg-neutral-900 md:absolute md:left-[50%] md:top-[50%] md:h-auto md:min-h-fit md:w-[70vw] md:translate-x-[-50%] md:translate-y-[-50%] lg:w-[70vw] xl:w-[50vw]"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-4">
              <label className="mb-2 block font-semibold" htmlFor="title">
                Title
              </label>
              <input
                className={`w-full border px-3 py-2 text-sm leading-tight ${
                  errors.title && "border-red-500"
                }  appearance-none rounded focus:outline-none`}
                id="title"
                type="text"
                placeholder="Solostack"
                {...register("title")}
              />
              {errors.title && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.title?.message}
                </p>
              )}
            </div>

            <div className="mb-4 w-full">
              <label
                className="mb-2 block font-semibold"
                htmlFor="subcategoryId"
              >
                Subcategory
              </label>
              <select
                className={`w-full border px-3 py-2 text-sm leading-tight ${
                  errors.subcategoryId && "border-red-500"
                } focus:shadow-outline appearance-none rounded focus:outline-none`}
                id="subcategoryId"
                placeholder="1"
                {...register("subcategoryId")}
              >
                {categories.map((category) => {
                  return (
                    <optgroup label={category.title} key={category.id}>
                      {category.subcategories.map((subcategory) => {
                        return (
                          <option value={subcategory.id} key={subcategory.id}>
                            {subcategory.title}
                          </option>
                        );
                      })}
                    </optgroup>
                  );
                })}
              </select>
              {errors.subcategoryId && (
                <p className="mt-2 text-xs italic text-red-500">
                  {errors.subcategoryId?.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-2 block font-semibold" htmlFor="description">
                Short description
              </label>
              <input
                className={`w-full border px-3 py-2 text-sm leading-tight ${
                  errors.description && "border-red-500"
                } focus:shadow-outline appearance-none rounded focus:outline-none`}
                id="description"
                type="text"
                placeholder="No-code website builder"
                {...register("description")}
              />
              {errors.description && (
                <p className="mt-2 text-xs italic text-red-500">
                  {errors.description?.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-2 block font-semibold" htmlFor="link">
                Link
              </label>
              <input
                className={`w-full border px-3 py-2 text-sm leading-tight ${
                  errors.link && "border-red-500"
                } focus:shadow-outline appearance-none rounded focus:outline-none`}
                id="link"
                type="text"
                placeholder="https://google.com/"
                {...register("link")}
              />
              {errors.link && (
                <p className="mt-2 text-xs italic text-red-500">
                  {errors.link?.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-2 block font-semibold" htmlFor="text">
                A few paragraphs about it{" "}
                <span className="ml-1 font-normal text-neutral-500">
                  (optional)
                </span>
              </label>
              <textarea
                className={`w-full border px-3 py-2 text-sm leading-tight  ${
                  errors.text && "border-red-500"
                } focus:shadow-outline appearance-none rounded focus:outline-none`}
                id="text"
                placeholder="Outseta is a membership SaaS platform that lets you connect your frontend with it and turn it into a membership website."
                rows={14}
                {...register("text")}
              />
              {errors.text && (
                <p className="mt-2 text-xs italic text-red-500">
                  {errors.text?.message}
                </p>
              )}
            </div>

            <label
              htmlFor="logo-upload"
              className="mb-4 flex w-full items-center justify-center border-2 border-dashed border-neutral-700 py-8 text-neutral-600 transition-all hover:cursor-pointer hover:bg-neutral-800 hover:text-neutral-200"
            >
              {logo?.name ? logo.name : "Logotype 1:1 (optional)"}
            </label>
            <input
              id="logo-upload"
              type="file"
              onChange={(e) => {
                setLogo(e.target.files?.[0]);
              }}
              className="hidden"
            />

            <div className="mb-6 text-center">
              <Button
                disabled={isSubmitting || isValidating}
                type="submit"
                className="w-full transition-all disabled:animate-pulse disabled:bg-neutral-800"
              >
                Add tool
              </Button>
            </div>

            <div className="-mt-3 text-center">
              <Button
                type="button"
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  close();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToolForm;
