import { createFileRoute, useParams } from '@tanstack/react-router'
import { useJsonQuery } from '../utilities/fetch'
import { SCHEDULE_URL, type ScheduleData } from '../types/schedule'
import CourseEditForm from '../components/CourseEditForm'

const CourseEditComponent = () => {
  const { code } = useParams({ from: '/course/$code/edit' })
  const [json, isLoading, error] = useJsonQuery<ScheduleData>(SCHEDULE_URL)

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

  const course = json?.schedules?.['CS-2018-2019']?.courses?.[code]

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
