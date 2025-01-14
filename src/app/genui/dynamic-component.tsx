"use client"
import * as React from "react"
import { useEffect } from "react"

// Import all UI components explicitly
import { componentList } from "./imports"

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

export function DynamicComponent(): React.ReactNode {
  const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [code, setCode] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)

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
      } catch (err) {
        setError(String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchCode()
  }, [])

  useEffect(() => {
    if (code) {
      try {
        const ComponentFn = createComponent(code)
        setComponent(() => ComponentFn)
        setError(null)
      } catch (err) {
        setError(String(err))
        setComponent(null)
      }
    }
  }, [code])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return Component ? <Component /> : null
}

export default function DynamicPreviewPage(): React.ReactNode {
  return (
    <div className="p-4">
      <DynamicComponent />
    </div>
  )
}
