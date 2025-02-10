import * as React from "react"

import { cn } from "@/lib/utils"

const defaultBadgeClasses =
  "inline-flex items-center font-light rounded-full border border-primary-yellow bg-primary-yellow px-5 py-1 text-md text-black"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

function Badge({ className, ...props }: BadgeProps) {
  return <div className={cn(defaultBadgeClasses, className)} {...props} />
}

export { Badge }
