export const SCHEDULE_URL =
  'https://courses.cs.northwestern.edu/394/guides/data/cs-courses-firestore.php'
  
export type ScheduleCourse = {
  term: string
  number: string
  meets: string
  title: string
}

export type Schedule = {
  title: string
  courses: Record<string, ScheduleCourse>
}

export type ScheduleData = {
  schedules: Record<string, Schedule>
}

export type Course = ScheduleCourse & {
  code: string
}