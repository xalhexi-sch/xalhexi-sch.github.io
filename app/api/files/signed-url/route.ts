import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // Verify auth
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { storagePath, expiresIn = 3600 } = body

  if (!storagePath) {
    return NextResponse.json({ error: 'Missing storagePath' }, { status: 400 })
  }

  const { data, error } = await supabase.storage
    .from('hub-files')
    .createSignedUrl(storagePath, expiresIn)

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Failed to create signed URL' }, { status: 500 })
  }

  return NextResponse.json({ signedUrl: data.signedUrl })
}
