import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Application, ApplicationStatus } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function filterApplications(
  applications: Application[],
  filters: {
    status?: ApplicationStatus[]
    position?: string[]
    assignedReviewer?: string[]
    search?: string
  },
): Application[] {
  return applications.filter((app) => {
    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(app.status)) return false
    }

    // Position filter
    if (filters.position && filters.position.length > 0) {
      if (!filters.position.includes(app.position)) return false
    }

    // Assigned reviewer filter
    if (filters.assignedReviewer && filters.assignedReviewer.length > 0) {
      if (!app.assignedReviewer || !filters.assignedReviewer.includes(app.assignedReviewer)) return false
    }

    // Search filter
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase()
      const searchableText = [
        app.applicantName,
        app.email,
        app.position,
        app.skills.join(" "),
        app.experience,
        app.education,
      ]
        .join(" ")
        .toLowerCase()

      if (!searchableText.includes(searchTerm)) return false
    }

    return true
  })
}
