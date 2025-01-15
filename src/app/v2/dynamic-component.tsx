"use client"
import { COMPONENT_NAME } from "@/lib/prompts"
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
      return ${COMPONENT_NAME};
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
