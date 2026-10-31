import { forwardRef, type LabelHTMLAttributes } from "react";
import { clsx } from "clsx";

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={clsx("block text-sm font-medium text-slate-700 mb-1", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";