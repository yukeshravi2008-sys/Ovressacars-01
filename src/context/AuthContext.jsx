import { createContext, useContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase/config'
import { createUserDocument, getUserDocument } from '../firebase/userService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  const getUserName = (u, doc) => {
    if (doc?.name) return doc.name
    if (u?.displayName) return u.displayName
    if (u?.email) return u.email.split('@')[0]
    return 'User'
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        try {
          const userDoc = await getUserDocument(user.uid)
          setUserData(userDoc)
          setUserRole(userDoc?.role || 'user')
        } catch {
          setUserRole('user')
        }
      } else {
        setUserRole(null)
        setUserData(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const login = async (email, password) => {
    console.log({ email, typeofPassword: typeof password })
    if (typeof password !== 'string') {
      throw new Error('auth/invalid-password-format')
    }
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const userDoc = await getUserDocument(cred.user.uid)
    setUserData(userDoc)
    setUserRole(userDoc?.role || 'user')
    return cred
  }

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider)
    const userDoc = await getUserDocument(cred.user.uid)
    if (!userDoc) {
      await createUserDocument(cred.user.uid, {
        name: cred.user.displayName || '',
        email: cred.user.email || '',
      })
      setUserRole('user')
      setUserData(null)
    } else {
      setUserRole(userDoc.role || 'user')
      setUserData(userDoc)
    }
    return cred
  }

  const register = async (name, email, password) => {
    console.log({ name, email, typeofPassword: typeof password })
    if (typeof password !== 'string') {
      throw new Error('auth/invalid-password-format')
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await createUserDocument(cred.user.uid, { name, email })
    setUserRole('user')
    return cred
  }

  const logout = async () => {
    await signOut(auth)
    setUserRole(null)
    setUserData(null)
  }

  const userName = currentUser ? getUserName(currentUser, userData) : null

  const value = {
    currentUser,
    userRole,
    userData,
    userName,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
