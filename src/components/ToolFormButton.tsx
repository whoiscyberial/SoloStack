import React, { useState } from "react";
import ToolForm from "./ToolForm";
import Button from "./ui/Button";
import { type Category, type Subcategory } from "@prisma/client";

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
    <div className="grid grid-flow-col gap-0 transition-all">
      <ToolForm
        close={() => setToolFormActive(!toolFormActive)}
        categories={categories}
        show={toolFormActive}
      />
      <Button
        {...props}
        className={className}
        onClick={() => {
          setToolFormActive(!toolFormActive);
        }}
      >
        {children}
      </Button>
    </div>
  );
};

export default ToolFormButton;
