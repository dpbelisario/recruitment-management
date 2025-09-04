"use client"

import { useState } from "react"
import { ArrowRight, ArrowLeft, CheckCircle, Clock, UserCheck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { statusColors, statusLabels } from "@/lib/sample-data"
import type { Application, ApplicationStatus } from "@/lib/types"

interface BulkPhaseTransitionDialogProps {
  applications: Application[]
  selectedApplicationIds: string[]
  isOpen: boolean
  onClose: () => void
  onBulkTransition: (applicationIds: string[], newStatus: ApplicationStatus, reason?: string) => void
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

export function BulkPhaseTransitionDialog({
  applications,
  selectedApplicationIds,
  isOpen,
  onClose,
  onBulkTransition
}: BulkPhaseTransitionDialogProps) {
  const [selectedPhase, setSelectedPhase] = useState<ApplicationStatus | null>(null)
  const [reason, setReason] = useState("")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const selectedApplications = applications.filter(app => selectedApplicationIds.includes(app.id))
  const currentPhases = [...new Set(selectedApplications.map(app => app.status))]

  const handleBulkTransition = async () => {
    if (!selectedPhase) return

    setIsTransitioning(true)
    try {
      await onBulkTransition(selectedApplicationIds, selectedPhase, reason.trim() || undefined)
      setSelectedPhase(null)
      setReason("")
      onClose()
    } catch (error) {
      console.error('Failed to transition applications:', error)
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

  const getPhaseCounts = () => {
    const counts: Record<ApplicationStatus, number> = {
      submitted: 0,
      interview: 0,
      shortlisted: 0
    }
    
    selectedApplications.forEach(app => {
      counts[app.status]++
    })
    
    return counts
  }

  const phaseCounts = getPhaseCounts()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Phase Transition
          </DialogTitle>
          <DialogDescription>
            Move {selectedApplicationIds.length} selected application{selectedApplicationIds.length !== 1 ? 's' : ''} to a different phase.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Phases Summary */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Phases</Label>
            <div className="space-y-2">
              {currentPhases.map((phase) => (
                <div key={phase} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className={`p-2 rounded-full ${phaseInfo[phase].bgColor}`}>
                    <phaseInfo[phase].icon className={`h-4 w-4 ${phaseInfo[phase].color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[phase]}>
                        {statusLabels[phase]}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {phaseCounts[phase]} application{phaseCounts[phase] !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Transitions */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Move All To</Label>
            <div className="space-y-2">
              {(['submitted', 'interview', 'shortlisted'] as ApplicationStatus[]).map((phase) => {
                const isSelected = selectedPhase === phase
                const willChange = currentPhases.some(currentPhase => currentPhase !== phase)
                
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
                        {willChange && (
                          <span className="text-xs text-muted-foreground">
                            (will change {currentPhases.filter(p => p !== phase).length} phase{currentPhases.filter(p => p !== phase).length !== 1 ? 's' : ''})
                          </span>
                        )}
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

          {/* Warning for mixed phases */}
          {currentPhases.length > 1 && (
            <Alert>
              <AlertDescription>
                You have applications in {currentPhases.length} different phases. 
                All selected applications will be moved to the chosen phase.
              </AlertDescription>
            </Alert>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason (Optional)
            </Label>
            <Textarea
              id="reason"
              placeholder="Add a note about why you're moving these applications..."
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
            onClick={handleBulkTransition} 
            disabled={!selectedPhase || isTransitioning}
          >
            {isTransitioning ? "Moving Applications..." : `Move ${selectedApplicationIds.length} Application${selectedApplicationIds.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
