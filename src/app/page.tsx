"use client"

import { InputForm } from "@/components/core/input-form"
import { Card, CardContent } from "@/components/ui/card"
import { renderLatex } from "@/lib/latex"
import DOMPurify from "dompurify"
import { marked } from "marked"
import { useEffect, useState } from "react"

export default function Chat() {
  const [tempText, setTempText] = useState<string>("")

  useEffect(() => {
    marked.setOptions({
      gfm: true,
      breaks: true,
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const response = await fetch("/api/chat", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      console.error("Failed to fetch response", response)
      setTempText("Failed to fetch response")
      return
    }

    const reader = response.body!.getReader()
    const decoder = new TextDecoder()
    let text = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }

      text += decoder.decode(value, { stream: true })
      let processedText = renderLatex(text)
      const markdownHtml = marked.parse(processedText) as string
      const safeHtml = DOMPurify.sanitize(markdownHtml)
      setTempText(safeHtml)
    }
  }

  return (
    <main className="container mx-auto max-w-6xl p-4">
      <div className="grid gap-8 md:grid-cols-1">
        <InputForm onSubmit={handleSubmit} />
        <Card className="overflow-hidden">
          <CardContent className="relative flex h-full flex-col p-4">
            <div
              className="markdown mb-auto h-full w-full"
              dangerouslySetInnerHTML={{ __html: tempText }}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
