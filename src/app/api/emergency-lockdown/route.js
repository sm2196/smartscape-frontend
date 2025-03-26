import { NextResponse } from "next/server"
import { activateEmergencyLockdown, deactivateEmergencyLockdown, getLockdownStatus } from "@/lib/doorService"

export async function GET() {
  try {
    const result = await getLockdownStatus()

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { activate } = body

    if (typeof activate !== "boolean") {
      return NextResponse.json({ error: 'Invalid request: "activate" must be a boolean' }, { status: 400 })
    }

    // Call the appropriate function based on the activate parameter
    const result = activate ? await activateEmergencyLockdown() : await deactivateEmergencyLockdown()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        details: result.details,
      })
    } else {
      return NextResponse.json(
        {
          error: result.error,
          details: result.details,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


