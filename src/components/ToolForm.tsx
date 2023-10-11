import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/ui/Button";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import notification from "./ui/notification";
import LoadingOverlay from "./ui/LoadingOverlay";
import { Category, Subcategory } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";

const validationSchema = z.object({
  title: z.string().min(3, { message: "Title is required" }),
  description: z
    .string()
    .min(3, { message: "Description is required" })
    .max(9 * 6, { message: "Description is too long" }),
  text: z.string().optional(),
  subcategoryId: z.string().min(1, { message: "Please choose a Subcategory" }),
  link: z.string().url({ message: "Please provide a full link to tool" }),
  verified: z.boolean().optional(),
});
type ValidationSchema = z.infer<typeof validationSchema>;

const ToolForm = ({
  close,
  categories,
  show,
}: {
  close: () => void;
  categories: Array<Category & { subcategories: Array<Subcategory> }>;
  show: boolean;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting, isValidating },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const createTool = api.tool.create.useMutation();
  const { data: sessionData } = useSession();
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      notification("Thank you for sharing!");
      close();
    }
  }, [isSubmitSuccessful, reset]);

  // No hooks after this line
  if (!sessionData || !categories) {
    return <LoadingOverlay />;
  }

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    if (sessionData.user.role === "ADMIN") {
      data.verified = true;
    } else {
      data.verified = false;
    }
    createTool.mutate({
      title: data.title,
      description: data.description,
      text: data.text,
      link: data.link,
      subcategoryId: parseInt(data.subcategoryId),
      creatorId: sessionData.user.id,
      verified: data.verified,
    });
  };

  return (
    <AnimatePresence>
      {show && (
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
            className="absolute left-[50%] top-[50%] z-20 mb-4 w-screen translate-x-[-50%] translate-y-[-50%] flex-col rounded-md border border-neutral-800/30 px-8 pb-8 pt-6 dark:bg-neutral-900 md:w-[70vw] lg:w-[70vw] xl:w-[50vw]"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-4">
              <label className="mb-2 block font-semibold" htmlFor="title">
                Name of your tool
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
                rows={24}
                {...register("text")}
              />
              {errors.text && (
                <p className="mt-2 text-xs italic text-red-500">
                  {errors.text?.message}
                </p>
              )}
            </div>

            <div className="mb-6 text-center">
              <Button
                disabled={isSubmitting || isValidating}
                type="submit"
                className="w-full"
              >
                Add tool
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToolForm;
