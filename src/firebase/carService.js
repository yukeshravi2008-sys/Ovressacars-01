import { db, storage } from './config'
import {
  collection, doc, getDocs, getDoc, addDoc,
  updateDoc, deleteDoc, query, orderBy, serverTimestamp
} from 'firebase/firestore'
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject
} from 'firebase/storage'

const UPLOAD_TIMEOUT = 15000

async function uploadPhoto(photoFile, onProgress) {
  const storageRef = ref(storage, `cars/${Date.now()}_${photoFile.name}`)
  const uploadTask = uploadBytesResumable(storageRef, photoFile)

  const uploadPromise = new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 70))
        }
      },
      reject,
      () => resolve()
    )
  })

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Upload timed out')), UPLOAD_TIMEOUT)
  )

  await Promise.race([uploadPromise, timeoutPromise])
  return await getDownloadURL(uploadTask.snapshot.ref)
}

function getLocalFallbackUrl(file) {
  return `/cars/${encodeURIComponent(file.name)}`
}

export async function getAllCars() {
  try {
    const q = query(collection(db, 'cars'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    throw new Error(`Failed to fetch cars: ${error.message}`)
  }
}

export async function getCarById(id) {
  try {
    const docRef = doc(db, 'cars', id)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) return null
    return { id: docSnap.id, ...docSnap.data() }
  } catch (error) {
    throw new Error(`Failed to fetch car: ${error.message}`)
  }
}

export async function addCar(carData, photoFile, onProgress) {
  let photoURL = ''
  let usedLocalFallback = false

  if (photoFile) {
    try {
      photoURL = await uploadPhoto(photoFile, onProgress)
    } catch {
      photoURL = getLocalFallbackUrl(photoFile)
      usedLocalFallback = true
    }
  }

  const docRef = await addDoc(collection(db, 'cars'), {
    ...carData,
    photoURL,
    available: true,
    createdAt: serverTimestamp(),
  })

  return { docRef, usedLocalFallback }
}

export async function updateCar(id, carData, newPhotoFile, oldPhotoURL, onProgress) {
  if (newPhotoFile) {
    try {
      const url = await uploadPhoto(newPhotoFile, onProgress)
      carData.photoURL = url

      if (oldPhotoURL && oldPhotoURL.startsWith('https://')) {
        try {
          const oldRef = ref(storage, oldPhotoURL)
          await deleteObject(oldRef)
        } catch {}
      }
    } catch {
      carData.photoURL = getLocalFallbackUrl(newPhotoFile)
    }
  }

  await updateDoc(doc(db, 'cars', id), carData)
  return { usedLocalFallback: newPhotoFile && !carData.photoURL?.startsWith('https://') }
}

export async function deleteCar(id, photoURL) {
  try {
    if (photoURL) {
      try {
        const photoRef = ref(storage, photoURL)
        await deleteObject(photoRef)
      } catch {}
    }
    await deleteDoc(doc(db, 'cars', id))
  } catch (error) {
    throw new Error(`Failed to delete car: ${error.message}`)
  }
}

export async function toggleCarAvailability(id, currentStatus) {
  try {
    await updateDoc(doc(db, 'cars', id), { available: !currentStatus })
  } catch (error) {
    throw new Error(`Failed to toggle availability: ${error.message}`)
  }
}

export async function deleteCarPhoto(id, photoURL) {
  try {
    if (photoURL) {
      try {
        const photoRef = ref(storage, photoURL)
        await deleteObject(photoRef)
      } catch {}
    }
    await updateDoc(doc(db, 'cars', id), { photoURL: '' })
  } catch (error) {
    throw new Error(`Failed to delete photo: ${error.message}`)
  }
}
