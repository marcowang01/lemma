"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { renderLatex } from "@/lib/latex"
import DOMPurify from "dompurify"
import { Edit, Upload, X } from "lucide-react"
import { marked } from "marked"
import { useEffect, useRef, useState } from "react"

export default function Chat() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [userInput, setUserInput] = useState<string>("")
  const [tempText, setTempText] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    marked.setOptions({
      gfm: true,
      breaks: true,
    })
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const response = await fetch("/api/chat", {
      method: "POST",
      body: formData,
    })

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
      let processedText = renderLatex(text)
      const markdownHtml = marked.parse(processedText) as string
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
        <form ref={formRef} onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          {/* Image Upload / Preview */}
          <Card className="overflow-hidden">
            <CardContent className="relative h-[300px] w-full p-0">
              {/* Image container with click handler */}
              <div
                className="h-full w-full cursor-pointer hover:opacity-80"
                onClick={() => imageUrl && setIsModalOpen(true)}
              >
                {imageUrl && (
                  <img src={imageUrl} alt="Math problem" className="h-full w-auto object-contain" />
                )}
              </div>

              {/* Upload button container */}
              <div className="pointer-events-none absolute inset-0">
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
                  className={`pointer-events-auto absolute cursor-pointer items-center rounded-full bg-primary px-4 py-2 text-primary-foreground transition-colors duration-200 hover:bg-primary/90 ${
                    imageUrl
                      ? "bottom-2 right-2 flex"
                      : "inset-[40%] mx-auto my-auto flex items-center justify-center"
                  }`}
                >
                  {imageUrl ? (
                    <Edit size={16} className="mr-2" />
                  ) : (
                    <Upload size={24} className="shrink-0" />
                  )}
                  <span>{imageUrl ? "Edit Image" : "Upload Image"}</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Image Preview Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-4xl">
              <DialogTitle>Uploaded Image</DialogTitle>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
              <div className="mt-2 w-full">
                <img
                  src={imageUrl ?? ""}
                  alt="Math problem enlarged"
                  className="max-h-[80vh] w-auto rounded-md object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Chat Interface */}
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
