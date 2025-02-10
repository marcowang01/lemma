"use client"

import { Card } from "@/components/core/card"
import { useEffect, useRef, useState } from "react"

export const ReasoningCard = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever text changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [text])

  return (
    <Card className="overflow-hidden" variant="secondary" badgeText="Reasoning">
      <div className="relative">
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-8" />
        <div
          ref={containerRef}
          className={`whitespace-pre-wrap text-md font-light transition-all duration-200 ${
            isExpanded ? "max-h-[500px]" : "max-h-24"
          } overflow-y-auto`}
        >
          {text}
        </div>
        {!isExpanded && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8" />
        )}
      </div>
    </Card>
  )
}
