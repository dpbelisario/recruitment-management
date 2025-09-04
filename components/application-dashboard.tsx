"use client"

import { useState, useMemo } from "react"
import { Search, Filter, Plus, MoreHorizontal, CheckSquare, BarChart3, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApplicationList } from "@/components/application-list"
import { ApplicationFilters } from "@/components/application-filters"
import { ApplicationStats } from "@/components/application-stats"
import { ApplicationDetailView } from "@/components/application-detail-view"
import { BulkActionsDialog } from "@/components/bulk-actions-dialog"
import { UserMenu } from "@/components/user-menu"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { sampleApplications, sampleUsers } from "@/lib/sample-data"
import { filterApplications } from "@/lib/utils"
import { useApplications } from "@/hooks/use-applications"
import type { ApplicationFilters as FilterType, User } from "@/lib/types"

export function ApplicationDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterType>({})
  const [currentUser, setCurrentUser] = useState<User>(sampleUsers[0]) // Mock current user as Sarah Johnson (management)
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [activeTab, setActiveTab] = useState("applications")
  
  // Use real applications from API
  const { applications: realApplications, loading, error, refetch } = useApplications()
  
  // Combine real applications with sample data for now
  const allApplications = [...realApplications, ...sampleApplications]

  const filteredApplications = useMemo(() => {
    return filterApplications(allApplications, {
      ...filters,
      search: searchQuery,
    })
  }, [allApplications, filters, searchQuery])

  const selectedApplication = selectedApplicationId
    ? allApplications.find((app) => app.id === selectedApplicationId)
    : null

  const selectedApplications = allApplications.filter((app) => selectedApplicationIds.includes(app.id))

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery("")
  }

  const handleViewApplication = (applicationId: string) => {
    setSelectedApplicationId(applicationId)
  }

  const handleCloseDetailView = () => {
    setSelectedApplicationId(null)
  }

  const handleStatusChange = (applicationId: string, status: string, reason?: string) => {
    // TODO: Implement status change logic
    console.log("Status change:", { applicationId, status, reason })
  }

  const handleAddNote = (applicationId: string, note: string) => {
    // TODO: Implement add note logic
    console.log("Add note:", { applicationId, note })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplicationIds(filteredApplications.map((app) => app.id))
    } else {
      setSelectedApplicationIds([])
    }
  }

  const handleSelectApplication = (applicationId: string, checked: boolean) => {
    if (checked) {
      setSelectedApplicationIds((prev) => [...prev, applicationId])
    } else {
      setSelectedApplicationIds((prev) => prev.filter((id) => id !== applicationId))
    }
  }

  const handleBulkAction = (action: string, data: any) => {
    // TODO: Implement bulk action logic
    console.log("Bulk action:", { action, data })
    setSelectedApplicationIds([])
    setShowBulkActions(false)
  }

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser)
    // TODO: Implement user update logic
    console.log("Update user:", updatedUser)
  }

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("User logged out")
  }

  const activeFilterCount =
    Object.values(filters).filter((value) => value && (Array.isArray(value) ? value.length > 0 : true)).length +
    (searchQuery ? 1 : 0)

  const isAllSelected = filteredApplications.length > 0 && selectedApplicationIds.length === filteredApplications.length
  const isPartiallySelected =
    selectedApplicationIds.length > 0 && selectedApplicationIds.length < filteredApplications.length

  return (
    <div className="flex bg-background min-h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Recruitment Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Welcome back, {currentUser.name}</p>
            </div>
            <div className="flex items-center gap-3">
              {currentUser.role === "management" &&
                selectedApplicationIds.length > 0 &&
                activeTab === "applications" && (
                  <Button variant="outline" size="sm" onClick={() => setShowBulkActions(true)}>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Bulk Actions ({selectedApplicationIds.length})
                  </Button>
                )}
               <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Actions
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Application
              </Button>
              <UserMenu user={currentUser} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b border-border px-6">
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              {currentUser.role === "management" && (
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="applications" className="flex-1 flex flex-col mt-0">
            {/* Stats Overview */}
            <div className="px-6 py-4 border-b border-border">
              <ApplicationStats applications={allApplications} />
            </div>

            {/* Search and Filters */}
            <div className="sticky top-0 z-10 bg-background border-b border-border">
              <div className="px-6 py-4 bg-card">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search applications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  )}
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="px-6 py-4 bg-muted/30">
                  <ApplicationFilters
                    filters={filters}
                    onFiltersChange={handleFilterChange}
                    applications={allApplications}
                  />
                </div>
              )}

              {/* Results Summary */}
              <div className="px-6 py-3 bg-muted/20">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      Showing {filteredApplications.length} of {allApplications.length} applications
                    </span>
                    {currentUser.role === "management" && filteredApplications.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={isAllSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = isPartiallySelected
                          }}
                          onCheckedChange={handleSelectAll}
                        />
                        <span className="text-muted-foreground">Select All</span>
                      </div>
                    )}
                  </div>
                  {activeFilterCount > 0 && (
                    <span className="text-muted-foreground">
                      {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} applied
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Application List */}
            <div>
              <ApplicationList
                applications={filteredApplications}
                currentUser={currentUser}
                onViewApplication={handleViewApplication}
                selectedApplicationIds={selectedApplicationIds}
                onSelectApplication={handleSelectApplication}
                showSelection={currentUser.role === "management"}
              />
            </div>
          </TabsContent>

          {currentUser.role === "management" && (
            <TabsContent value="analytics" className="flex-1 p-6 mt-0">
              <AnalyticsDashboard currentUser={currentUser} />
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Application Detail View Modal */}
      {selectedApplication && (
        <ApplicationDetailView
          application={selectedApplication}
          currentUser={currentUser}
          onClose={handleCloseDetailView}
          onStatusChange={handleStatusChange}
          onAddNote={handleAddNote}
        />
      )}

      <BulkActionsDialog
        isOpen={showBulkActions}
        onClose={() => setShowBulkActions(false)}
        selectedApplications={selectedApplications}
        onBulkAction={handleBulkAction}
      />
    </div>
  )
}
