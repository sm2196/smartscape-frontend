import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { writeFile } from "fs/promises"
import { join } from "path"
import { mkdir } from "fs/promises"
import { v4 as uuidv4 } from "uuid"
import { tmpdir } from "os"

export async function POST(request) {
  try {
    // Create uploads directory in the temporary directory
    const uploadsDir = join(tmpdir(), "uploads")
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (err) {
      // Directory might already exist, continue
      console.log("Directory creation error (may already exist):", err)
    }

    // Parse the multipart form data
    const formData = await request.formData()
    const userId = formData.get("userId")
    const userEmail = formData.get("userEmail")
    const subject = formData.get("subject")
    const text = formData.get("text")

    // Get the document files
    const documents = formData.getAll("documents")

    // Validate required fields
    if (!userId || !userEmail || !subject || !text || !documents.length) {
      return NextResponse.json({ error: "Missing required fields or files" }, { status: 400 })
    }

    // Save files to temporary directory and prepare attachments
    const attachments = []

    for (const file of documents) {
      if (file instanceof File) {
        const fileId = uuidv4()
        const fileName = file.name || `document-${fileId}.pdf`
        const filePath = join(uploadsDir, fileName)

        // Convert file to buffer and save it
        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(filePath, buffer)

        // Add to attachments
        attachments.push({
          filename: fileName,
          path: filePath,
        })
      }
    }

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Send email with attachments
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to:  process.env.EMAIL_USER,
      subject,
      text,
      attachments,
    })

    console.log("Email sent:", info.messageId)

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

