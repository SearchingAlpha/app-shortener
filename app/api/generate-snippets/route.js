// app/api/generate-snippets/route.js
import { NextResponse } from "next/server";
import { generateSocialSnippets, regenerateSnippet } from "@/lib/claude-api";

// app/api/regenerate-snippet/route.js
export async function POST(request) {
  try {
    const body = await request.json();
    const { content, platform } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (!platform) {
      return NextResponse.json(
        { error: "Platform is required" },
        { status: 400 }
      );
    }

    const regeneratedSnippet = await regenerateSnippet(content, platform);
    return NextResponse.json({ snippet: regeneratedSnippet }, { status: 200 });
  } catch (error) {
    console.error("Error in regenerate-snippet API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to regenerate snippet" },
      { status: 500 }
    );
  }
}