import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { signInWithGoogle, signOutUser } from '../services/firebase'
import { describeError, useProfile } from '../utilities/profile'

export const Banner = () => {
  const { user, isAuthenticated, isAdmin, isLoading, error: profileError } = useProfile()
  const [error, setError] = useState<string | null>(null)

  const handleAuthAction = async () => {
    setError(null)

    try {
      await (isAuthenticated ? signOutUser() : signInWithGoogle())
    } catch (caughtError) {
      console.error('Authentication failed', caughtError)
      setError(isAuthenticated ? 'Unable to sign out. Please try again.' : 'Unable to sign in. Please try again.')
    }
  }

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-3xl font-bold text-stone-900">
        <Link to="/" className="rounded-md hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700">
          CS Course Scheduler
        </Link>
      </h1>
      <div className="flex items-center gap-3">
        {user && <span className="text-stone-700">{user.displayName ?? user.email}</span>}
        {isAdmin && (
          <span className="rounded-md bg-stone-900 px-2 py-1 text-sm font-medium text-white">Administrator</span>
        )}
        <button
          type="button"
          onClick={() => void handleAuthAction()}
          disabled={isLoading && !isAuthenticated}
          className="rounded-md border border-stone-900 bg-white px-4 py-2 font-medium text-stone-900 hover:bg-stone-200 disabled:opacity-60"
        >
          {isAuthenticated ? 'Sign out' : 'Sign in'}
        </button>
      </div>
      {error && (
        <p role="alert" className="w-full text-red-700">
          {error}
        </p>
      )}
      {profileError && (
        <p role="alert" className="w-full text-red-700">
          Unable to check administrator access. Please report this error: {describeError(profileError)}
        </p>
      )}
    </header>
  )
}
