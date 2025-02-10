"use client"

import { Badge } from "@/components/core/badge"
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { SendIcon } from "@/svg/sendIcon"
import { UploadIcon } from "@/svg/uploadIcon"
import { X as XIcon } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

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
  const [reasoningEnabled, setReasoningEnabled] = useState(false)

  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const reasoningCheckboxRef = useRef<HTMLInputElement>(null)
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

  const handleReasoningToggle = () => {
    const checkbox = reasoningCheckboxRef.current
    if (checkbox) {
      checkbox.toggleAttribute("checked")
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onPaste={handlePaste}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex h-full w-full flex-col gap-4"
    >
      {/* <div
        className={`overflow-hidden ${isDragging ? "ring-2 ring-primary" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="relative h-[200px] w-full p-0">
          <ImageUpload
            imageUrl={imageUrl}
            fileInputRef={fileInputRef}
            onImageChange={handleImageChange}
            onClearImage={handleClearImage}
            onImageClick={() => setIsModalOpen(true)}
            disabled={disabled}
          />
        </div>
      </div> */}
      <input
        ref={fileInputRef}
        type="file"
        name="imageInput"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id="photo-upload"
        disabled={disabled}
      />
      <input
        className="hidden"
        type="checkbox"
        name="reasoningEnabled"
        id="reasoning-enabled"
        checked={reasoningEnabled}
        onChange={(e) => setReasoningEnabled(e.target.checked)}
        ref={reasoningCheckboxRef}
      />
      <div className="flex h-full w-full flex-col items-end justify-between gap-2 rounded-xl bg-transparent p-4">
        <textarea
          ref={textareaRef}
          className={cn(
            cn(
              "h-full w-full grow resize-none rounded bg-transparent p-2",
              "placeholder:text-natural font-sans text-2xl font-light",
              "ring-offset-background",
              "placeholder:italic",
              "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
              "disabled:cursor-not-allowed disabled:bg-transparent",
              {
                "opacity-50": disabled,
              }
            )
          )}
          name="userInput"
          value={userInput}
          placeholder="Type, paste, upload, or drag and drop your math problem here..."
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
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <label
              className={cn(
                "text-dark-gray hover:text-dark-dark-gray ml-4 cursor-pointer transition-colors duration-200",
                imageUrl && "hidden"
              )}
              htmlFor="photo-upload"
            >
              <UploadIcon width={22} height={22} />
            </label>
            {imageUrl && (
              <div className="relative">
                <Image
                  src={imageUrl}
                  alt="Math problem"
                  objectFit="cover"
                  className="aspect-square cursor-pointer rounded-lg transition-opacity duration-200 hover:opacity-80"
                  onClick={() => setIsModalOpen(true)}
                  width={50}
                  height={50}
                />
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="bg-primary-yellow absolute -right-2 -top-2 rounded-full p-1 text-black shadow-sm hover:opacity-70"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-6">
            <label htmlFor="reasoning-enabled">
              <Badge
                className={cn(
                  "cursor-pointer select-none hover:opacity-80",
                  reasoningEnabled
                    ? "bg-primary-yellow text-black"
                    : "border-dark-gray bg-transparent"
                )}
                onClick={handleReasoningToggle}
              >
                Reasoning
              </Badge>
            </label>
            <button
              type="submit"
              className="h-fit rounded-lg text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={(!userInput && !imageUrl) || disabled}
            >
              <SendIcon width={50} height={50} />
            </button>
          </div>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-natural m-0 max-w-[50%] border-0 px-4 pb-4 pt-12 outline-none">
          <div hidden>
            <DialogTitle>Uploaded Image</DialogTitle>
          </div>
          <div className="h-full w-full">
            <Image
              src={imageUrl ?? ""}
              alt="Math problem enlarged"
              className="h-auto w-[80vh] rounded-md object-contain"
              width={1000}
              height={1000}
            />
          </div>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 outline-none transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 disabled:pointer-events-none">
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </form>
  )
}
