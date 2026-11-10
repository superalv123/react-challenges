import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type NextOrObserver, type Unsubscribe, type User } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import firebaseConfig from '../../firebase.config.json'

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
const auth = getAuth(app)

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isInitialLoading: boolean
}

export const signInWithGoogle = async (): Promise<void> => {
  await signInWithPopup(auth, new GoogleAuthProvider())
}

export const signOutUser = async (): Promise<void> => {
  await signOut(auth)
}

export const addAuthStateListener = (observer: NextOrObserver<User | null>): Unsubscribe =>
  onAuthStateChanged(auth, observer)

export const useAuthState = (): AuthState => {
  const [user, setUser] = useState<User | null>(auth.currentUser)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(
    () =>
      addAuthStateListener((nextUser) => {
        setUser(nextUser)
        setIsInitialLoading(false)
      }),
    [],
  )

  return { user, isAuthenticated: user !== null, isInitialLoading }
}
