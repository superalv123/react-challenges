import type { Course } from '../types/schedule'

interface CoursePlanProps {
  courses: Course[]
  onClose: () => void
}

export const CoursePlan = ({ courses, onClose }: CoursePlanProps) => (
  <div
    className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 p-4"
    onClick={onClose}
  >
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-plan-title"
      className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="course-plan-title" className="text-2xl font-bold text-stone-900">
          Course plan
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-stone-300 px-3 py-2 font-medium text-stone-800 hover:bg-stone-100"
        >
          Close
        </button>
      </div>

      {courses.length === 0 ? (
        <p className="text-stone-700">
          No courses selected. Choose a term and click courses to add them to
          your plan.
        </p>
      ) : (
        <ul className="max-h-[60vh] space-y-3 overflow-y-auto">
          {courses.map((course) => (
            <li
              key={course.code}
              className="rounded-md border border-stone-200 p-3"
            >
              <h3 className="font-semibold text-stone-900">
                CS {course.number}: {course.title}
              </h3>
              <p className="mt-1 text-stone-700">
                {course.term} · {course.meets}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  </div>
)
