"use client"

import { Card } from "@/components/core/card"
import { useEffect, useRef } from "react"

export const ReasoningCard = ({ text }: { text: string }) => {
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
          className={`text-md overflow-y-auto whitespace-pre-wrap font-light transition-all duration-200`}
        >
          {text}
        </div>
      </div>
    </Card>
  )
}
