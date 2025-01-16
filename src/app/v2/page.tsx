"use client"

import { InputForm } from "@/components/core/input-form"
import { useState } from "react"
import { DynamicComponent } from "./dynamic-component"

export default function Page() {
  const [code, setCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    console.log(`formData: ${JSON.stringify(formData, null, 2)}`)

    try {
      setLoading(true)
      const res = await fetch("/api/genui", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        throw new Error("Failed to fetch code")
      }
      const data = await res.json()
      setCode(data.code)
      setError(null)
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto max-w-4xl p-4">
      <div className="grid gap-8 md:grid-cols-1">
        <InputForm onSubmit={handleSubmit} />
        {loading && <div>Generating your solution...</div>}
        {error && <div>Error: {error}</div>}
        <DynamicComponent code={code ?? ""} />
      </div>
    </main>
  )
}
