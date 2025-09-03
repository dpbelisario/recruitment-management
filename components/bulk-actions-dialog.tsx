"use client"

import { useState } from "react"
import { Users, ArrowUp, ArrowDown, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { sampleUsers } from "@/lib/sample-data"
import type { Application } from "@/lib/types"

interface BulkActionsDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedApplications: Application[]
  onBulkAction: (action: string, data: any) => void
}

const bulkActions = [
  {
    id: "advance",
    label: "Advance to Next Phase",
    description: "Move selected applications to the next phase in the recruitment process",
    icon: ArrowUp,
    color: "text-green-600",
  },
  {
    id: "move_back",
    label: "Move Back to Previous Phase",
    description: "Move selected applications back to the previous phase",
    icon: ArrowDown,
    color: "text-orange-600",
  },
  {
    id: "assign",
    label: "Assign Reviewer",
    description: "Assign a reviewer to all selected applications",
    icon: UserCheck,
    color: "text-blue-600",
  },
]

export function BulkActionsDialog({ isOpen, onClose, selectedApplications, onBulkAction }: BulkActionsDialogProps) {
  const [selectedAction, setSelectedAction] = useState("")
  const [reason, setReason] = useState("")
  const [assignedReviewer, setAssignedReviewer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    if (!selectedAction) return

    setIsSubmitting(true)

    try {
      const actionData: any = {
        applicationIds: selectedApplications.map((app) => app.id),
        reason: reason.trim(),
      }

      if (selectedAction === "assign") {
        actionData.reviewerId = assignedReviewer
      }

      await onBulkAction(selectedAction, actionData)
      handleClose()
    } catch (error) {
      console.error("Error performing bulk action:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSelectedAction("")
    setReason("")
    setAssignedReviewer("")
    setIsSubmitting(false)
    onClose()
  }

  const selectedActionConfig = bulkActions.find((action) => action.id === selectedAction)
  const isFormValid =
    selectedAction &&
    (selectedAction === "assign" ? assignedReviewer : true) &&
    (selectedAction !== "assign" ? reason.trim() : true)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Actions
          </DialogTitle>
          <DialogDescription>
            Perform actions on {selectedApplications.length} selected application
            {selectedApplications.length !== 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Applications Preview */}
          <div className="p-3 bg-muted/30 rounded-md">
            <p className="text-sm font-medium mb-2">Selected Applications:</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {selectedApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between text-sm">
                  <span>{app.applicantName}</span>
                  <Badge variant="outline" className="text-xs">
                    {app.position}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Action Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Action</Label>
            <RadioGroup value={selectedAction} onValueChange={setSelectedAction}>
              {bulkActions.map((action) => {
                const Icon = action.icon
                return (
                  <div
                    key={action.id}
                    className="flex items-center space-x-3 p-3 border border-border rounded-md hover:bg-muted/20"
                  >
                    <RadioGroupItem value={action.id} id={action.id} />
                    <Icon className={`h-4 w-4 ${action.color}`} />
                    <div className="flex-1">
                      <Label htmlFor={action.id} className="text-sm font-medium cursor-pointer">
                        {action.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                )
              })}
            </RadioGroup>
          </div>

          {/* Reviewer Assignment */}
          {selectedAction === "assign" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Assign to Reviewer</Label>
              <Select value={assignedReviewer} onValueChange={setAssignedReviewer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  {sampleUsers.map((user) => (
                    <SelectItem key={user.id} value={user.name}>
                      <div className="flex items-center gap-2">
                        <span>{user.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Reason Input */}
          {selectedAction && selectedAction !== "assign" && (
            <div className="space-y-2">
              <Label htmlFor="bulk-reason" className="text-sm font-medium">
                Reason for {selectedActionConfig?.label.toLowerCase()} (required)
              </Label>
              <Textarea
                id="bulk-reason"
                placeholder="Enter reason for this bulk action..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!isFormValid || isSubmitting}>
            {isSubmitting
              ? "Processing..."
              : `Apply to ${selectedApplications.length} Application${selectedApplications.length !== 1 ? "s" : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
