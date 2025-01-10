"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useChat } from "ai/react"
import { Upload } from "lucide-react"
import { useState } from "react"
import { clsx } from "clsx"

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()
  const [image, setImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setImageUrl(URL.createObjectURL(file))
    }
  }

  return (
    <main className="container mx-auto max-w-4xl p-4">
      <h1 className="mb-8 text-center text-3xl font-bold">Math Problem Solver</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardContent className="relative aspect-square p-0">
            <img 
              src={imageUrl ?? "placeholder.jpg"} 
              alt="Math problem" 
              className={`h-full w-full object-cover ${!imageUrl ? 'opacity-20' : ''}`} 
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
          <CardContent className="relative aspect-square p-2">
            <div className="stretch mx-auto px-2 flex max-w-md flex-col py-24">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`whitespace-pre-wrap rounded-lg p-2 ${
                    m.role === "user" ? "bg-transparent" : "bg-gray-200"
                  }`}
                >
                  {m.content}
                </div>
              ))}

              <form onSubmit={handleSubmit}>
                <input
                  className="absolute bottom-0 mb-8 max-w-md rounded border border-gray-300 p-2"
                  value={input}
                  placeholder="Say something..."
                  onChange={handleInputChange}
                />
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
