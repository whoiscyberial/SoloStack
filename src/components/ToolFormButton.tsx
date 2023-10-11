import React, { useState } from "react";
import ToolForm from "./ToolForm";
import Button from "./Button";
import { Category, Subcategory } from "@prisma/client";

const ToolFormButton = ({
  children,
  className,
  categories,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & {
  categories: Array<Category & { subcategories: Array<Subcategory> }>;
}) => {
  const [toolFormActive, setToolFormActive] = useState(false);

  return (
    <>
      {toolFormActive === true && (
        <ToolForm
          close={() => setToolFormActive(!toolFormActive)}
          categories={categories}
        />
      )}
      <Button
        className={className}
        onClick={() => {
          setToolFormActive(!toolFormActive);
        }}
      >
        {children}
      </Button>
    </>
  );
};

export default ToolFormButton;
