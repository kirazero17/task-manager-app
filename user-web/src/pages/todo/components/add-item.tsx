import React from "react";
import { Plus } from "lucide-react";

// Import lib/utils
import { cn } from "src/lib/utils";

// Import componnents
import { Button } from "src/components/ui/button";

export interface AddItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const AddItem = React.forwardRef<HTMLButtonElement, AddItemProps>(
  (props, ref) => {
    return (
      <Button ref={ref} {...props} variant="outline">
        <Plus /> Add new item
      </Button>
    );
  }
);

export default AddItem;
