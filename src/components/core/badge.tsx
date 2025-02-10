import * as React from "react"

import { cn } from "@/lib/utils"

const defaultBadgeClasses =
  "inline-flex items-center font-light rounded-full border border-primary-yellow bg-primary-yellow px-5 py-0.5 text-md text-light-black transition-all duration-150 ease-in-out"

function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(defaultBadgeClasses, className)} {...props} />
}

export { Badge }
