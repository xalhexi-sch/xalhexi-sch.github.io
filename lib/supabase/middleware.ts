import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hkcgqfuyxehypazfpjew.supabase.co'
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrY2dxZnV5eGVoeXBhemZwamV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4OTk3MTYsImV4cCI6MjEwNTQ3NTcxNn0.Th2UbUnKR9Kn939w26-gw0EXAyBeqwFt8yvAeAX-PY4'

  if (!url || !anonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run on static assets, api routes, or auth routes
  const path = request.nextUrl.pathname
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.startsWith('/auth') ||
    path.startsWith('/favicon.png') ||
    path.startsWith('/login')
  ) {
    return supabaseResponse
  }

  const isProtectedPath = path.startsWith('/hub')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
