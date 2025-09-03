"use client"

import { useState } from "react"
import {
  X,
  Download,
  ExternalLink,
  MessageSquare,
  Calendar,
  Mail,
  Phone,
  DollarSign,
  Clock,
  FileText,
  GraduationCap,
  Briefcase,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DecisionDialog } from "@/components/decision-dialog"
import { formatDate, formatDateTime } from "@/lib/utils"
import { statusColors, statusLabels } from "@/lib/sample-data"
import type { Application, ApplicationStatus } from "@/lib/types"

interface ApplicationDetailViewProps {
  application: Application
  currentUser: any
  onClose: () => void
  onStatusChange?: (applicationId: string, status: ApplicationStatus, reason?: string) => void
  onAddNote?: (applicationId: string, note: string) => void
}

export function ApplicationDetailView({
  application,
  currentUser,
  onClose,
  onStatusChange,
  onAddNote,
}: ApplicationDetailViewProps) {
  const [newNote, setNewNote] = useState("")
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [decisionDialog, setDecisionDialog] = useState<{
    isOpen: boolean
    type: "advance" | "move_back" | null
  }>({
    isOpen: false,
    type: null,
  })

  const handleAddNote = () => {
    if (newNote.trim() && onAddNote) {
      onAddNote(application.id, newNote.trim())
      setNewNote("")
      setIsAddingNote(false)
    }
  }

  const handleDecisionClick = (type: "advance" | "move_back") => {
    setDecisionDialog({ isOpen: true, type })
  }

  const handleDecisionConfirm = (status: ApplicationStatus, reason: string) => {
    if (onStatusChange) {
      onStatusChange(application.id, status, reason)
    }
    setDecisionDialog({ isOpen: false, type: null })
  }

  const handleDecisionClose = () => {
    setDecisionDialog({ isOpen: false, type: null })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                {application.applicantName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{application.applicantName}</h2>
              <p className="text-muted-foreground">{application.position}</p>
            </div>
            <Badge className={statusColors[application.status]}>{statusLabels[application.status]}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  More Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Assign Reviewer</DropdownMenuItem>
                <DropdownMenuItem>Send Email</DropdownMenuItem>
                <DropdownMenuItem>Export Details</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete Application</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{application.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{application.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Application Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(application.applicationDate)}</p>
                  </div>
                </div>
                {application.availableStartDate && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Available Start Date</p>
                      <p className="text-sm text-muted-foreground">{formatDate(application.availableStartDate)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Professional Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground leading-relaxed">{application.experience}</p>
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground leading-relaxed">{application.education}</p>
                </CardContent>
              </Card>
            </div>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {application.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Salary & Documents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Salary Expectations */}
              {application.expectedSalary && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Salary Expectations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold text-foreground">{application.expectedSalary}</p>
                  </CardContent>
                </Card>
              )}

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {application.resumeUrl && (
                    <div className="flex items-center justify-between p-3 border border-border rounded-md">
                      <span className="text-sm font-medium">Resume</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                  {application.portfolioUrl && (
                    <div className="flex items-center justify-between p-3 border border-border rounded-md">
                      <span className="text-sm font-medium">Portfolio</span>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Cover Letter */}
            {application.coverLetter && (
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {application.coverLetter}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Assignment Info */}
            {application.assignedReviewer && (
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Assigned to:</span>
                    <Badge variant="outline">{application.assignedReviewer}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Internal Notes ({application.notes.length})
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsAddingNote(!isAddingNote)}>
                    Add Note
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Note Form */}
                {isAddingNote && (
                  <div className="space-y-3 p-4 border border-border rounded-md bg-muted/20">
                    <Label htmlFor="new-note">Add Internal Note</Label>
                    <Textarea
                      id="new-note"
                      placeholder="Enter your note here..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>
                        Add Note
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsAddingNote(false)
                          setNewNote("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Existing Notes */}
                {application.notes.length > 0 ? (
                  <div className="space-y-3">
                    {application.notes.map((note) => (
                      <div key={note.id} className="p-4 border border-border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{note.authorName}</span>
                          <span className="text-xs text-muted-foreground">{formatDateTime(note.createdAt)}</span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{note.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No notes yet. Add the first note to start the conversation.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Last updated: {formatDateTime(application.updatedAt)}</div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {application.status !== "submitted" && (
                <Button variant="outline" onClick={() => handleDecisionClick("move_back")}>
                  Move Back
                </Button>
              )}
              {application.status !== "shortlisted" && (
                <Button onClick={() => handleDecisionClick("advance")}>Advance to Next Phase</Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <DecisionDialog
        isOpen={decisionDialog.isOpen}
        onClose={handleDecisionClose}
        onConfirm={handleDecisionConfirm}
        applicantName={application.applicantName}
        currentStatus={application.status}
        decisionType={decisionDialog.type}
      />
    </div>
  )
}
