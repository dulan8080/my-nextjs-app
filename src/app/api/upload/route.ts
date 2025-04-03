import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'templates', 'binding');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename with proper formatting
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const originalName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
    const extension = path.extname(originalName) || '.png'; // Default to .png if no extension
    const baseName = path.basename(originalName, extension)
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Create filename with format: binding-template-name-TIMESTAMP.extension
    const filename = `binding-${baseName}-${timestamp}${extension}`;
    const filePath = path.join(uploadDir, filename);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file
    await writeFile(filePath, buffer);

    // Return public URL (ensure it starts with forward slash)
    const publicUrl = `/templates/binding/${filename}`;
    
    // Log success for debugging
    console.log('File saved successfully:', {
      originalName,
      savedAs: filename,
      publicUrl
    });
    
    return NextResponse.json({ 
      url: publicUrl,
      success: true
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
} 