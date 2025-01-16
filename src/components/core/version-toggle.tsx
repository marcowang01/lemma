"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function VersionToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch by mounting only on client
  useEffect(() => {
    setMounted(true)
  }, [])

  const isStable = pathname === "/"

  const handleClick = () => {
    if (isStable) {
      router.push("/v2")
    } else {
      router.push("/")
    }
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) return null

  return (
    <button
      onClick={handleClick}
      className="fixed right-2 top-2 text-lg font-thin border border-background rounded-md px-2 py-1 text-foreground transition-colors hover:text-muted-foreground hover:border-muted-foreground"
    >
      {isStable ? "v1.0" : "v2.0"}
    </button>
  )
}
