import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/70 selection:bg-primary selection:text-primary-foreground",
        "flex h-11 w-full min-w-0 rounded-xl border border-border/40 bg-background/60 backdrop-blur-sm px-4 py-3 text-base shadow-md",
        "transition-all duration-200 outline-none",
        "hover:border-border/60 hover:bg-background/80 hover:shadow-lg",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:ring-offset-1 focus-visible:bg-background/90 focus-visible:shadow-lg",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-background/30",
        "aria-invalid:ring-2 aria-invalid:ring-destructive/30 aria-invalid:border-destructive/60",
        "file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "dark:bg-background/40 dark:hover:bg-background/60 dark:focus-visible:bg-background/70",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
