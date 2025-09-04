"use client"

import { useState } from "react"
import { ArrowRight, ArrowLeft, CheckCircle, Clock, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { statusColors, statusLabels } from "@/lib/sample-data"
import type { Application, ApplicationStatus } from "@/lib/types"

interface PhaseTransitionDialogProps {
  application: Application | null
  isOpen: boolean
  onClose: () => void
  onTransition: (applicationId: string, newStatus: ApplicationStatus, reason?: string) => void
}

const phaseInfo = {
  submitted: {
    icon: Clock,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Application has been submitted and is awaiting initial review"
  },
  interview: {
    icon: UserCheck,
    color: "text-yellow-600", 
    bgColor: "bg-yellow-50",
    description: "Candidate has been invited for an interview"
  },
  shortlisted: {
    icon: CheckCircle,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "Candidate has been shortlisted for final consideration"
  }
}

export function PhaseTransitionDialog({
  application,
  isOpen,
  onClose,
  onTransition
}: PhaseTransitionDialogProps) {
  const [selectedPhase, setSelectedPhase] = useState<ApplicationStatus | null>(null)
  const [reason, setReason] = useState("")
  const [isTransitioning, setIsTransitioning] = useState(false)

  if (!application) return null

  const currentPhase = application.status
  const availablePhases = (['submitted', 'interview', 'shortlisted'] as ApplicationStatus[])
    .filter(phase => phase !== currentPhase)

  const handleTransition = async () => {
    if (!selectedPhase) return

    setIsTransitioning(true)
    try {
      await onTransition(application.id, selectedPhase, reason.trim() || undefined)
      setSelectedPhase(null)
      setReason("")
      onClose()
    } catch (error) {
      console.error('Failed to transition application:', error)
    } finally {
      setIsTransitioning(false)
    }
  }

  const getTransitionIcon = (fromPhase: ApplicationStatus, toPhase: ApplicationStatus) => {
    const phaseOrder = ['submitted', 'interview', 'shortlisted']
    const fromIndex = phaseOrder.indexOf(fromPhase)
    const toIndex = phaseOrder.indexOf(toPhase)
    
    return toIndex > fromIndex ? ArrowRight : ArrowLeft
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Move Application to Different Phase</DialogTitle>
          <DialogDescription>
            Move {application.firstName} {application.lastName}'s application to a different phase in the recruitment process.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Phase */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Phase</Label>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <div className={`p-2 rounded-full ${phaseInfo[currentPhase].bgColor}`}>
                <phaseInfo[currentPhase].icon className={`h-4 w-4 ${phaseInfo[currentPhase].color}`} />
              </div>
              <div className="flex-1">
                <Badge className={statusColors[currentPhase]}>
                  {statusLabels[currentPhase]}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {phaseInfo[currentPhase].description}
                </p>
              </div>
            </div>
          </div>

          {/* Available Transitions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Move To</Label>
            <div className="space-y-2">
              {availablePhases.map((phase) => {
                const TransitionIcon = getTransitionIcon(currentPhase, phase)
                const isSelected = selectedPhase === phase
                
                return (
                  <button
                    key={phase}
                    onClick={() => setSelectedPhase(phase)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      isSelected 
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className={`p-2 rounded-full ${phaseInfo[phase].bgColor}`}>
                      <phaseInfo[phase].icon className={`h-4 w-4 ${phaseInfo[phase].color}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[phase]}>
                          {statusLabels[phase]}
                        </Badge>
                        <TransitionIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {phaseInfo[phase].description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason (Optional)
            </Label>
            <Textarea
              id="reason"
              placeholder="Add a note about why you're moving this application..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isTransitioning}>
            Cancel
          </Button>
          <Button 
            onClick={handleTransition} 
            disabled={!selectedPhase || isTransitioning}
          >
            {isTransitioning ? "Moving..." : "Move Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
