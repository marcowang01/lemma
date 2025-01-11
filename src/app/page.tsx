"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { useState } from "react"

export default function Chat() {
  const [image, setImage] = useState<File | null>(null)
  const [userInput, setUserInput] = useState<string>("")
  const [tempText, setTempText] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setImageUrl(URL.createObjectURL(file))
      // Add image to conversation history
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        console.log(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
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
      setTempText(text)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value)
  }

  return (
    <main className="container mx-auto max-w-4xl p-4">
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardContent className="relative aspect-square p-0">
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
        <Card className="overflow-hidden">
          <CardContent className="relative flex h-full flex-col p-4">
            <div className="mb-auto">{tempText}</div>
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
