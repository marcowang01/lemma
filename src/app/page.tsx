"use client"

import { InputForm } from "@/components/core/input-form"
import { Card, CardContent } from "@/components/ui/card"
import { renderLatex } from "@/lib/latex"
import { ServerMessage } from "@/lib/types"
import DOMPurify from "dompurify"
import { marked } from "marked"
import { useEffect, useRef, useState } from "react"
import { CollapsibleReasoning } from "./reasoning"
import { ThinkingIndicator } from "./thinking"

export default function Chat() {
  const [solutionText, setSolutionText] = useState<string>("")
  const [reasoningText, setReasoningText] = useState<string>(``)
  const [isThinking, setIsThinking] = useState<boolean>(false)
  const stepIdx = useRef(0)

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
    setIsThinking(true)

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
            if (stepIdx.current !== serverMessage.stepIdx) {
              text = ""
              stepIdx.current = serverMessage.stepIdx
            }

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
    <main className="mx-auto flex h-full w-full max-w-[1000px] flex-col items-center justify-center px-4 py-8">
      <h1 className="font-appleGaramond flex flex-col items-center text-9xl font-light italic tracking-tight">
        lemma
      </h1>
      <div className="mb-48 mt-24 h-80 w-full rounded-xl border border-black bg-gray-100 bg-opacity-50">
        <InputForm onSubmit={handleSubmit} disabled={isThinking} />
      </div>
      <div className="grid gap-8 md:grid-cols-1">
        {reasoningText && <CollapsibleReasoning text={reasoningText} />}
        {solutionText && (
          <Card className="overflow-hidden">
            <CardContent className="relative flex h-full flex-col px-0 py-2">
              <div
                className="markdown mb-auto h-full w-full"
                dangerouslySetInnerHTML={{ __html: solutionText }}
              />
              {isThinking && (
                <div className="my-2 px-4">
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
