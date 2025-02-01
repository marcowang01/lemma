"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export const CollapsibleReasoning = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever text changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [text])

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between p-4 hover:bg-gray-50"
        >
          <span className="text-sm text-gray-600">thinking out loud...</span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        <div className="relative">
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-8 bg-gradient-to-b from-white to-transparent" />

          <div
            ref={containerRef}
            className={`whitespace-pre-wrap p-4 text-sm text-gray-600 transition-all duration-200 ${
              isExpanded ? "max-h-[500px]" : "max-h-24"
            } overflow-y-auto`}
          >
            {text}
          </div>
          {!isExpanded && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
