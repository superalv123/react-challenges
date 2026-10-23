type ScheduledCourse = {
  term: string
  meets: string
}

const meetingDays = ['Th', 'Tu', 'Su', 'Sa', 'M', 'T', 'W', 'F']

const parseMeeting = (meeting: string) => {
  if (meeting === '') {
    return null
  }

  const match = /^([A-Za-z]+)\s+(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/.exec(
    meeting,
  )

  if (!match) {
    return null
  }

  const [, dayString, startHour, startMinute, endHour, endMinute] = match
  const days = new Set<string>()
  let remainingDays = dayString

  while (remainingDays.length > 0) {
    const day = meetingDays.find((candidate) =>
      remainingDays.startsWith(candidate),
    )

    if (!day) {
      return null
    }

    days.add(day)
    remainingDays = remainingDays.slice(day.length)
  }

  return {
    days,
    start: Number(startHour) * 60 + Number(startMinute),
    end: Number(endHour) * 60 + Number(endMinute),
  }
}

const dayOverlapExists = (firstDays: Set<string>, secondDays: Set<string>) =>
  [...firstDays].some((day) => secondDays.has(day))

const timeOverlapExists = (
  firstStart: number,
  firstEnd: number,
  secondStart: number,
  secondEnd: number,
) => firstStart < secondEnd && secondStart < firstEnd

const timeConflictExists = (firstMeeting: string, secondMeeting: string) => {
  const first = parseMeeting(firstMeeting)
  const second = parseMeeting(secondMeeting)

  return (
    first !== null &&
    second !== null &&
    dayOverlapExists(first.days, second.days) &&
    timeOverlapExists(first.start, first.end, second.start, second.end)
  )
}

const doCoursesConflict = (
  firstCourse: ScheduledCourse,
  secondCourse: ScheduledCourse,
) =>
  firstCourse.term === secondCourse.term &&
  timeConflictExists(firstCourse.meets, secondCourse.meets)

export const getConflictingCourseList = <T extends ScheduledCourse>(
  course: T,
  selectedCourses: readonly T[],
): T[] =>
  selectedCourses.filter((selectedCourse) =>
    doCoursesConflict(course, selectedCourse),
  )