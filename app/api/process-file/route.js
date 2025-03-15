// app/api/process-file/route.js
import { NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/claude-api";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Get file data and name
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = file.name;

    // Extract text from the file
    const extractedText = await extractTextFromFile(buffer, fileName);

    return NextResponse.json({ text: extractedText }, { status: 200 });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process file" },
      { status: 500 }
    );
  }
}