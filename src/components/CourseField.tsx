import type { UseFormRegister } from 'react-hook-form'
import type { Course, ScheduleCourse } from '../types/schedule'

interface CourseFieldProps {
  name: keyof ScheduleCourse
  label: string
  register: UseFormRegister<Course>
}

export const CourseField = ({ name, label, register }: CourseFieldProps) => {
  const id = `course-${name}`

  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-medium text-stone-800">
        {label}
      </label>
      <input
        id={id}
        type="text"
        {...register(name)}
        className="w-full rounded-md border border-stone-300 px-3 py-2 text-stone-900 focus-visible:outline-2 focus-visible:outline-blue-700"
      />
    </div>
  )
}