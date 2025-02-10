"use client"

import { useFormContext } from "@/app/context/form-context"
import { Card } from "@/components/core/card"
import { renderLatex } from "@/lib/latex"
import { ServerMessage } from "@/lib/types"
import DOMPurify from "dompurify"
import { marked } from "marked"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { ReasoningCard } from "../reasoning"
import { ThinkingIndicator } from "../thinking"

export default function Solution() {
  const { formData } = useFormContext()
  const router = useRouter()
  const [solutionText, setSolutionText] = useState(`
    <p>This is a basic addition problem. Let me explain the solution:</p>
<p>In arithmetic, when we add two numbers, we combine their values to get a total sum.</p>
<p>Step 1: Let's add the numbers</p>
<ul>
<li>We have two numbers: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mn>1</mn></mrow>1</math></span><span aria-hidden="true" class="katex-html"><span class="base"><span style="height:0.6444em;" class="strut"></span><span class="mord">1</span></span></span></span> and <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mn>1</mn></mrow>1</math></span><span aria-hidden="true" class="katex-html"><span class="base"><span style="height:0.6444em;" class="strut"></span><span class="mord">1</span></span></span></span></li>
<li>When we add them together: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mn>1</mn><mo>+</mo><mn>1</mn><mo>=</mo><mn>2</mn></mrow>1 + 1 = 2</math></span><span aria-hidden="true" class="katex-html"><span class="base"><span style="height:0.7278em;vertical-align:-0.0833em;" class="strut"></span><span class="mord">1</span><span style="margin-right:0.2222em;" class="mspace"></span><span class="mbin">+</span><span style="margin-right:0.2222em;" class="mspace"></span></span><span class="base"><span style="height:0.6444em;" class="strut"></span><span class="mord">1</span><span style="margin-right:0.2778em;" class="mspace"></span><span class="mrel">=</span><span style="margin-right:0.2778em;" class="mspace"></span></span><span class="base"><span style="height:0.6444em;" class="strut"></span><span class="mord">2</span></span></span></span></li>
</ul>
<p>Therefore, <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mn>1</mn><mo>+</mo><mn>1</mn><mo>=</mo><mn>2</mn></mrow>1 + 1 = 2</math></span><span aria-hidden="true" class="katex-html"><span class="base"><span style="height:0.7278em;vertical-align:-0.0833em;" class="strut"></span><span class="mord">1</span><span style="margin-right:0.2222em;" class="mspace"></span><span class="mbin">+</span><span style="margin-right:0.2222em;" class="mspace"></span></span><span class="base"><span style="height:0.6444em;" class="strut"></span><span class="mord">1</span><span style="margin-right:0.2778em;" class="mspace"></span><span class="mrel">=</span><span style="margin-right:0.2778em;" class="mspace"></span></span><span class="base"><span style="height:0.6444em;" class="strut"></span><span class="mord">2</span></span></span></span></p>
<p>This is one of the most fundamental equations in mathematics that we learn early on. It forms the basis for more complex addition problems and is used throughout mathematics.</p>
`)
  const [reasoningText, setReasoningText] = useState(`
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
    `)
  const [isThinking, setIsThinking] = useState(false)
  const [scratchpadText, setScratchpadText] = useState("Let me solve this problem step by step...")
  const stepIdx = useRef(0)

  useEffect(() => {
    if (!formData) {
      // router.push("/")
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
      <div className="flex w-full flex-col gap-5">
        <p className="text-dark-dark-gray text-2xl font-light italic">{scratchpadText}</p>
        {isThinking && (
          <div className="my-2 px-4">
            <ThinkingIndicator />
          </div>
        )}
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
