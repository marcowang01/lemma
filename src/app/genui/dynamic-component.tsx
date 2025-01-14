// utils/componentRenderer.js
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
import { Progress } from "@/components/ui/progress"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { transform } from "@babel/standalone"
import * as LucideIcons from "lucide-react"
import * as React from "react"
import { useState } from "react"
import * as Recharts from "recharts"

export function createComponent(code: string) {
  try {
    // Transform JSX to JavaScript
    const transformed = transform(code, {
      presets: ["react"],
      filename: "dynamic.js",
    }).code

    // Create a function that will execute the code with provided dependencies
    const functionBody = `
      const exports = {};
      const module = { exports };
      with (dependencies) {
        ${transformed}
      }
      return module.exports.default || module.exports;
    `

    // Create the actual function with dependencies in scope
    const constructorFn = new Function("dependencies", functionBody)

    // Execute the function with all required dependencies
    return constructorFn({
      React,
      useState: React.useState,
      useEffect: React.useEffect,
      ...Recharts,
      ...LucideIcons,
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardFooter,
      CardTitle,
      Breadcrumb,
      BreadcrumbList,
      BreadcrumbItem,
      BreadcrumbLink,
      BreadcrumbPage,
      BreadcrumbSeparator,
      BreadcrumbEllipsis,
      Checkbox,
      Progress,
      ScrollArea,
      ScrollBar,
      Tabs,
      TabsList,
      TabsTrigger,
      TabsContent,
      Tooltip,
      TooltipTrigger,
      TooltipContent,
      TooltipProvider,
      Collapsible,
      CollapsibleContent,
      CollapsibleTrigger,
    })
  } catch (error) {
    console.error("Error creating component:", error)
    return () => <div>Error rendering component: {String(error)}</div>
  }
}

// components/DynamicComponent.jsx
export function DynamicComponent({ code }: { code: string }) {
  const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    try {
      const ComponentFn = createComponent(code)
      setComponent(() => ComponentFn)
      setError(null)
    } catch (err) {
      setError(String(err))
      setComponent(null)
    }
  }, [code])

  if (error) {
    return <div>Error: {error}</div>
  }

  return Component ? <Component /> : null
}

// Example usage in a page:
// pages/dynamic-preview.jsx
export default function DynamicPreviewPage() {
  const [componentCode, setComponentCode] = useState(`
    import React from 'react';
    import { LineChart, Line, XAxis, YAxis } from 'recharts';
    import { Activity } from 'lucide-react';
    import { Card } from '@/components/ui/card';

    export default function DynamicChart() {
      const data = [
        { name: 'Jan', value: 400 },
        { name: 'Feb', value: 300 },
        { name: 'Mar', value: 600 }
      ];

      return (
        <Card className="p-6">
          <Activity className="w-6 h-6 text-blue-500" />
          <LineChart width={500} height={300} data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </Card>
      );
    }
  `)

  return (
    <div className="p-4">
      <DynamicComponent code={componentCode} />
    </div>
  )
}
