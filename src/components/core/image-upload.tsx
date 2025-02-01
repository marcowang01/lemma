"use client"

import { Edit, Trash2, Upload } from "lucide-react"

interface ImageUploadProps {
  imageUrl: string | null
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClearImage: () => void
  onImageClick: () => void
  disabled?: boolean
}

export function ImageUpload({
  imageUrl,
  onImageChange,
  onClearImage,
  onImageClick,
  disabled,
}: ImageUploadProps) {
  return (
    <>
      <div className={`h-full w-full p-2`}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Math problem"
            className="h-full w-auto cursor-pointer rounded-lg object-contain transition-opacity duration-200 hover:opacity-80"
            onClick={() => imageUrl && onImageClick()}
          />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0">
        <input
          type="file"
          name="imageInput"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
          id="photo-upload"
          disabled={disabled}
        />

        <label
          htmlFor="photo-upload"
          className={`pointer-events-auto absolute flex cursor-pointer items-center rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/70 ${
            imageUrl
              ? "bottom-2 right-2"
              : "inset-0 mx-auto my-auto h-fit w-fit items-center justify-center"
          }`}
        >
          {imageUrl ? (
            <Edit size={16} className="mr-2" />
          ) : (
            <Upload size={16} className="mr-2 shrink-0" />
          )}
          <span>{imageUrl ? "Edit Image" : "Upload Image"}</span>
        </label>
        <div className="absolute bottom-2 right-[155px] flex gap-2">
          {imageUrl && (
            <button
              type="button"
              onClick={onClearImage}
              className="pointer-events-auto flex h-[40px] items-center rounded-full bg-red-500 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-red-600"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </>
  )
}
