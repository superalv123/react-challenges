import { createFileRoute, useParams } from '@tanstack/react-router'
import CourseEditForm from '../components/CourseEditForm'
import type { ScheduleData, ScheduleEntry } from '../types/schedule'
import { resolveSchedule, SCHEDULE_DOCUMENT_PATH, useDataQuery } from '../services/firestore'
import { describeError, useProfile } from '../utilities/profile'

const CourseEditComponent = () => {
  const { code } = useParams({ from: '/course/$code/edit' })
  const [json, isLoading, error] = useDataQuery<
    ScheduleData | ScheduleEntry
  >(SCHEDULE_DOCUMENT_PATH)
  const courseData = resolveSchedule(json)
  const { isAuthenticated, isAdmin, isLoading: isProfileLoading, error: profileError } = useProfile()

  if (isProfileLoading) {
    return <p className="text-stone-700">Checking sign-in status...</p>
  }

  if (!isAuthenticated) {
    return (
      <p role="alert" className="text-red-700">
        You must be signed in to edit courses.
      </p>
    )
  }

  if (profileError) {
    return (
      <p role="alert" className="text-red-700">
        Unable to check administrator access. Please report this error: {describeError(profileError)}
      </p>
    )
  }

  if (!isAdmin) {
    return (
      <p role="alert" className="text-red-700">
        Only administrators can edit courses.
      </p>
    )
  }

  if (isLoading) {
    return <p className="text-stone-700">Loading course...</p>
  }

  if (error) {
    return (
      <p role="alert" className="text-red-700">
        Error loading course: {error.message}
      </p>
    )
  }

  const course = courseData?.courses?.[code]

  if (!course) {
    return <p role="alert" className="text-red-700">Course not found.</p>
  }

  return (
    <CourseEditForm
      code={code}
      initialValues={{ title: course.title, meets: course.meets, term: course.term, number: course.number, code: code }}
    />
  )
}

export const Route = createFileRoute('/course/$code/edit')({
  component: CourseEditComponent,
})
