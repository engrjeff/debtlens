import {  clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type {ClassValue} from "clsx";

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
