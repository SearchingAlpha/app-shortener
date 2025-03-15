// app/api/regenerate-snippet/route.js
import { NextResponse } from 'next/server';
import { regenerateSnippet } from '@/lib/claude-api';

export async function POST(request) {
  try {
    const body = await request.json();
    const { content, platform, variantIndex } = body;
    
    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required' }, 
        { status: 400 }
      );
    }
    
    if (!platform) {
      return NextResponse.json(
        { error: 'Platform is required' }, 
        { status: 400 }
      );
    }
    
    // Use the claude-api.js regenerateSnippet function
    try {
      const snippet = await regenerateSnippet(content, platform);
      
      return NextResponse.json({
        snippet
      });
    } catch (llmError) {
      console.error('LLM regeneration error:', llmError);
      return NextResponse.json(
        { error: `Error from LLM service: ${llmError.message}` }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error regenerating snippet:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate snippet' }, 
      { status: 500 }
    );
  }
}