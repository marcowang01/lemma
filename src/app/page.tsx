"use client"

import { Card, CardContent } from "@/components/ui/card"
import { renderLatex } from "@/lib/latex"
import DOMPurify from "dompurify"
import { Upload } from "lucide-react"
import { marked } from "marked"
import { useEffect, useRef, useState } from "react"

export default function Chat() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [userInput, setUserInput] = useState<string>("")
  const [tempText, setTempText] = useState<string>("")
  const formRef = useRef<HTMLFormElement>(null)

  // (Optional) Marked configuration. Basic usage suffices here.
  useEffect(() => {
    marked.setOptions({
      gfm: true,
      breaks: true,
    })
  }, [])

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageUrl(URL.createObjectURL(file))
    }
  }

  // Submit the user's message + image (if any) to /api/chat
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Create form data from the form element directly
    const formData = new FormData(e.currentTarget)

    const response = await fetch("/api/chat", {
      method: "POST",
      body: formData,
    })

    // Clear user input
    setUserInput("")

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

      // 1) Render LaTeX first
      let processedText = renderLatex(text)

      // 2) Pass the result through Marked to parse Markdown
      const markdownHtml = marked.parse(processedText) as string

      // 3) Sanitize the final HTML for safety
      const safeHtml = DOMPurify.sanitize(markdownHtml)

      setTempText(safeHtml)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value)
  }

  return (
    <main className="container mx-auto max-w-4xl p-4">
      <div className="grid gap-8 md:grid-cols-1">
        <form ref={formRef} onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          {/* Image Upload / Preview */}
          <Card className="overflow-hidden">
            <CardContent className="relative h-[300px] w-full p-0">
              <img
                src={imageUrl ?? "placeholder.jpg"}
                alt="Math problem"
                className={`h-full w-auto object-contain ${!imageUrl ? "opacity-20" : ""}`}
              />
              <div className="absolute inset-0">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className={`absolute cursor-pointer items-center space-x-2 rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 ${
                    imageUrl ? "bottom-2 right-2 flex" : "inset-0 flex items-center justify-center"
                  }`}
                >
                  <Upload size={imageUrl ? 16 : 24} />
                  <span>{imageUrl ? "Edit" : "Change Problem"}</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Render Marked + KaTeX HTML */}
          <Card className="overflow-hidden">
            <CardContent className="relative flex h-full flex-col p-4">
              <div
                className="markdown mb-auto h-full w-full"
                dangerouslySetInnerHTML={{ __html: tempText }}
              />
              <div className="flex w-full gap-2">
                <input
                  className="flex-1 rounded border border-gray-300 p-2"
                  name="userInput"
                  value={userInput}
                  placeholder="Say something..."
                  onChange={handleInputChange}
                />
                <button
                  type="submit"
                  className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
                >
                  Send
                </button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </main>
  )
}
