"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useChat } from "ai/react"
import { Upload } from "lucide-react"

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()
  return (
    <main className="container mx-auto max-w-4xl p-4">
      <h1 className="mb-8 text-center text-3xl font-bold">Math Problem Solver</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardContent className="relative aspect-square p-0">
            <img src={""} alt="Math problem" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={() => {}}
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
      </div>

      <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}

        <form onSubmit={handleSubmit}>
          <input
            className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </main>
  )
}
