import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

export const SCHEDULE_URL = 'https://courses.cs.northwestern.edu/394/guides/data/cs-courses-firestore.php'

const isValidMeetingTime = (value: string) => {
  if (value === '') {
    return true
  }

  const match =
    /^(?<days>(?:Tu|Th|Sa|Su|M|W|F)+) (?<start>(?:[01]?\d|2[0-3]):[0-5]\d)-(?<end>(?:[01]?\d|2[0-3]):[0-5]\d)$/.exec(
      value,
    )
  const days = match?.groups?.days
  const start = match?.groups?.start
  const end = match?.groups?.end

  if (!days || !start || !end) {
    return false
  }

  const dayTokens = days.match(/Tu|Th|Sa|Su|M|W|F/g)
  if (
    !dayTokens ||
    dayTokens.join('') !== days ||
    new Set(dayTokens).size !== dayTokens.length
  ) {
    return false
  }

  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  return toMinutes(start) < toMinutes(end)
}

const ScheduleCourse = z.object({
  term: z.enum(['Fall', 'Winter', 'Spring', 'Summer'], {
    error: 'Term must be Fall, Winter, Spring, or Summer.',
  }),
  number: z
    .string()
    .regex(/^\d+(?:-\d+)?$/, 'Course number must be a number, optionally followed by a section (e.g., 213-2).'),
  meets: z.string().refine(
    isValidMeetingTime,
    'Enter days and a start-end time, e.g., MWF 12:00-13:20.',
  ),
  title: z.string().min(2, 'Course title must be at least 2 characters.'),
})

const Course = ScheduleCourse.extend({
  code: z.string(),
})

const Schedule = z.object({
  title: z.string(),
  courses: z.record(z.string(), ScheduleCourse),
})

const ScheduleData = z.object({
  schedules: z.record(z.string(), Schedule),
})

export type ScheduleCourse = z.infer<typeof ScheduleCourse>
export type Course = z.infer<typeof Course>
export type Schedule = z.infer<typeof Schedule>
export type ScheduleData = z.infer<typeof ScheduleData>

export const validateCourseData = Course.safeParse;
export const courseResolver = zodResolver(Course);