import { createFileRoute } from '@tanstack/react-router'
import '../App.css'
import { TermPage } from '../components/TermPage'
import { resolveSchedule, SCHEDULE_DOCUMENT_PATH, useDataQuery } from '../services/firestore'
import type { Course, ScheduleData, ScheduleEntry } from '../types/schedule'

const App = () => {
  const [json, isLoading, error] = useDataQuery<ScheduleData | ScheduleEntry>(
    SCHEDULE_DOCUMENT_PATH,
  )

  if (isLoading) {
    return (
      <main className="min-h-screen bg-stone-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-lg text-stone-700">Loading course schedule...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-stone-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p
            role="alert"
            aria-label="Unable to load course schedule"
            className="text-lg text-red-700"
          >
            {`Error loading course schedule: ${error}`}
          </p>
        </div>
      </main>
    )
  }

  if (!json) {
    return (
      <main className="min-h-screen bg-stone-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-lg text-stone-700">No course schedule data found.</p>
        </div>
      </main>
    )
  }

  const schedule = resolveSchedule(json)

  if (
    !schedule ||
    typeof schedule.title !== 'string' ||
    !schedule.courses ||
    typeof schedule.courses !== 'object' ||
    Array.isArray(schedule.courses)
  ) {
    return (
      <main className="min-h-screen bg-stone-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-lg text-stone-700">Course schedule was not found.</p>
        </div>
      </main>
    )
  }

  const courses: Course[] = Object.entries(schedule.courses).map(
    ([code, course]) => ({
      code,
      ...course,
    }),
  )

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl text-stone-900">
          {schedule.title}
        </h1>
        <TermPage courses={courses} />
      </div>
    </main>
  )
}

export const Route = createFileRoute('/')({
  component: App,
})