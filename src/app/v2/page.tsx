import { useEffect, useState } from "react"
import { DynamicComponent } from "./dynamic-component"

export default function Page() {
  const [code, setCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const res = await fetch("/api/genui", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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

    fetchCode()
  }, [])

  if (loading) {
    return <div>Loading UI...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <main className="container mx-auto max-w-6xl p-4">
      <DynamicComponent code={code ?? ""} />
    </main>
  )
}
