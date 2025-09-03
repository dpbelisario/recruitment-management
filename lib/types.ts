export type ApplicationStatus = "submitted" | "interview" | "shortlisted"

export type UserRole = "associate" | "management"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export interface Application {
  id: string
  applicantName: string
  email: string
  phone: string
  position: string
  applicationDate: string
  status: ApplicationStatus
  assignedReviewer?: string
  resumeUrl?: string
  portfolioUrl?: string
  coverLetter?: string
  experience: string
  education: string
  skills: string[]
  expectedSalary?: string
  availableStartDate?: string
  notes: Note[]
  createdAt: string
  updatedAt: string
}

export interface Note {
  id: string
  applicationId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
  isInternal: boolean
}

export interface ApplicationFilters {
  status?: ApplicationStatus[]
  position?: string[]
  assignedReviewer?: string[]
  dateRange?: {
    start: string
    end: string
  }
  search?: string
}

export interface AnalyticsData {
  totalApplications: number
  applicationsByStatus: Record<ApplicationStatus, number>
  applicationsByPosition: Record<string, number>
  averageProcessingTime: number
  approvalRate: number
  applicationTrends: {
    date: string
    count: number
  }[]
}
