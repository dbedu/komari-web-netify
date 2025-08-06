import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive backdrop-blur-sm active:scale-[0.98] hover:shadow-lg hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-[var(--accent-6)] to-[var(--accent-7)] text-[var(--accent-12)] shadow-md hover:from-[var(--accent-7)] hover:to-[var(--accent-8)] border border-[var(--accent-8)]/20",
        destructive:
          "bg-gradient-to-b from-destructive to-destructive/90 text-white shadow-md hover:from-destructive/90 hover:to-destructive/80 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 border border-destructive/20",
        outline:
          "bg-gradient-to-b from-background/80 to-background/60 backdrop-blur-md shadow-md hover:from-[var(--accent-3)] hover:to-[var(--accent-4)] hover:text-[var(--accent-12)] border border-border/40 hover:border-[var(--accent-6)]/40", 
        secondary:
          "bg-gradient-to-b from-[var(--accent-4)] to-[var(--accent-5)] text-[var(--accent-12)] shadow-md hover:from-[var(--accent-5)] hover:to-[var(--accent-6)] border border-[var(--accent-6)]/20",
        ghost:
          "hover:bg-gradient-to-b hover:from-[var(--accent-3)] hover:to-[var(--accent-4)] hover:text-[var(--accent-12)] hover:shadow-sm",
        link: "text-[var(--accent-11)] underline-offset-4 hover:underline hover:text-[var(--accent-12)]",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-8 rounded-lg gap-1.5 px-3.5 has-[>svg]:px-3",
        lg: "h-12 rounded-xl px-7 has-[>svg]:px-5 text-base",
        icon: "size-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
