import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";

/**
 * We are not using the chadcn select because it is really a JS dropdown
 * and we need a real HTML select so it can work in situations where JS is
 * not available.
 */
export default forwardRef<
  HTMLSelectElement,
  React.HTMLProps<HTMLSelectElement>
>(function Select({ className, ...props }, ref) {
  return (
    <div className="relative">
      <select
        className={cn(
          "bg-background border-input h-9 w-full appearance-none truncate rounded-md border py-2 pr-8 pl-3 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus:ring-ring/50 ring-offset-background focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        ref={ref}
        {...props}
      />
      <ChevronDown className="absolute top-3 right-3 h-4 w-4 opacity-50" />
    </div>
  );
});
