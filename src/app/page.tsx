"use client"

import { InputForm } from "@/components/core/input-form"
import { Card, CardContent } from "@/components/ui/card"
import { renderLatex } from "@/lib/latex"
import { ServerMessage } from "@/lib/types"
import DOMPurify from "dompurify"
import { marked } from "marked"
import { useEffect, useState } from "react"
import { CollapsibleReasoning } from "./reasoning"
import { ThinkingIndicator } from "./thinking"

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
              {isThinking && (
                <div className="mt-2 px-4">
                  <ThinkingIndicator />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
