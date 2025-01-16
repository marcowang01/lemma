"use client"

import { InputForm } from "@/components/core/input-form"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { DynamicComponent } from "./dynamic-component"

export default function Page() {
  const [code, setCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCode(null)
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    console.log(`formData: ${JSON.stringify(formData, null, 2)}`)

    try {
      const res = await fetch("/api/genui", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error)
      }
      const data = await res.json()
      setCode(data.code)
      setError(null)
    } catch (err) {
      console.error(`Error: ${err}`)
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto max-w-4xl p-4">
      <div className="grid gap-8 md:grid-cols-1">
        <InputForm onSubmit={handleSubmit} />
        <AnimatePresence mode="wait">
          {(loading || error) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={error ? "bg-red-50" : ""}>
                <CardContent className="flex flex-col items-center gap-4 py-6">
                  {loading && (
                    <div className="flex items-center gap-2">
                      <span>Generating your solution</span>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {error && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>Error: {error}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <DynamicComponent code={code ?? ""} />
      </div>
    </main>
  )
}
