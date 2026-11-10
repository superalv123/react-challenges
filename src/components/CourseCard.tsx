import { Link } from '@tanstack/react-router'
import type { Course } from '../types/schedule'

interface CourseCardProps {
  course: Course
  isSelected: boolean
  isUnavailable: boolean
  canEdit: boolean
  onToggle: (course: Course) => void
}

export const CourseCard = ({
  course,
  isSelected,
  isUnavailable,
  canEdit,
  onToggle,
}: CourseCardProps) => (
  <article
    className={`flex h-full min-h-[220px] flex-col justify-between rounded-lg border p-5 shadow-sm transition-colors ${
      isUnavailable
        ? 'border-stone-200 bg-stone-100 opacity-60'
        : isSelected
          ? 'border-green-400 bg-green-100'
          : 'border-stone-300 bg-white'
    }`}
  >
    <button
      type="button"
      aria-label={`${course.term} CS ${course.number}`}
      aria-pressed={isSelected}
      aria-disabled={isUnavailable}
      disabled={isUnavailable}
      onClick={() => onToggle(course)}
      className="flex flex-1 flex-col justify-between text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
    >
      <span className="text-2xl font-semibold leading-tight text-stone-900">
        {course.term} CS {course.number}
      </span>

      <span className="mt-4 text-base leading-6 text-stone-700">
        {course.title}
      </span>

      <span className="mt-6 border-t border-stone-300 pt-4 text-base text-stone-800">
        {course.meets}
        {isUnavailable && (
          <span className="ml-2 font-medium text-red-700">Time conflict</span>
        )}
      </span>
    </button>
    {canEdit && (
      <Link
        to="/course/$code/edit"
        params={{ code: course.code }}
        className={`mt-3 w-full rounded-md border px-3 py-2 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 ${
          isSelected
            ? 'border-green-400 bg-green-100 text-stone-800 hover:bg-green-200'
            : 'border-stone-300 bg-white text-stone-800 hover:bg-stone-200'
        }`}
        aria-label={`Edit ${course.term} CS ${course.number}`}
      >
        Edit course
      </Link>
    )}
  </article>
)
