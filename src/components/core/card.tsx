import { Badge } from "@/components/core/badge"
import { cn } from "@/lib/utils"
import React, { useEffect, useRef, useState } from "react"

const Card = ({
  children,
  className = "",
  badgeText,
  ...props
}: {
  children: React.ReactNode
  className?: string
  badgeText?: string
  props?: any
}) => {
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
      className={cn(
        "bg-light-gray/50 flex flex-col gap-2 rounded-[20px] border border-black",
        isCollapsed && "bg-neutral/30 border-neutral",
        className
      )}
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
              "text-md transition-colors duration-300 ease-in-out",
              isCollapsed && "border-neutral bg-neutral"
            )}
          >
            {badgeText}
          </Badge>
        </div>
      )}
      <div
        className={`p-6 pt-2 transition-opacity duration-300 ease-in-out ${isCollapsed ? "opacity-0" : "opacity-100"} `}
      >
        {children}
      </div>
    </div>
  )
}

export default Card
