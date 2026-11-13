import type { User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useAuthState } from '../services/firebase'
import { isUserAdmin } from '../services/firestore'

export interface Profile {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  error: Error | null
}

interface AdminCheck {
  uid: string
  isAdmin: boolean
  error: Error | null
}

export const describeError = (error: Error): string =>
  'code' in error && typeof error.code === 'string' ? `${error.code}: ${error.message}` : error.message

export const useProfile = (): Profile => {
  const { user, isAuthenticated, isInitialLoading } = useAuthState()
  const [adminCheck, setAdminCheck] = useState<AdminCheck | null>(null)
  const uid = user?.uid ?? null

  useEffect(() => {
    if (!uid) {
      return
    }

    let isActive = true

    const checkAdmin = async () => {
      try {
        const isAdmin = await isUserAdmin(uid)
        if (isActive) {
          setAdminCheck({ uid, isAdmin, error: null })
        }
      } catch (caughtError) {
        console.error('Failed to load administrator status', caughtError)
        if (isActive) {
          const error = caughtError instanceof Error ? caughtError : new Error('Unable to load administrator status.')
          setAdminCheck({ uid, isAdmin: false, error })
        }
      }
    }

    void checkAdmin()

    return () => {
      isActive = false
    }
  }, [uid])

  // Ignore results left over from a previously signed-in user
  const currentCheck = adminCheck?.uid === uid ? adminCheck : null

  return {
    user,
    isAuthenticated,
    isAdmin: currentCheck?.isAdmin ?? false,
    isLoading: isInitialLoading || (uid !== null && currentCheck === null),
    error: currentCheck?.error ?? null,
  }
}
