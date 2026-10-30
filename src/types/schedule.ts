import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

export const SCHEDULE_URL = 'https://courses.cs.northwestern.edu/394/guides/data/cs-courses-firestore.php'

const ScheduleCourse = z.object({
  term: z.string(),
  number: z.string(),
  meets: z.string(),
  title: z.string(),
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