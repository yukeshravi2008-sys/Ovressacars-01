import { db } from './config'
import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDocs, getDoc,
  query, orderBy, where, serverTimestamp,
  onSnapshot
} from 'firebase/firestore'

export async function createBooking(data) {
  const docRef = await addDoc(collection(db, 'bookings'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  })
  return docRef
}

export function subscribeBookings(callback) {
  const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    callback(bookings)
  })
}

export function subscribePendingCount(callback) {
  const q = query(
    collection(db, 'bookings'),
    where('status', '==', 'pending')
  )
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.size)
  })
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

export async function updateBooking(id, data) {
  await updateDoc(doc(db, 'bookings', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function updateBookingWithLog(id, data, adminEmail) {
  await updateDoc(doc(db, 'bookings', id), {
    ...data,
    updatedAt: serverTimestamp(),
    lastUpdated: serverTimestamp(),
    updatedBy: adminEmail || null,
  })
}

export async function deleteBooking(id, adminEmail) {
  const snap = await getDoc(doc(db, 'bookings', id))
  if (snap.exists()) {
    await addDoc(collection(db, 'deletedBookings'), {
      ...snap.data(),
      deletedAt: serverTimestamp(),
      deletedBy: adminEmail || null,
    })
  }
  await deleteDoc(doc(db, 'bookings', id))
}

export async function getArchivedBookings() {
  const q = query(collection(db, 'deletedBookings'), orderBy('deletedAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
