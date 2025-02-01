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
  const [reasoningText, setReasoningText] = useState<string>(`Okay, so I have this problem where I need to determine which of the given sets are bases for R². Let me recall what a basis is. A basis for a vector space must satisfy two conditions: first, the vectors must be linearly independent, and second, they must span the entire vector space. Since we're dealing with R², the standard basis has two vectors, so any basis here must also have exactly two linearly independent vectors.

Let me go through each option one by one.

Starting with option a: {(0,1), (1,1)}. There are two vectors here, which is good because the dimension of R² is 2. Next, I need to check if they're linearly independent. To do that, I can form a matrix with these vectors as columns and compute the determinant. The matrix would be:

|0 1|
|1 1|

The determinant is (0)(1) - (1)(1) = -1. Since the determinant isn't zero, the vectors are linearly independent. And because there are two independent vectors in R², they automatically span the space. So option a is a valid basis.

Moving to option b: {(1,0), (0,1), (1,1)}. This set has three vectors. But in R², the maximum number of linearly independent vectors is 2. Having three vectors means they must be linearly dependent, so this can't be a basis. So option b is out.

Option c: {(1,0), (-1,0)}. There are two vectors here. Let me check linear independence. If I set up a linear combination a(1,0) + b(-1,0) = (0,0), this simplifies to (a - b, 0) = (0,0). So a = b, and there are non-trivial solutions (like a=1, b=1). Hence, they're linearly dependent. Also, since both vectors are along the x-axis, they can't span R² because any linear combination will still be on the x-axis. So option c isn't a basis.

Option d: {(1,1), (1,-1)}. Two vectors again. Let's compute the determinant of the matrix:

|1 1|
|1 -1|

Determinant is (1)(-1) - (1)(1) = -1 -1 = -2 ≠ 0. So they're linearly independent. As with option a, two independent vectors in R² span the space. Therefore, option d is a valid basis.

Option e: {(1,1), (2,2)}. Two vectors, but let's see if they're independent. The second vector is just twice the first (2,2) = 2*(1,1). So they're scalar multiples, meaning linearly dependent. Hence, they can't form a basis. Also, they only span a line in R², not the whole space. So option e is out.

Option f: {(1,2)}. Only one vector. Since R² requires two vectors for a basis, this set is too small. It can't span R², even if the single vector is non-zero. So option f isn't a basis.

Summarizing, options a and d are valid bases because they have two linearly independent vectors that span R². The others either have the wrong number of vectors or are linearly dependent.`)
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
