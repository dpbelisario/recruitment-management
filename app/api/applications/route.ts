import { NextRequest, NextResponse } from 'next/server'
import { FormApplicationData } from '@/lib/types'

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
