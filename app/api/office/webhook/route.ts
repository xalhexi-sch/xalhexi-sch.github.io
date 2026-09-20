import { NextRequest, NextResponse } from 'next/server'

/**
 * Phase 2 & 3: OnlyOffice / Gotenberg Callback Webhook
 * When OnlyOffice saves a document, it POSTs status: 2 (ready for save) along with the download URL.
 * When Gotenberg finishes a conversion, it can post the converted PDF URL here.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('Office webhook callback received:', body)

    // Status 2 in OnlyOffice indicates user finished editing and document is ready to be saved back
    if (body.status === 2 && body.url) {
      // In Phase 3:
      // 1. Fetch updated document bytes from body.url
      // 2. Overwrite file in Supabase Storage
      // 3. Update file metadata (size_bytes, updated_at) in 'files' table
      return NextResponse.json({ error: 0 })
    }

    return NextResponse.json({ status: 'received' })
  } catch (err: any) {
    console.error('Office webhook error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
