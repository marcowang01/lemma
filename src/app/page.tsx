"use client"

import { Card, CardContent } from "@/components/ui/card"
import { renderLatex } from "@/lib/latex"
import DOMPurify from "dompurify"
import { Upload } from "lucide-react"
import { marked } from "marked"
import { useEffect, useState } from "react"

export default function Chat() {
  const [image, setImage] = useState<File | null>(null)
  const [userInput, setUserInput] = useState<string>("")
  const [tempText, setTempText] = useState<string>("") // Final rendered HTML
  const [imageUrl, setImageUrl] = useState<string | null>(null)

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
      setImage(file)
      setImageUrl(URL.createObjectURL(file))

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        console.log("Image base64:", base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  // Submit the user's message + image (if any) to /api/chat
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

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
    <main className="container mx-auto max-w-6xl p-4">
      <div className="grid gap-8 md:grid-cols-1">
        {/* Image Upload / Preview */}
        <Card className="overflow-hidden">
          <CardContent className="relative aspect-video p-0">
            <img
              src={imageUrl ?? "placeholder.jpg"}
              alt="Math problem"
              className={`h-full w-full object-cover ${!imageUrl ? "opacity-20" : ""}`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex cursor-pointer items-center space-x-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
              >
                <Upload size={24} />
                <span>Change Problem</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Render Marked + KaTeX HTML */}
        <Card className="overflow-hidden">
          <CardContent className="relative flex h-full flex-col p-4">
            <div
              className="markdown mb-auto h-full w-full whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: tempText }}
            />
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
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
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
