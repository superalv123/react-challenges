import { useNavigate } from '@tanstack/react-router'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { type Course } from '../types/schedule'
import { CourseField } from './CourseField'

const CourseEditForm = ({
  code,
  initialValues,
}: {
  code: string
  initialValues: Course
}) => {
  const navigate = useNavigate({ from: '/course/$code/edit' })
  const {
    register,
    handleSubmit,
  } = useForm<Course>({ defaultValues: initialValues })
  const onSubmit: SubmitHandler<Course> = () => undefined

  return (
    <section className="rounded-lg border border-stone-300 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold text-stone-900">
        Edit CS {code}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <CourseField name="title" label="Course title" register={register} />
        <CourseField name="term" label="Term" register={register} />
        <CourseField name="number" label="Course number" register={register} />
        <CourseField name="meets" label="Meeting times" register={register} />
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

export default CourseEditForm;