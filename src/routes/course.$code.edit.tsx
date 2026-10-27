import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { useJsonQuery } from '../utilities/fetch'
import { SCHEDULE_URL, type ScheduleData } from '../types/schedule'

type CourseFormValues = {
  title: string
  meets: string
}

const CourseEditForm = ({
  code,
  initialValues,
}: {
  code: string
  initialValues: CourseFormValues
}) => {
  const navigate = useNavigate({ from: '/course/$code/edit' })
  const {
    register,
    handleSubmit,
  } = useForm<CourseFormValues>({ defaultValues: initialValues })
  const onSubmit: SubmitHandler<CourseFormValues> = () => undefined

  return (
    <section className="rounded-lg border border-stone-300 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold text-stone-900">
        Edit CS {code}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="course-title"
            className="mb-1 block font-medium text-stone-800"
          >
            Course title
          </label>
          <input
            id="course-title"
            type="text"
            {...register('title')}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-stone-900 focus-visible:outline-2 focus-visible:outline-blue-700"
          />
        </div>
        <div>
          <label
            htmlFor="course-meets"
            className="mb-1 block font-medium text-stone-800"
          >
            Meeting times
          </label>
          <input
            id="course-meets"
            type="text"
            {...register('meets')}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-stone-900 focus-visible:outline-2 focus-visible:outline-blue-700"
          />
        </div>
        <button
          type="button"
          onClick={() => void navigate({ to: '/' })}
          className="rounded-md border border-stone-400 px-4 py-2 font-medium text-stone-800 hover:bg-stone-100"
        >
          Cancel
        </button>
      </form>
    </section>
  )
}

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
      initialValues={{ title: course.title, meets: course.meets }}
    />
  )
}

export const Route = createFileRoute('/course/$code/edit')({
  component: CourseEditComponent,
})
