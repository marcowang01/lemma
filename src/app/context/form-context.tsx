"use client"

import { createContext, ReactNode, useContext, useState } from "react"

type FormContextType = {
  formData: FormData | null
  setFormData: (data: FormData | null) => void
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData | null>(null)

  return <FormContext.Provider value={{ formData, setFormData }}>{children}</FormContext.Provider>
}

export function useFormContext() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider")
  }
  return context
}
