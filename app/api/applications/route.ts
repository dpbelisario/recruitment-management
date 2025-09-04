import { NextRequest, NextResponse } from 'next/server'
import { FormApplicationData, ApplicationStatus } from '@/lib/types'

// Simple in-memory storage for now
let applications: any[] = []

export async function POST(request: NextRequest) {
  try {
    const data: FormApplicationData = await request.json()
    
    // Create new application
    const newApplication = {
      id: Date.now().toString(),
      applicantName: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: '',
      position: data.selectedPosition,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'submitted',
      experience: data.previousRole,
      education: data.majorGraduation,
      majorAndGraduation: data.majorGraduation,
      previousRole: data.previousRole,
      growthMetrics: data.growthMetrics,
      skills: [],
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    applications.push(newApplication)
    
    return NextResponse.json({ 
      success: true, 
      application: newApplication 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process application' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    )
  }
}

export async function GET() {
  return NextResponse.json({ applications }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status, reason } = await request.json()
    
    // Find the application by ID
    const applicationIndex = applications.findIndex(app => app.id === id)
    
    if (applicationIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      )
    }
    
    // Validate status transition
    const currentStatus = applications[applicationIndex].status
    const validTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
      'submitted': ['interview', 'shortlisted'],
      'interview': ['shortlisted'],
      'shortlisted': [] // Final status
    }
    
    if (!validTransitions[currentStatus as ApplicationStatus]?.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status transition from ${currentStatus} to ${status}` },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      )
    }
    
    // Update the application
    applications[applicationIndex] = {
      ...applications[applicationIndex],
      status,
      updatedAt: new Date().toISOString(),
    }
    
    // Add a note if reason is provided
    if (reason) {
      applications[applicationIndex].notes.push({
        id: Date.now().toString(),
        applicationId: id,
        authorId: 'system',
        authorName: 'System',
        content: `Status changed to ${status}: ${reason}`,
        createdAt: new Date().toISOString(),
        isInternal: true
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      application: applications[applicationIndex] 
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update application' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}
