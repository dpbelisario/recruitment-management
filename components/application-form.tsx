"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, User, Mail, GraduationCap, Briefcase, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const positions = [
  "Frontend Engineer",
  "Backend Engineer",
]

export function ApplicationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    majorAndGraduation: "",
    growthMetrics: "",
    previousRole: "",
    resume: null as File | null,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, resume: file }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Job Application Form
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="position" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Position of Interest
            </Label>
            <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a position" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Major & Graduation */}
          <div className="space-y-2">
            <Label htmlFor="majorAndGraduation" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Major & Graduation
            </Label>
            <Input
              id="majorAndGraduation"
              placeholder="e.g., Computer Science, 2022"
              value={formData.majorAndGraduation}
              onChange={(e) => handleInputChange("majorAndGraduation", e.target.value)}
              required
            />
          </div>

          {/* Growth Metrics */}
          <div className="space-y-2">
            <Label htmlFor="growthMetrics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Growth Metrics of Previous Job
            </Label>
            <Input
              id="growthMetrics"
              placeholder="e.g., Increased user engagement by 40%"
              value={formData.growthMetrics}
              onChange={(e) => handleInputChange("growthMetrics", e.target.value)}
              required
            />
          </div>

          {/* Previous Role */}
          <div className="space-y-2">
            <Label htmlFor="previousRole" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Role at Previous or Current Company
            </Label>
            <Input
              id="previousRole"
              placeholder="e.g., Senior Software Engineer at Google"
              value={formData.previousRole}
              onChange={(e) => handleInputChange("previousRole", e.target.value)}
              required
            />
          </div>

          {/* Resume Upload */}
          <div className="space-y-2">
            <Label htmlFor="resume" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Resume (PDF only)
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="resume"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <span className="text-sm text-muted-foreground">
                {formData.resume ? formData.resume.name : "No file chosen"}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Submit Application
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
