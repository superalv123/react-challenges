import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm, type SubmitErrorHandler, type SubmitHandler } from 'react-hook-form'
import { SCHEDULE_DOCUMENT_PATH, updateCourse } from '../services/firestore'
import { courseResolver, type Course } from '../types/schedule'
import { CourseField } from './CourseField'

const editableFields = ['title', 'term', 'number', 'meets'] as const

const hasChanges = (values: Course, initialValues: Course) =>
  editableFields.some((field) => values[field] !== initialValues[field])

const CourseEditForm = ({
  code,
  initialValues,
}: {
  code: string
  initialValues: Course
}) => {
  const navigate = useNavigate({ from: '/course/$code/edit' })
  const [status, setStatus] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Course>({
    defaultValues: initialValues,
    mode: 'onChange',
    resolver: courseResolver,
  })

  const onSubmit: SubmitHandler<Course> = async (values) => {
    if (!hasChanges(values, initialValues)) {
      setStatus('No changes to submit.')
      return
    }

    setStatus(null)
    const { title, term, number, meets } = values

    try {
      await updateCourse(SCHEDULE_DOCUMENT_PATH, code, {
        title,
        term,
        number,
        meets,
      })
      await navigate({ to: '/' })
    } catch (error) {
      console.error('Failed to save course', error)
      setStatus('Unable to save course. Please try again.')
    }
  }

  const onError: SubmitErrorHandler<Course> = () => {
    setStatus('Fix the highlighted fields before submitting.')
  }

  return (
    <section className="rounded-lg border border-stone-300 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold text-stone-900">
        Edit CS {code}
      </h2>
      <form
        onSubmit={(event) => void handleSubmit(onSubmit, onError)(event)}
        className="space-y-5"
      >
        <CourseField
          name="title"
          label="Course title"
          errors={errors}
          register={register}
        />
        <CourseField
          name="term"
          label="Term"
          errors={errors}
          register={register}
        />
        <CourseField
          name="number"
          label="Course number"
          errors={errors}
          register={register}
        />
        <CourseField
          name="meets"
          label="Meeting times"
          errors={errors}
          register={register}
        />
        {status && (
          <p role="status" className="text-stone-800">
            {status}
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md border border-stone-900 bg-stone-900 px-4 py-2 font-medium text-white hover:bg-stone-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={() => void navigate({ to: '/' })}
            className="rounded-md border border-stone-400 px-4 py-2 font-medium text-stone-800 hover:bg-stone-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}

export default CourseEditForm
