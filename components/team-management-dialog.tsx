"use client"

import { useState } from "react"
import { Users, Plus, MoreHorizontal, Mail, Shield, UserCheck, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { sampleUsers } from "@/lib/sample-data"
import type { User, UserRole } from "@/lib/types"

interface TeamManagementDialogProps {
  isOpen: boolean
  onClose: () => void
  currentUser: User
}

export function TeamManagementDialog({ isOpen, onClose, currentUser }: TeamManagementDialogProps) {
  const [users, setUsers] = useState<User[]>(sampleUsers)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "associate" as UserRole,
  })

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }
      setUsers([...users, user])
      setNewUser({ name: "", email: "", role: "associate" })
      setShowAddUser(false)
    }
  }

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
  }

  const handleDeactivateUser = (userId: string) => {
    // In a real app, this would mark the user as inactive
    console.log("Deactivate user:", userId)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const managementUsers = users.filter((user) => user.role === "management")
  const associateUsers = users.filter((user) => user.role === "associate")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Management
          </DialogTitle>
          <DialogDescription>Manage team members, roles, and permissions</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto">
          {/* Add New User */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Team Members ({users.length})</CardTitle>
                <Button size="sm" onClick={() => setShowAddUser(!showAddUser)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </CardHeader>

            {showAddUser && (
              <CardContent className="pt-0">
                <div className="space-y-4 p-4 border border-border rounded-md bg-muted/20">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-name">Full Name</Label>
                      <Input
                        id="new-name"
                        placeholder="Enter full name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-email">Email Address</Label>
                      <Input
                        id="new-email"
                        type="email"
                        placeholder="Enter email address"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="associate">Associate</SelectItem>
                        <SelectItem value="management">Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddUser} disabled={!newUser.name || !newUser.email}>
                      Add Member
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowAddUser(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Management Users */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="font-medium">Management ({managementUsers.length})</h3>
            </div>
            <div className="space-y-2">
              {managementUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                        <Badge variant="default">Management</Badge>
                        {user.id === currentUser.id && (
                          <Badge variant="outline" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>

                      {user.id !== currentUser.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, "associate")}>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Change to Associate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeactivateUser(user.id)}>
                              <UserX className="h-4 w-4 mr-2" />
                              Deactivate User
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user.id)}>
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Associate Users */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-secondary" />
              <h3 className="font-medium">Associates ({associateUsers.length})</h3>
            </div>
            <div className="space-y-2">
              {associateUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-secondary/10 text-secondary font-medium">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                        <Badge variant="secondary">Associate</Badge>
                        {user.id === currentUser.id && (
                          <Badge variant="outline" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>

                      {user.id !== currentUser.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, "management")}>
                              <Shield className="h-4 w-4 mr-2" />
                              Promote to Management
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeactivateUser(user.id)}>
                              <UserX className="h-4 w-4 mr-2" />
                              Deactivate User
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user.id)}>
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <Button variant="outline" onClick={onClose} className="w-full bg-transparent">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
