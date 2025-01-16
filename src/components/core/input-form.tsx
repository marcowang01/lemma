"use client"

import { ImageUpload } from "@/components/core/image-upload"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"
import { Card, CardContent } from "../ui/card"

export function InputForm({
  onSubmit,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [userInput, setUserInput] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageUrl(URL.createObjectURL(file))
    }
  }

  const handleClearImage = () => {
    setImageUrl(null)
    if (formRef.current) {
      const fileInput = formRef.current.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!userInput && !imageUrl) {
      return
    }

    await onSubmit(e)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <Card className="overflow-hidden">
        <CardContent className="relative h-[200px] w-full p-0">
          <ImageUpload
            imageUrl={imageUrl}
            onImageChange={handleImageChange}
            onClearImage={handleClearImage}
            onImageClick={() => setIsModalOpen(true)}
          />
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardContent className="relative h-fit w-full p-0">
          <div className="m-2 flex w-[calc(100%-1rem)] gap-2">
            <input
              className="flex-1 rounded p-2 ring-offset-background focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              name="userInput"
              value={userInput}
              placeholder="Type and/or upload your math problem..."
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!userInput && !imageUrl}
            >
              Submit
            </button>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-fit max-w-6xl">
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
    </form>
  )
}
