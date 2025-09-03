"use client"

import { useState, useMemo } from "react"
import { Download, TrendingUp, Users, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { sampleApplications, sampleUsers, statusLabels } from "@/lib/sample-data"
import { formatDate } from "@/lib/utils"
import type { User, ApplicationStatus } from "@/lib/types"

interface AnalyticsDashboardProps {
  currentUser: User
}

export function AnalyticsDashboard({ currentUser }: AnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState("30")
  const [selectedPosition, setSelectedPosition] = useState("all")

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const now = new Date()
    const daysBack = Number.parseInt(dateRange)
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

    const filteredApps = sampleApplications.filter((app) => {
      const appDate = new Date(app.applicationDate)
      const matchesDate = appDate >= startDate
      const matchesPosition = selectedPosition === "all" || app.position === selectedPosition
      return matchesDate && matchesPosition
    })

    // Status breakdown
    const statusBreakdown = Object.keys(statusLabels).map((status) => ({
      status: statusLabels[status as ApplicationStatus],
      count: filteredApps.filter((app) => app.status === status).length,
      fill: getStatusColor(status as ApplicationStatus),
    }))

    // Applications over time
    const timeData = []
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split("T")[0]
      const dayApps = filteredApps.filter((app) => app.applicationDate === dateStr)

      timeData.push({
        date: formatDate(dateStr),
        applications: dayApps.length,
        shortlisted: dayApps.filter((app) => app.status === "shortlisted").length,
        interview: dayApps.filter((app) => app.status === "interview").length,
      })
    }

    // Position breakdown
    const positionData = [...new Set(filteredApps.map((app) => app.position))]
      .map((position) => ({
        position: position.length > 20 ? position.substring(0, 20) + "..." : position,
        fullPosition: position,
        count: filteredApps.filter((app) => app.position === position).length,
        shortlisted: filteredApps.filter((app) => app.position === position && app.status === "shortlisted").length,
        interview: filteredApps.filter((app) => app.position === position && app.status === "interview").length,
      }))
      .sort((a, b) => b.count - a.count)

    // Reviewer performance
    const reviewerData = sampleUsers
      .map((user) => {
        const userApps = filteredApps.filter((app) => app.assignedReviewer === user.name)
        const shortlisted = userApps.filter((app) => app.status === "shortlisted").length
        const interview = userApps.filter((app) => app.status === "interview").length
        const total = userApps.length

        return {
          name: user.name,
          total,
          shortlisted,
          interview,
          progressionRate: total > 0 ? Math.round(((shortlisted + interview) / total) * 100) : 0,
        }
      })
      .filter((data) => data.total > 0)

    // Key metrics
    const totalApplications = filteredApps.length
    const shortlistedCount = filteredApps.filter((app) => app.status === "shortlisted").length
    const interviewCount = filteredApps.filter((app) => app.status === "interview").length
    const progressionRate =
      totalApplications > 0 ? Math.round(((shortlistedCount + interviewCount) / totalApplications) * 100) : 0
    const avgProcessingTime = 3.2 // Mock data

    return {
      statusBreakdown,
      timeData,
      positionData,
      reviewerData,
      metrics: {
        totalApplications,
        shortlistedCount,
        interviewCount,
        progressionRate,
        avgProcessingTime,
      },
    }
  }, [dateRange, selectedPosition])

  const positions = [...new Set(sampleApplications.map((app) => app.position))]

  const chartConfig = {
    applications: {
      label: "Applications",
      color: "hsl(var(--chart-1))",
    },
    shortlisted: {
      label: "Shortlisted",
      color: "hsl(var(--chart-2))",
    },
    interview: {
      label: "Interview",
      color: "hsl(var(--chart-3))",
    },
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Recruitment performance insights and metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPosition} onValueChange={setSelectedPosition}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {positions.map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.metrics.totalApplications}</div>
            <p className="text-xs text-muted-foreground">+12% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.metrics.progressionRate}%</div>
            <p className="text-xs text-muted-foreground">+2% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.metrics.avgProcessingTime} days</div>
            <p className="text-xs text-muted-foreground">-0.5 days from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reviewers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.reviewerData.length}</div>
            <p className="text-xs text-muted-foreground">All team members active</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Application Status Breakdown</CardTitle>
                <CardDescription>Distribution of application statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <PieChart>
                    <Pie
                      data={analyticsData.statusBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      nameKey="status"
                    >
                      {analyticsData.statusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Applications Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Applications Over Time</CardTitle>
                <CardDescription>Daily application volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <AreaChart data={analyticsData.timeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Trends</CardTitle>
              <CardDescription>Interview and shortlisted applications over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <LineChart data={analyticsData.timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="shortlisted" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                  <Line type="monotone" dataKey="interview" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Applications by Position</CardTitle>
              <CardDescription>Application volume and phase progression by job position</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <BarChart data={analyticsData.positionData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="position" type="category" width={120} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="shortlisted" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="interview" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reviewer Performance</CardTitle>
              <CardDescription>Application processing by team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.reviewerData.map((reviewer) => (
                  <div
                    key={reviewer.name}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {reviewer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{reviewer.name}</p>
                        <p className="text-sm text-muted-foreground">{reviewer.total} applications processed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{reviewer.progressionRate}% progression rate</p>
                        <p className="text-xs text-muted-foreground">
                          {reviewer.shortlisted} shortlisted, {reviewer.interview} interview
                        </p>
                      </div>
                      <Badge
                        variant={
                          reviewer.progressionRate >= 70
                            ? "default"
                            : reviewer.progressionRate >= 50
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {reviewer.progressionRate >= 70
                          ? "Excellent"
                          : reviewer.progressionRate >= 50
                            ? "Good"
                            : "Needs Improvement"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getStatusColor(status: ApplicationStatus): string {
  const colors = {
    submitted: "hsl(var(--chart-4))",
    interview: "hsl(var(--chart-5))",
    shortlisted: "hsl(var(--chart-2))",
  }
  return colors[status] || "hsl(var(--chart-1))"
}
