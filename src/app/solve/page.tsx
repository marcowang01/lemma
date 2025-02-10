"use client"

import { useFormContext } from "@/app/context/form-context"
import { Card } from "@/components/core/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { processSafeHtml, useParsedContent } from "@/lib/parser"
import { ServerMessage } from "@/lib/types"
import { EditIcon } from "@/svg/editIcon"
import { PauseIcon } from "@/svg/pauseIcon"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { ReasoningCard } from "../reasoning"
import { ThinkingIndicator } from "../thinking"

export default function Solution() {
  const { formData } = useFormContext()
  const router = useRouter()
  const { content, updateContent } = useParsedContent()

  const [reasoningText, setReasoningText] = useState("")

  const [isThinking, setIsThinking] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const stepIdx = useRef(0)

  useEffect(() => {
    if (!formData) {
      router.push("/")
      return
    }

    const imageFile = formData.get("imageInput") as File
    if (imageFile.size > 0) {
      const imageUrl = URL.createObjectURL(imageFile)
      setImageUrl(imageUrl)
    }

    const fetchSolution = async () => {
      setReasoningText("")
      updateContent("")
      setIsThinking(true)

      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        console.error("Failed to fetch response", response)
        setIsThinking(false)
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

              // console.log(`text: ${text}`)

              updateContent(text)
              break
            case "reasoning":
              reasoningText += serverMessage.content
              setReasoningText(reasoningText)
              // console.log(reasoningText)
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

  const { scratchpad, question, steps, finalAnswer } = content

  return (
    <main className="flex h-full w-full items-center justify-center">
      <div className="text-light-black bg-light-gray fixed right-4 top-4 flex items-center gap-6 rounded-xl px-6 py-4 text-2xl font-light italic">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Math problem"
            objectFit="fit"
            className="h-16 w-auto cursor-pointer rounded-lg transition-opacity duration-200 hover:opacity-80"
            width={50}
            height={50}
            onClick={() => setIsModalOpen(true)}
          />
        )}
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
      <div className="my-24 flex w-full flex-col gap-5">
        <p className="text-dark-dark-gray whitespace-pre-wrap text-2xl font-light italic">
          {scratchpad}
        </p>
        {isThinking && <ThinkingIndicator />}
        {reasoningText && <ReasoningCard text={reasoningText} />}
        {question && solutionCard(processSafeHtml(question), "secondary", "Question")}
        {steps && solutionCard(processSafeHtml(steps), "secondary", "Step-by-step Solution")}
        {finalAnswer && solutionCard(processSafeHtml(finalAnswer), "primary", "Final Solution")}
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-neutral m-0 max-w-[70%] border-0 p-0 outline-none">
          <div hidden>
            <DialogTitle>Uploaded Image</DialogTitle>
          </div>
          <div className="h-full w-full">
            <Image
              src={imageUrl ?? ""}
              alt="Math problem enlarged"
              className="h-auto w-full rounded-md object-contain"
              width={1000}
              height={1000}
            />
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

function solutionCard(text: string, variant: "primary" | "secondary", badgeText: string) {
  return (
    <Card className="h-full w-full" badgeText={badgeText} variant={variant}>
      <div className="markdown mb-auto h-full w-full" dangerouslySetInnerHTML={{ __html: text }} />
    </Card>
  )
}
