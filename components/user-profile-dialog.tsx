"use client"

import { useState } from "react"
import { User, Mail, Shield, Settings, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import type { User as UserType } from "@/lib/types"

interface UserProfileDialogProps {
  isOpen: boolean
  onClose: () => void
  user: UserType
  onUpdateUser: (user: UserType) => void
}

export function UserProfileDialog({ isOpen, onClose, user, onUpdateUser }: UserProfileDialogProps) {
  const [editedUser, setEditedUser] = useState<UserType>(user)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onUpdateUser(editedUser)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating user:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedUser(user)
    setIsEditing(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </DialogTitle>
          <DialogDescription>View and manage your profile information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={editedUser.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                  {editedUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{editedUser.name}</h3>
              <Badge variant={editedUser.role === "management" ? "default" : "secondary"}>
                {editedUser.role === "management" ? "Management" : "Associate"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                value={editedUser.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={editedUser.email}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role
              </Label>
              <div className="p-3 border border-border rounded-md bg-muted/20">
                <Badge variant={editedUser.role === "management" ? "default" : "secondary"}>
                  {editedUser.role === "management" ? "Management" : "Associate"}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {editedUser.role === "management"
                    ? "Full access to all features including analytics and bulk actions"
                    : "Can review applications and add notes"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Preferences */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferences
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive updates about applications</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Desktop Notifications</Label>
                  <p className="text-xs text-muted-foreground">Show browser notifications</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto-assign Applications</Label>
                  <p className="text-xs text-muted-foreground">Automatically assign new applications to you</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
