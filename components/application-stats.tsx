import { Card, CardContent } from "@/components/ui/card"
import { Users, FileText, Calendar, Star } from "lucide-react"
import type { Application } from "@/lib/types"
import { statusLabels } from "@/lib/sample-data"

interface ApplicationStatsProps {
  applications: Application[]
}

export function ApplicationStats({ applications }: ApplicationStatsProps) {
  const stats = {
    total: applications.length,
    submitted: applications.filter((app) => app.status === "submitted").length,
    invited: applications.filter((app) => app.status === "interview").length,
    shortlisted: applications.filter((app) => app.status === "shortlisted").length,
  }

  const statCards = [
    {
      title: "Total Applications",
      value: stats.total,
      icon: Users,
      color: "text-foreground",
    },
    {
      title: statusLabels.submitted,
      value: stats.submitted,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: statusLabels.interview,
      value: stats.invited,
      icon: Calendar,
      color: "text-yellow-600",
    },
    {
      title: statusLabels.shortlisted,
      value: stats.shortlisted,
      icon: Star,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.title} className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
