"use client"

import { InputForm } from "@/components/core/input-form"
import { Card, CardContent } from "@/components/ui/card"
import { renderLatex } from "@/lib/latex"
import { ServerMessage } from "@/lib/types"
import DOMPurify from "dompurify"
import { ChevronDown, ChevronUp } from "lucide-react"
import { marked } from "marked"
import { useEffect, useRef, useState } from "react"

const CollapsibleReasoning = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastLines = text.split("\n").slice(-3).join("\n") // Show last 3 lines when collapsed

  useEffect(() => {
    if (containerRef.current && isExpanded) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [text, isExpanded])

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between p-4 hover:bg-gray-50"
        >
          <span className="font-medium">Reasoning Process</span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        <div className="relative">
          <div
            ref={containerRef}
            className={`whitespace-pre-wrap p-4 transition-all duration-200 ${
              isExpanded ? "max-h-[500px]" : "max-h-24"
            } overflow-y-auto`}
          >
            {isExpanded ? text : lastLines}
          </div>
          {!isExpanded && text.split("\n").length > 3 && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Chat() {
  const [solutionText, setSolutionText] = useState<string>("")
  const [reasoningText, setReasoningText] = useState<string>("")
  const [isThinking, setIsThinking] = useState<boolean>(false)

  useEffect(() => {
    marked.setOptions({
      gfm: true,
      breaks: true,
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSolutionText("")
    setReasoningText("")
    const formData = new FormData(e.currentTarget)

    const response = await fetch("/api/chat", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      console.error("Failed to fetch response", response)
      setSolutionText("Failed to fetch response")
      return
    }

    const reader = response.body!.getReader()
    const decoder = new TextDecoder()
    let text = ""
    let reasoningText = ""

    setIsThinking(true)
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const rawResponse = decoder.decode(value, { stream: true })
      const lines = rawResponse.split("\n")

      for (const line of lines) {
        if (line.trim() === "") continue

        const serverMessage: ServerMessage = JSON.parse(line)

        switch (serverMessage.type) {
          case "response":
            text += serverMessage.content
            const processedText = renderLatex(text)
            const markdownHtml = marked.parse(processedText) as string
            const safeHtml = DOMPurify.sanitize(markdownHtml)
            setSolutionText(safeHtml)
            break
          case "reasoning":
            reasoningText += serverMessage.content
            setReasoningText(reasoningText)
            break
          case "error":
            console.error("Error message:", serverMessage.content)
            break
        }
      }
    }
    setIsThinking(false)
  }

  return (
    <main className="container mx-auto max-w-4xl p-4">
      <div className="grid gap-8 md:grid-cols-1">
        <InputForm onSubmit={handleSubmit} />
        {reasoningText && <CollapsibleReasoning text={reasoningText} />}
        {solutionText && (
          <Card className="overflow-hidden">
            <CardContent className="relative flex h-full flex-col p-4">
              <div
                className="markdown mb-auto h-full w-full"
                dangerouslySetInnerHTML={{ __html: solutionText }}
              />
              {isThinking && <div className="text-sm text-gray-500">Thinking...</div>}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
