import { renderLatex } from "@/lib/latex"
import DOMPurify from "dompurify"
import { marked } from "marked"
import { useState } from "react"

interface ParsedContent {
  scratchpad: string
  question: string
  steps: string
  finalAnswer: string
}

interface TagTracker {
  content: string
  isOpen: boolean
}

const createTagTrackers = () => ({
  scratchpad: { content: "", isOpen: false },
  question: { content: "", isOpen: false },
  steps: { content: "", isOpen: false },
  final_answer: { content: "", isOpen: false },
})

export function parseStreamedContent(text: string): ParsedContent {
  const tagTrackers = createTagTrackers()
  let currentTag: string | null = null

  // Process the text character by character
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "<") {
      const closeTagMatch = text.slice(i).match(/^<\/([^>]+)>/)
      const openTagMatch = text.slice(i).match(/^<([^>/]+)>/)

      if (closeTagMatch) {
        const tagName = closeTagMatch[1]
        if (tagName in tagTrackers) {
          tagTrackers[tagName as keyof typeof tagTrackers].isOpen = false
          currentTag = null
          i += closeTagMatch[0].length - 1
        }
      } else if (openTagMatch) {
        const tagName = openTagMatch[1]
        if (tagName in tagTrackers) {
          tagTrackers[tagName as keyof typeof tagTrackers].isOpen = true
          currentTag = tagName
          i += openTagMatch[0].length - 1
        }
      }
    } else if (currentTag && tagTrackers[currentTag as keyof typeof tagTrackers].isOpen) {
      tagTrackers[currentTag as keyof typeof tagTrackers].content += text[i]
    }
  }

  return {
    scratchpad: tagTrackers.scratchpad.content,
    question: tagTrackers.question.content,
    steps: tagTrackers.steps.content,
    finalAnswer: tagTrackers.final_answer.content,
  }
}

/**
 * Sanitizes and processes the HTML content
 * @param text Raw text content
 * @returns Safe HTML string with LaTeX rendering
 */
export function processSafeHtml(text: string): string {
  if (!text) return ""

  // Process LaTeX first
  const processedText = renderLatex(text)

  // Convert markdown to HTML
  const markdownHtml = marked.parse(processedText) as string

  // Sanitize the HTML
  return DOMPurify.sanitize(markdownHtml)
}

/**
 * Custom hook for managing parsed content state
 */
export function useParsedContent() {
  const [content, setContent] = useState<ParsedContent>({
    scratchpad: "Let me solve this problem step by step...",
    question: "",
    steps: "",
    finalAnswer: "",
  })

  const updateContent = (text: string) => {
    const parsedContent = parseStreamedContent(text)
    setContent(parsedContent)
  }

  return {
    content,
    updateContent,
  }
}
