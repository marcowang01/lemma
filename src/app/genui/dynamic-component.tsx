"use client"
import * as LucideIcons from "lucide-react"
import * as React from "react"
import { useEffect, useState } from "react"
import * as Recharts from "recharts"

// Import all UI components explicitly
import { Badge, badgeVariants } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Create a components object with explicit typing
const components = {
  // React core
  React,
  useState,
  useEffect,
  // Libraries
  ...Recharts,
  ...LucideIcons,
  // UI Components
  Badge,
  badgeVariants,
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Input,
  Label,
  Progress,
  ScrollArea,
  ScrollBar,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} as const

function createComponent(code: string | null): React.ComponentType<any> {
  if (!code) {
    return () => <div>No code provided</div>
  }

  try {
    // Wrap the transformed code in a module-style wrapper
    const wrappedCode = `
      const {${Object.keys(components).join(",")}} = dependencies;
      ${code}
      return DynamicChart;
    `

    // Create and execute the function with dependencies
    const constructorFn = new Function("dependencies", wrappedCode)
    return constructorFn(components)
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
