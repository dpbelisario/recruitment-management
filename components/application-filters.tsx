import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { positions, statusLabels } from "@/lib/sample-data"
import type { ApplicationFilters as FilterType, ApplicationStatus, Application } from "@/lib/types"

interface ApplicationFiltersProps {
  filters: FilterType
  onFiltersChange: (filters: FilterType) => void
  applications: Application[]
}

export function ApplicationFilters({ filters, onFiltersChange, applications }: ApplicationFiltersProps) {
  const reviewers = Array.from(
    new Set(
      applications.map((app) => app.assignedReviewer).filter((reviewer): reviewer is string => Boolean(reviewer)),
    ),
  )

  const handleStatusChange = (status: ApplicationStatus, checked: boolean) => {
    const currentStatuses = filters.status || []
    const newStatuses = checked ? [...currentStatuses, status] : currentStatuses.filter((s) => s !== status)

    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    })
  }

  const handlePositionChange = (position: string, checked: boolean) => {
    const currentPositions = filters.position || []
    const newPositions = checked ? [...currentPositions, position] : currentPositions.filter((p) => p !== position)

    onFiltersChange({
      ...filters,
      position: newPositions.length > 0 ? newPositions : undefined,
    })
  }

  const handleReviewerChange = (reviewer: string, checked: boolean) => {
    const currentReviewers = filters.assignedReviewer || []
    const newReviewers = checked ? [...currentReviewers, reviewer] : currentReviewers.filter((r) => r !== reviewer)

    onFiltersChange({
      ...filters,
      assignedReviewer: newReviewers.length > 0 ? newReviewers : undefined,
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Status Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(Object.keys(statusLabels) as ApplicationStatus[]).map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status}`}
                checked={filters.status?.includes(status) || false}
                onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
              />
              <Label htmlFor={`status-${status}`} className="text-sm font-normal cursor-pointer">
                {statusLabels[status]}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Position Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Position</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {positions.slice(0, 6).map((position) => (
            <div key={position} className="flex items-center space-x-2">
              <Checkbox
                id={`position-${position}`}
                checked={filters.position?.includes(position) || false}
                onCheckedChange={(checked) => handlePositionChange(position, checked as boolean)}
              />
              <Label htmlFor={`position-${position}`} className="text-sm font-normal cursor-pointer">
                {position}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reviewer Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Assigned Reviewer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {reviewers.map((reviewer) => (
            <div key={reviewer} className="flex items-center space-x-2">
              <Checkbox
                id={`reviewer-${reviewer}`}
                checked={filters.assignedReviewer?.includes(reviewer) || false}
                onCheckedChange={(checked) => handleReviewerChange(reviewer, checked as boolean)}
              />
              <Label htmlFor={`reviewer-${reviewer}`} className="text-sm font-normal cursor-pointer">
                {reviewer}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
