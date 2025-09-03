"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown, AlertTriangle } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import type { ApplicationStatus } from "@/lib/types"

interface DecisionDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (status: ApplicationStatus, reason: string) => void
  applicantName: string
  currentStatus: ApplicationStatus
  decisionType: "advance" | "move_back" | null
}

const decisionConfig = {
  advance: {
    title: "Advance to Next Phase",
    description: "This will move the application to the next phase in the recruitment process.",
    icon: ArrowUp,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    reasons: [
      "Meets requirements for next phase",
      "Strong performance in current phase",
      "Positive team feedback",
      "Skills align with role needs",
      "Good cultural fit assessment",
      "Other (specify below)",
    ],
  },
  move_back: {
    title: "Move Back to Previous Phase",
    description: "This will move the application back to the previous phase for further review.",
    icon: ArrowDown,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    reasons: [
      "Additional information needed",
      "Requires further evaluation",
      "Team discussion required",
      "Skills assessment incomplete",
      "Documentation missing",
      "Other (specify below)",
    ],
  },
}

export function DecisionDialog({
  isOpen,
  onClose,
  onConfirm,
  applicantName,
  currentStatus,
  decisionType,
}: DecisionDialogProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!decisionType) return null

  const config = decisionConfig[decisionType]
  const Icon = config.icon

  const handleConfirm = async () => {
    const reason = selectedReason === "Other (specify below)" ? customReason : selectedReason

    if (!reason.trim()) return

    setIsSubmitting(true)

    try {
      let newStatus: ApplicationStatus = currentStatus

      if (decisionType === "advance") {
        if (currentStatus === "submitted") newStatus = "interview"
        else if (currentStatus === "interview") newStatus = "shortlisted"
      } else if (decisionType === "move_back") {
        if (currentStatus === "shortlisted") newStatus = "interview"
        else if (currentStatus === "interview") newStatus = "submitted"
      }

      await onConfirm(newStatus, reason.trim())
      handleClose()
    } catch (error) {
      console.error("Error updating application status:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSelectedReason("")
    setCustomReason("")
    setIsSubmitting(false)
    onClose()
  }

  const isFormValid = selectedReason && (selectedReason !== "Other (specify below)" || customReason.trim())

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className={`flex items-center gap-3 p-4 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
            <Icon className={`h-6 w-6 ${config.color}`} />
            <div>
              <DialogTitle className="text-lg font-semibold">{config.title}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{applicantName}</p>
            </div>
          </div>
          <DialogDescription className="pt-4">{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status Info */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              Current phase:{" "}
              <Badge variant="outline" className="mx-1">
                {currentStatus === "submitted"
                  ? "3) Submitted Application"
                  : currentStatus === "interview"
                    ? "2) Invited to Interview"
                    : "1) Shortlisted"}
              </Badge>
            </span>
          </div>

          {/* Reason Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Reason for decision (required)</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {config.reasons.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason} id={reason} />
                  <Label htmlFor={reason} className="text-sm cursor-pointer">
                    {reason}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Custom Reason Input */}
          {selectedReason === "Other (specify below)" && (
            <div className="space-y-2">
              <Label htmlFor="custom-reason" className="text-sm font-medium">
                Please specify the reason
              </Label>
              <Textarea
                id="custom-reason"
                placeholder="Enter your reason here..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
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
            {isSubmitting ? "Processing..." : `Confirm ${config.title}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
