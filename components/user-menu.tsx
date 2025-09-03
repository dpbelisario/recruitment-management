"use client"

import { useState } from "react"
import { User, Settings, Users, LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserProfileDialog } from "@/components/user-profile-dialog"
import { TeamManagementDialog } from "@/components/team-management-dialog"
import type { User as UserType } from "@/lib/types"

interface UserMenuProps {
  user: UserType
  onUpdateUser: (user: UserType) => void
  onLogout?: () => void
}

export function UserMenu({ user, onUpdateUser, onLogout }: UserMenuProps) {
  const [showProfile, setShowProfile] = useState(false)
  const [showTeamManagement, setShowTeamManagement] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <Badge variant={user.role === "management" ? "default" : "secondary"} className="w-fit text-xs">
                {user.role === "management" ? "Management" : "Associate"}
              </Badge>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowProfile(true)}>
            <User className="mr-2 h-4 w-4" />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Preferences
          </DropdownMenuItem>
          {user.role === "management" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowTeamManagement(true)}>
                <Users className="mr-2 h-4 w-4" />
                Team Management
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Shield className="mr-2 h-4 w-4" />
                System Settings
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserProfileDialog
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        onUpdateUser={onUpdateUser}
      />

      {user.role === "management" && (
        <TeamManagementDialog
          isOpen={showTeamManagement}
          onClose={() => setShowTeamManagement(false)}
          currentUser={user}
        />
      )}
    </>
  )
}
