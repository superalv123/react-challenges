import './App.css'
import { useJsonQuery } from './fetch'

const SCHEDULE_URL =
  'https://courses.cs.northwestern.edu/394/guides/data/cs-courses-firestore.php'

type ScheduleCourse = {
  term: string
  number: string
  meets: string
  title: string
}

type Schedule = {
  title: string
  courses: Record<string, ScheduleCourse>
}

type ScheduleData = {
  schedules: Record<string, Schedule>
}

type Course = ScheduleCourse & {
  code: string
}

type CourseCardProps = {
  course: Course
}

const CourseCard = ({ course }: CourseCardProps) => (
  <article
    aria-label={`${course.term} CS ${course.number}`}
    className="flex h-full min-h-[220px] flex-col justify-between rounded-lg border border-stone-300 bg-white p-5 shadow-sm"
  >
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold leading-tight text-stone-900">
        {course.term} CS {course.number}
      </h2>

      <p className="text-base leading-6 text-stone-700">{course.title}</p>
    </div>

    <footer className="mt-6 border-t border-stone-300 pt-4 text-base text-stone-800">
      {course.meets}
    </footer>
  </article>
)

const App = () => {
  const [json, isLoading, error] = useJsonQuery<ScheduleData>(SCHEDULE_URL)

  if (isLoading) {
    return (
      <main className="min-h-screen bg-stone-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-lg text-stone-700">Loading course schedule...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-stone-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p
            role="alert"
            aria-label="Unable to load course schedule"
            className="text-lg text-red-700"
          >
            {`Error loading course schedule: ${error}`}
          </p>
        </div>
      </main>
    )
  }

  if (
    !json ||
    !json.schedules ||
    typeof json.schedules !== 'object' ||
    Array.isArray(json.schedules)
  ) {
    return (
      <main className="min-h-screen bg-stone-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-lg text-stone-700">No course schedule data found.</p>
        </div>
      </main>
    )
  }

  const schedule = json.schedules['CS-2018-2019']

  if (
    !schedule ||
    typeof schedule.title !== 'string' ||
    !schedule.courses ||
    typeof schedule.courses !== 'object' ||
    Array.isArray(schedule.courses)
  ) {
    return (
      <main className="min-h-screen bg-stone-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-lg text-stone-700">Course schedule was not found.</p>
        </div>
      </main>
    )
  }

  const courses: Course[] = Object.entries(schedule.courses).map(
    ([code, course]) => ({
      code,
      ...course,
    }),
  )

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold text-stone-900">
          {schedule.title}
        </h1>

        <section
          aria-label="Computer Science course schedule"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {courses.map((course) => (
            <CourseCard key={course.code} course={course} />
          ))}
        </section>
      </div>
    </main>
  )
}

export default App