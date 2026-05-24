import { db } from './config'
import {
  collection, doc, setDoc, getDoc, getDocs, updateDoc, serverTimestamp
} from 'firebase/firestore'

export async function createUserDocument(uid, userData) {
  try {
    await setDoc(doc(db, 'users', uid), {
      uid,
      name: userData.name || '',
      email: userData.email || '',
      phone: '',
      role: 'user',
      createdAt: serverTimestamp(),
    }, { merge: true })
  } catch (error) {
    throw new Error(`Failed to create user document: ${error.message}`)
  }
}

export async function getUserDocument(uid) {
  try {
    const docSnap = await getDoc(doc(db, 'users', uid))
    if (!docSnap.exists()) return null
    return { id: docSnap.id, ...docSnap.data() }
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
}

export async function updateUserDocument(uid, data) {
  try {
    await updateDoc(doc(db, 'users', uid), data)
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`)
  }
}

export async function getAllUsers() {
  try {
    const snapshot = await getDocs(collection(db, 'users'))
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error.message}`)
  }
}

export async function toggleUserBlock(uid, currentlyBlocked) {
  try {
    await updateDoc(doc(db, 'users', uid), { blocked: !currentlyBlocked })
  } catch (error) {
    throw new Error(`Failed to toggle user block: ${error.message}`)
  }
}
