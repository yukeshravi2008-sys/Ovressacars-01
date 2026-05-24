/* global process */
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createInterface } from 'readline'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv() {
  const envPath = resolve(__dirname, '..', '.env')

  if (!existsSync(envPath)) {
    console.error('❌ .env file not found')
    process.exit(1)
  }

  const content = readFileSync(envPath, 'utf-8')

  for (const line of content.split('\n')) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) continue

    const eq = trimmed.indexOf('=')

    if (eq === -1) continue

    const key = trimmed.slice(0, eq).trim()

    let value = trimmed.slice(eq + 1).trim()

    if (
      value.startsWith('"') &&
      value.endsWith('"')
    ) {
      value = value.slice(1, -1)
    }

    process.env[key] = value
  }
}

loadEnv()

const firebaseConfig = {
  apiKey:
    process.env.VITE_FIREBASE_API_KEY,

  authDomain:
    process.env.VITE_FIREBASE_AUTH_DOMAIN,

  projectId:
    process.env.VITE_FIREBASE_PROJECT_ID,

  storageBucket:
    process.env.VITE_FIREBASE_STORAGE_BUCKET,

  messagingSenderId:
    process.env
      .VITE_FIREBASE_MESSAGING_SENDER_ID,

  appId:
    process.env.VITE_FIREBASE_APP_ID,
}

if (
  !firebaseConfig.apiKey ||
  firebaseConfig.apiKey ===
  'your_api_key'
) {
  console.log(
    '\n❌ Firebase not configured.\n'
  )

  process.exit(1)
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

const db = getFirestore(app)

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

function ask(question) {
  return new Promise((resolve) =>
    rl.question(question, resolve)
  )
}

async function createAdmin() {
  console.log(
    '\n━━━━━━━━━━━━━━━━━━━━━━━'
  )

  console.log(
    ' Ovressacars Admin Setup'
  )

  console.log(
    '━━━━━━━━━━━━━━━━━━━━━━━\n'
  )

  const email =
    (await ask(
      'Admin Email: '
    )).trim()

  const password =
    (await ask(
      'Admin Password: '
    )).trim()

  const name =
    (await ask(
      'Admin Name: '
    )).trim()

  const createNew =
    await ask(
      'Create new account? (Y/n): '
    )

  const shouldCreate =
    createNew
      .toLowerCase()
      .trim() !== 'n'

  try {
    let uid

    if (shouldCreate) {
      console.log(
        '\nCreating admin user...'
      )

      const cred =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )

      uid = cred.user.uid

      console.log(
        '✅ Firebase Auth created'
      )
    } else {
      console.log(
        '\nLogging existing user...'
      )

      const cred =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        )

      uid = cred.user.uid
    }

    await setDoc(
      doc(db, 'users', uid),
      {
        uid,
        name,
        email,
        role: 'admin',

        blocked: false,

        createdAt:
          serverTimestamp(),
      }
    )

    console.log(
      '\n✅ ADMIN CREATED'
    )

    console.log(
      '\nEmail:',
      email
    )

    console.log(
      'Role: admin'
    )

    console.log(
      '\nLogin URL:'
    )

    console.log(
      'http://localhost:5173/admin/login\n'
    )
  } catch (error) {
    console.log(
      '\n❌ ERROR:',
      error.message
    )

    if (
      error.code ===
      'auth/email-already-in-use'
    ) {
      console.log(
        '\nUser exists already.'
      )

      console.log(
        'Run again and choose n'
      )
    }
  }

  rl.close()
}

createAdmin()