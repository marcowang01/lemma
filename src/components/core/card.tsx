import { Badge } from "@/components/core/badge"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import React, { useEffect, useRef, useState } from "react"

const cardVariants = cva(
  "flex flex-col gap-2 overflow-hidden rounded-[20px] border transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        primary: "bg-light-gray/50 border-black",
        secondary: "bg-neutral/30 border-neutral",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode
  badgeText?: string
}

const Card = ({ children, className, variant, badgeText, ...props }: CardProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [contentHeight, setContentHeight] = useState("auto")
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight
      setContentHeight(`${height}px`)
    }
  }, [children])

  return (
    <div
      className={cn(cardVariants({ variant, className }))}
      style={{
        height: isCollapsed ? "50px" : contentHeight,
        transition:
          "height 300ms ease-in-out, background-color 300ms ease-in-out, border 300ms ease-in-out",
      }}
      {...props}
      ref={contentRef}
    >
      {badgeText && (
        <div className="cursor-pointer p-2.5" onClick={() => setIsCollapsed(!isCollapsed)}>
          <Badge
            className={cn(
              "text-md transition-all duration-300 ease-in-out",
              isCollapsed
                ? "border-neutral bg-neutral hover:bg-primary-yellow hover:border-primary-yellow"
                : "hover:opacity-80"
            )}
          >
            {badgeText}
          </Badge>
        </div>
      )}
      <div
        className={`p-6 pt-2 transition-opacity duration-300 ease-in-out ${
          isCollapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </div>
  )
}

export { Card, cardVariants, type CardProps }
