import './App.css'

const schedules = {
  'CS-2018-2019': {
    title: 'CS Courses for 2018-2019',
    courses: {
      F101: {
        term: 'Fall',
        number: '101',
        meets: 'MWF 11:00-11:50',
        title: 'Computer Science: Concepts, Philosophy, and Connections',
      },
      F110: {
        term: 'Fall',
        number: '110',
        meets: 'MWF 10:00-10:50',
        title: 'Intro Programming for non-majors',
      },
      S313: {
        term: 'Spring',
        number: '313',
        meets: 'TuTh 15:30-16:50',
        title: 'Tangible Interaction Design and Learning',
      },
      S314: {
        term: 'Spring',
        number: '314',
        meets: 'TuTh 9:30-10:50',
        title: 'Tech & Human Interaction',
      },
    },
  },
} as const

type Course = {
  code: string
  term: string
  number: string
  meets: string
  title: string
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
  const schedule = schedules['CS-2018-2019']

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