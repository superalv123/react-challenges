import { deleteApp, initializeApp } from 'firebase/app'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { readFile } from 'node:fs/promises'

const DATA_FILE = new URL('../src/data/cs-courses-firestore.json', import.meta.url)
const FIREBASE_CONFIG_FILE = new URL('../firebase.config.json', import.meta.url)
const args = process.argv.slice(2)
const apply = args.includes('--apply')

const jsonText = await readFile(DATA_FILE, 'utf8')
const data = JSON.parse(jsonText)
const firebaseConfig = JSON.parse(
  await readFile(FIREBASE_CONFIG_FILE, 'utf8'),
)
const schedules = data?.schedules

if (!schedules || typeof schedules !== 'object' || Array.isArray(schedules)) {
  throw new Error('The input JSON must contain a schedules object.')
}

const entries = Object.entries(schedules)

if (entries.length === 0) {
  throw new Error('The input JSON contains no schedules to import.')
}

for (const [scheduleId, schedule] of entries) {
  if (
    !scheduleId ||
    scheduleId.includes('/') ||
    !schedule ||
    typeof schedule !== 'object' ||
    Array.isArray(schedule) ||
    typeof schedule.title !== 'string' ||
    !schedule.courses ||
    typeof schedule.courses !== 'object' ||
    Array.isArray(schedule.courses)
  ) {
    throw new Error(`Invalid schedule data for document "${scheduleId}".`)
  }
}

if (!apply) {
  console.log(
    `Preview only: ${entries.length} schedule document(s) will be written to ${firebaseConfig.projectId}/(default). Re-run with --apply to import.`,
  )
} else {
  const app = initializeApp(firebaseConfig)
  const firestore = getFirestore(app)

  try {
    for (const [scheduleId, schedule] of entries) {
      await setDoc(doc(firestore, 'schedules', scheduleId), schedule)
    }

    console.log(
      `Imported ${entries.length} schedule document(s) into ${firebaseConfig.projectId}/(default).`,
    )
  } finally {
    await deleteApp(app)
  }
}
