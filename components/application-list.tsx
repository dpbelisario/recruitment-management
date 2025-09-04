"use client"

import { useState } from "react"
import {
  MoreHorizontal,
  Eye,
  MessageSquare,
  Calendar,
  Mail,
  GraduationCap,
  TrendingUp,
  Briefcase,
  FileText,
  ArrowRightLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"
import { statusColors, statusLabels } from "@/lib/sample-data"
import { PhaseTransitionDialog } from "@/components/phase-transition-dialog"
import type { Application, ApplicationStatus } from "@/lib/types"

interface ApplicationListProps {
  applications: Application[]
  currentUser: any
  onViewApplication?: (applicationId: string) => void
  onStatusChange?: (applicationId: string, status: ApplicationStatus, reason?: string) => void
  selectedApplicationIds?: string[]
  onSelectApplication?: (applicationId: string, checked: boolean) => void
  showSelection?: boolean
}

export function ApplicationList({
  applications,
  currentUser,
  onViewApplication,
  onStatusChange,
  selectedApplicationIds = [],
  onSelectApplication,
  showSelection = false,
}: ApplicationListProps) {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null)
  const [phaseTransitionDialog, setPhaseTransitionDialog] = useState<{
    isOpen: boolean
    application: Application | null
  }>({
    isOpen: false,
    application: null
  })

  const handlePhaseTransition = async (applicationId: string, newStatus: ApplicationStatus, reason?: string) => {
    await onStatusChange?.(applicationId, newStatus, reason)
  }

  if (applications.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <p className="text-lg font-medium text-muted-foreground">No applications found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      {applications.map((application) => (
        <Card
          key={application.id}
          className={`border transition-all hover:shadow-md ${
            selectedApplication === application.id ? "ring-2 ring-primary" : ""
          } ${selectedApplicationIds.includes(application.id) ? "bg-primary/5" : ""}`}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {showSelection && onSelectApplication && (
                  <Checkbox
                    checked={selectedApplicationIds.includes(application.id)}
                    onCheckedChange={(checked) => onSelectApplication(application.id, checked as boolean)}
                    className="mt-3"
                  />
                )}

                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedApplication(application.id)}>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {application.firstName && application.lastName
                          ? `${application.firstName[0]}${application.lastName[0]}`
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {application.firstName && application.lastName
                          ? `${application.firstName} ${application.lastName}`
                          : "Unknown Applicant"}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">{application.position}</p>
                    </div>
                    <Badge 
                      className={`${statusColors[application.status]} cursor-pointer hover:opacity-80 transition-opacity`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setPhaseTransitionDialog({
                          isOpen: true,
                          application: application
                        })
                      }}
                    >
                      {statusLabels[application.status]}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{application.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      <span className="truncate">{application.majorAndGraduation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Applied {formatDate(application.applicationDate)}</span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    {application.previousRole && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        <span className="truncate">{application.previousRole}</span>
                      </div>
                    )}
                    {application.growthMetrics && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span className="truncate">{application.growthMetrics}</span>
                      </div>
                    )}
                    {application.resumeUrl && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>Resume attached</span>
                      </div>
                    )}
                  </div>

                  {application.assignedReviewer && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Assigned to:</span>
                      <Badge variant="outline" className="text-xs">
                        {application.assignedReviewer}
                      </Badge>
                    </div>
                  )}

                  {application.notes.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      <span>
                        {application.notes.length} note{application.notes.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewApplication?.(application.id)
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Application</DropdownMenuItem>
                    <DropdownMenuItem>Assign Reviewer</DropdownMenuItem>
                    <DropdownMenuItem>Add Note</DropdownMenuItem>
                    <DropdownMenuItem>Download Resume</DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setPhaseTransitionDialog({
                        isOpen: true,
                        application: application
                      })}
                      className="flex items-center gap-2"
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                      Move to Different Phase
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete Application</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <PhaseTransitionDialog
        application={phaseTransitionDialog.application}
        isOpen={phaseTransitionDialog.isOpen}
        onClose={() => setPhaseTransitionDialog({ isOpen: false, application: null })}
        onTransition={handlePhaseTransition}
      />
    </div>
  )
}
