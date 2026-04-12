import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ClassValue } from "clsx"
import { siteConfig } from "@/config/site"

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function getInitials(
  firstName?: string | null,
  lastName?: string | null,
  name?: string | null
) {
  if (firstName || lastName) {
    return [firstName, lastName]
      .filter(Boolean)
      .map((n) => n![0].toUpperCase())
      .join("")
  }
  return name?.[0]?.toUpperCase() ?? "?"
}

export function generatePageTitle(title: string) {
  return `${title} | ${siteConfig.title}`
}
