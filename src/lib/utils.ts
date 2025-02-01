import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function appendToLastElement(array: string[], element: string) {
  const lastElement = array[array.length - 1]
  const newLastElement = lastElement + element
  return [...array.slice(0, -1), newLastElement]
}
