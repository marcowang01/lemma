"use client"

import { ImageUpload } from "@/components/core/image-upload"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "../ui/card"

export function InputForm({
  onSubmit,
  disabled,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  disabled?: boolean
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [userInput, setUserInput] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const newHeight = Math.min(Math.max(textareaRef.current.scrollHeight, 24), 240)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }, [userInput])

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [imageUrl])

  const handleImageFile = (file: File, disableDataTransfer?: boolean) => {
    if (file.type.startsWith("image/")) {
      setImageUrl(URL.createObjectURL(file))

      if (fileInputRef.current && !disableDataTransfer) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        fileInputRef.current.files = dataTransfer.files
      }
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageFile(file, true)
    }
  }

  const handleClearImage = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl)
    }
    setImageUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return

    const items = e.clipboardData.items
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile()
        if (file) {
          handleImageFile(file)
          break
        }
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    const items = e.dataTransfer.files
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        handleImageFile(item)
        break
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
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onPaste={handlePaste}
      className="flex w-full flex-col gap-4"
    >
      <Card
        className={`overflow-hidden ${isDragging ? "ring-2 ring-primary" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="relative h-[200px] w-full p-0">
          <ImageUpload
            imageUrl={imageUrl}
            fileInputRef={fileInputRef}
            onImageChange={handleImageChange}
            onClearImage={handleClearImage}
            onImageClick={() => setIsModalOpen(true)}
            disabled={disabled}
          />
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardContent className="relative h-fit w-full p-0">
          <div className="m-2 flex w-[calc(100%-1rem)] flex-row items-end gap-2">
            <textarea
              ref={textareaRef}
              className="w-full resize-none rounded p-2 ring-offset-background focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-transparent"
              name="userInput"
              value={userInput}
              placeholder="Type and/or upload your math problem..."
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  if (!disabled && (userInput || imageUrl)) {
                    formRef.current?.requestSubmit()
                  }
                }
              }}
              rows={1}
              style={{
                minHeight: "24px",
                maxHeight: "240px",
                overflow: "auto",
              }}
              disabled={disabled}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="h-fit rounded-lg bg-primary px-4 py-2 text-white transition-colors duration-200 hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={(!userInput && !imageUrl) || disabled}
              >
                Submit
              </button>
            </div>
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
