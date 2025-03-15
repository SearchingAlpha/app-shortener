// app/api/generate-snippets/route.js
import { NextResponse } from 'next/server';
import { generateSocialSnippets, regenerateSnippet } from '@/lib/claude-api';

export async function POST(request) {
  try {
    const body = await request.json();
    const { content, platforms, variantsPerPlatform = 1, regenerate } = body;
    
    // Validate content
    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required' }, 
        { status: 400 }
      );
    }
    
    // Handle regeneration request for a single platform
    if (regenerate && typeof regenerate === 'string') {
      try {
        const snippet = await regenerateSnippet(content, regenerate);
        return NextResponse.json({
          snippets: {
            [regenerate]: [snippet] // Wrap in array to maintain consistent response format
          }
        });
      } catch (error) {
        console.error('Regeneration error:', error);
        return NextResponse.json(
          { error: `Error from LLM service: ${error.message}` }, 
          { status: 500 }
        );
      }
    }
    
    // For full generation, validate platforms
    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { error: 'At least one platform must be selected' }, 
        { status: 400 }
      );
    }

    // Generate snippets for all selected platforms
    try {
      const snippets = await generateSocialSnippets(content, platforms, variantsPerPlatform);
      
      return NextResponse.json({
        snippets
      });
    } catch (error) {
      console.error('LLM generation error:', error);
      return NextResponse.json(
        { error: `Error from LLM service: ${error.message}` }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to generate snippets' }, 
      { status: 500 }
    );
  }
}