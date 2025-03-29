import * as React from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  error?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, error, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        error && "text-red-500",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";

export { Label }; 