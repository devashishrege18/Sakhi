// app/api/support/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const athleteId = body.athleteId; 
    
    console.log(`[BACKEND] Support recorded for Athlete ID: ${athleteId}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Support recorded successfully!' 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error processing support request:", error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process support request.' 
    }, { status: 500 });
  }
}