import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { Course, ScheduleCourse } from '../types/schedule'

interface CourseFieldProps {
  name: keyof ScheduleCourse
  label: string
  errors: FieldErrors<Course>
  register: UseFormRegister<Course>
}

export const CourseField = ({
  name,
  label,
  errors,
  register,
}: CourseFieldProps) => {
  const id = `course-${name}`
  const errorMessage = errors[name]?.message

  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-medium text-stone-800">
        {label}
      </label>
      <input
        id={id}
        type="text"
        {...register(name)}
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={errorMessage ? `${id}-error` : undefined}
        className={
          `w-full rounded-md border px-3 py-2 text-stone-900 focus-visible:outline-2 
          ${errorMessage
            ? 'border-red-600 focus-visible:outline-red-700'
            : 'border-stone-300 focus-visible:outline-blue-700'
          }`
        }
      />
      {errorMessage && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-700" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}