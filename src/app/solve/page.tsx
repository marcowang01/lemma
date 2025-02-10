"use client"

import { useFormContext } from "@/app/context/form-context"
import { Card } from "@/components/core/card"
import { renderLatex } from "@/lib/latex"
import { ServerMessage } from "@/lib/types"
import { EditIcon } from "@/svg/editIcon"
import { PauseIcon } from "@/svg/pauseIcon"
import DOMPurify from "dompurify"
import { marked } from "marked"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { ReasoningCard } from "../reasoning"
import { ThinkingIndicator } from "../thinking"

export default function Solution() {
  const { formData } = useFormContext()
  const router = useRouter()
  const [solutionText, setSolutionText] = useState("")
  const [reasoningText, setReasoningText] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [scratchpadText, setScratchpadText] = useState("Let me solve this problem step by step...")
  const stepIdx = useRef(0)

  useEffect(() => {
    if (!formData) {
      router.push("/")
      return
    }

    const fetchSolution = async () => {
      setSolutionText("")
      setReasoningText("")
      setIsThinking(true)

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
              console.log(safeHtml)
              break
            case "reasoning":
              reasoningText += serverMessage.content
              setReasoningText(reasoningText)
              console.log(reasoningText)
              break
            case "error":
              console.error("Error message:", serverMessage.content)
              break
          }
        }
      }
      setIsThinking(false)
    }
    fetchSolution()
  }, [formData, router])

  return (
    <main className="flex h-full w-full items-center justify-center">
      <div className="text-light-black bg-light-gray fixed right-4 top-4 flex items-center gap-6 rounded-xl px-6 py-4 text-2xl font-light italic">
        <span className="inline-block max-w-[400px] truncate italic">
          {String(formData?.get("userInput") ?? "Unknown question")}
        </span>
        <EditIcon
          className="hover:fill-dark-gray cursor-pointer transition-all duration-300 ease-in-out"
          height={24}
        />
        <PauseIcon
          className="hover:fill-dark-gray cursor-pointer transition-all duration-300 ease-in-out"
          height={21}
        />
      </div>
      <div className="flex w-full flex-col gap-5">
        <p className="text-dark-dark-gray text-2xl font-light italic">{scratchpadText}</p>
        {isThinking && <ThinkingIndicator />}
        {reasoningText && <ReasoningCard text={reasoningText} />}
        {solutionText && (
          <Card className="h-full w-full" badgeText="Solution" variant="secondary">
            <div
              className="markdown mb-auto h-full w-full"
              dangerouslySetInnerHTML={{ __html: solutionText }}
            />
          </Card>
        )}
      </div>
    </main>
  )
}
