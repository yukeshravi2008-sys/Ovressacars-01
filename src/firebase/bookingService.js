import { db } from './config'
import {
  collection, doc, getDocs, getDoc, addDoc,
  updateDoc, query, orderBy, serverTimestamp, where
} from 'firebase/firestore'

export async function createBooking(data) {
  const docRef = await addDoc(collection(db, 'bookings'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  })
  return docRef
}

export async function getAllBookings() {
  const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function getBookingById(id) {
  const docSnap = await getDoc(doc(db, 'bookings', id))
  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() }
}

export async function getBookingsByUserId(userId) {
  const q = query(
    collection(db, 'bookings'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function updateBookingStatus(id, status) {
  await updateDoc(doc(db, 'bookings', id), { status })
}
