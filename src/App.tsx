import { useState } from 'react'
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
  isSelected: boolean
  onToggle: (course: Course) => void
}

const termTypes = ['Fall', 'Winter', 'Spring']

const CourseCard = ({ course, isSelected, onToggle }: CourseCardProps) => (
  <button
    type="button"
    aria-label={`${course.term} CS ${course.number}`}
    aria-pressed={isSelected}
    onClick={() => onToggle(course)}
    className={`flex h-full min-h-[220px] w-full flex-col justify-between rounded-lg border p-5 text-left shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 ${
      isSelected
        ? 'border-green-400 bg-green-100'
        : 'border-stone-300 bg-white hover:bg-stone-50'
    }`}
  >
    <div className="space-y-4">
      <span className="text-2xl font-semibold leading-tight text-stone-900">
        {course.term} CS {course.number}
      </span>

      <p className="text-base leading-6 text-stone-700">{course.title}</p>
    </div>

    <span className="mt-6 border-t border-stone-300 pt-4 text-base text-stone-800">
      {course.meets}
    </span>
  </button>
)

type TermSelectorProps = {
  options: string[]
  selectedTerm: string
  onSelectTerm: (term: string) => void
}

const TermSelector = ({
  options,
  selectedTerm,
  onSelectTerm,
}: TermSelectorProps) => (
  <nav aria-label="Choose academic term" className="mb-6 flex gap-2">
    {options.map((term) => (
      <button
        key={term}
        type="button"
        aria-pressed={selectedTerm === term}
        onClick={() => onSelectTerm(term)}
        className={`rounded-md border px-4 py-2 font-medium ${
          selectedTerm === term
            ? 'border-stone-900 bg-stone-900 text-white'
            : 'border-stone-300 bg-white text-stone-800 hover:bg-stone-200'
        }`}
      >
        {term}
      </button>
    ))}
  </nav>
)

type TermPageProps = {
  courses: Course[]
}

const TermPage = ({ courses }: TermPageProps) => {
  const [selectedTerm, setSelectedTerm] = useState('Fall')
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([])
  const filteredCourses = courses.filter(
    (course) => course.term === selectedTerm,
  )
  const toggleCourse = (courseToToggle: Course) => {
    setSelectedCourses((currentCourses) =>
      currentCourses.some((course) => course.code === courseToToggle.code)
        ? currentCourses.filter((course) => course.code !== courseToToggle.code)
        : [...currentCourses, courseToToggle],
    )
  }

  return (
    <>
      <TermSelector
        options={termTypes}
        selectedTerm={selectedTerm}
        onSelectTerm={setSelectedTerm}
      />
      <section
        aria-label={`${selectedTerm} computer science courses`}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.code}
            course={course}
            isSelected={selectedCourses.some(
              (selectedCourse) => selectedCourse.code === course.code,
            )}
            onToggle={toggleCourse}
          />
        ))}
      </section>
    </>
  )
}

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
        <TermPage courses={courses} />
      </div>
    </main>
  )
}

export default App