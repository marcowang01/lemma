"use client"

import { Badge } from "@/components/core/badge"
import { InputForm } from "@/components/core/input-form"
import { cn } from "@/lib/utils"
import { marked } from "marked"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useFormContext } from "./context/form-context"

export enum QuestionType {
  HOMEWORK_HELP = "homework help",
  EXAM_PREP = "exam prep",
  QUICK_ANSWERS = "quick answers",
  LEARN_NEW_CONCEPTS = "learn new concepts",
}

export default function HomePage() {
  const { setFormData } = useFormContext()
  const router = useRouter()

  const [questionType, setQuestionType] = useState<QuestionType | null>(null)

  useEffect(() => {
    marked.setOptions({
      gfm: true,
      breaks: true,
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    setFormData(formData)
    router.push("/solve")
  }

  return (
    <main className="flex-col items-center justify-center">
      <h1 className="flex flex-col items-center font-appleGaramond text-9xl font-light italic tracking-tight">
        lemma
      </h1>
      <div className="mt-24 w-full">
        <div className="hidden items-center justify-start gap-4 md:flex">
          {Object.values(QuestionType).map((type) => (
            <Badge
              key={`${type}-badge`}
              className={cn(
                "cursor-pointer select-none hover:opacity-80",
                questionType !== type && "border-dark-gray bg-transparent"
              )}
              onClick={() => setQuestionType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>
      <div className="mb-48 mt-4 w-full rounded-xl border border-black bg-gray-100 bg-opacity-50">
        <InputForm onSubmit={handleSubmit} disabled={false} />
      </div>
    </main>
  )
}
