"use client"

import { InputForm } from "@/components/core/input-form"
import { Card, CardContent } from "@/components/ui/card"
import { renderLatex } from "@/lib/latex"
import DOMPurify from "dompurify"
import { marked } from "marked"
import { useEffect, useState } from "react"

export default function Chat() {
  const [solutionText, setSolutionText] = useState<string>("")

  useEffect(() => {
    marked.setOptions({
      gfm: true,
      breaks: true,
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSolutionText("")

    const formData = new FormData(e.currentTarget)

    console.log(`formData: ${JSON.stringify(formData, null, 2)}`)

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

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }

      text += decoder.decode(value, { stream: true })
      const processedText = renderLatex(text)
      const markdownHtml = marked.parse(processedText) as string
      const safeHtml = DOMPurify.sanitize(markdownHtml)
      setSolutionText(safeHtml)
    }
  }

  return (
    <main className="container mx-auto max-w-4xl p-4">
      <div className="grid gap-8 md:grid-cols-1">
        <InputForm onSubmit={handleSubmit} />
        {solutionText && (
          <Card className="overflow-hidden">
            <CardContent className="relative flex h-full flex-col p-4">
              <div
                className="markdown mb-auto h-full w-full"
                dangerouslySetInnerHTML={{ __html: solutionText }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
