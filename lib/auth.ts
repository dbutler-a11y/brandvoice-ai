import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import type { User } from '@supabase/supabase-js'

/**
 * Authentication helper functions for API routes
 * Uses Supabase auth to verify user sessions
 */

/**
 * Get the current authenticated user session
 * @returns User object if authenticated, null otherwise
 */
export async function getServerSession(): Promise<User | null> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Error getting server session:', error)
    return null
  }
}

/**
 * Require authentication for API routes
 * Returns the authenticated user or a 401 response
 *
 * Usage in route handlers:
 * ```
 * const user = await requireAuth()
 * if (user instanceof NextResponse) return user // Auth failed
 * // Continue with authenticated user
 * ```
 *
 * @returns User object if authenticated, or NextResponse with 401 status
 */
export async function requireAuth(): Promise<User | NextResponse> {
  const user = await getServerSession()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Authentication required' },
      { status: 401 }
    )
  }

  return user
}

/**
 * Require admin role for API routes
 * Currently checks for authentication only.
 * TODO: Implement role-based access control when user roles are added to the system
 *
 * Usage in route handlers:
 * ```
 * const user = await requireAdmin()
 * if (user instanceof NextResponse) return user // Auth failed or not admin
 * // Continue with authenticated admin user
 * ```
 *
 * @returns User object if authenticated and admin, or NextResponse with 401/403 status
 */
export async function requireAdmin(): Promise<User | NextResponse> {
  const user = await getServerSession()

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized - Authentication required' },
      { status: 401 }
    )
  }

  // Check if user has admin role in database
  try {
    const userProfile = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { role: true }
    })

    if (!userProfile || userProfile.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }
  } catch (error) {
    console.error('Error checking admin role:', error)
    return NextResponse.json(
      { error: 'Internal server error during authorization' },
      { status: 500 }
    )
  }

  return user
}

/**
 * Helper type guard to check if the result is an auth error response
 * @param result - Result from requireAuth or requireAdmin
 * @returns true if result is a NextResponse (auth failed)
 */
export function isAuthError(result: User | NextResponse): result is NextResponse {
  return result instanceof NextResponse
}
