"use client"
import * as React from "react"
import { useEffect } from "react"
import { componentList } from "./component-list"

function createComponent(code: string | null): React.ComponentType<any> {
  if (!code) {
    return () => <div>No code provided</div>
  }

  try {
    // Wrap the transformed code in a module-style wrapper
    const wrappedCode = `
      const {${Object.keys(componentList).join(",")}} = dependencies;
      ${code}
      return DynamicChart;
    `

    // Create and execute the function with dependencies
    const constructorFn = new Function("dependencies", wrappedCode)
    return constructorFn(componentList)
  } catch (error) {
    console.error("Error creating component:", error)
    return () => <div>Error rendering component: {String(error)}</div>
  }
}

export function DynamicComponent({ code }: { code: string }): React.ReactNode {
  const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null)

  useEffect(() => {
    if (code) {
      try {
        const ComponentFn = createComponent(code)
        setComponent(() => ComponentFn)
      } catch {
        setComponent(null)
      }
    }
  }, [code])

  return Component ? <Component /> : null
}

export default function DynamicPreviewPage(): React.ReactNode {
  const [code, setCode] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

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
    <div className="p-4">
      <DynamicComponent code={code ?? ""} />
    </div>
  )
}
