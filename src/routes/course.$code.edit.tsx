import { createFileRoute, useParams } from '@tanstack/react-router'
import CourseEditForm from '../components/CourseEditForm'
import type { ScheduleData, ScheduleEntry } from '../types/schedule'
import { resolveSchedule, useDataQuery } from '../utilities/firestore'

const CourseEditComponent = () => {
  const { code } = useParams({ from: '/course/$code/edit' })
  const [json, isLoading, error] = useDataQuery<
    ScheduleData | ScheduleEntry
  >('schedules/CS-2018-2019')
  const courseData = resolveSchedule(json)

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
