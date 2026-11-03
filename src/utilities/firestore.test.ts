import { describe, expect, it } from 'vitest'
import { sortCoursesByCode } from './firestore'

describe('sortCoursesByCode', () => {
  it('sorts schedule course keys alphabetically without mutating the data', () => {
    const schedule = {
      title: 'CS Courses',
      courses: {
        F213: { title: 'Systems' },
        F101: { title: 'Intro' },
        F110: { title: 'Programming' },
      },
    }

    const sortedSchedule = sortCoursesByCode(schedule)

    expect(Object.keys(sortedSchedule.courses)).toEqual([
      'F101',
      'F110',
      'F213',
    ])
    expect(Object.keys(schedule.courses)).toEqual(['F213', 'F101', 'F110'])
  })

  it('sorts courses inside wrapped schedule JSON', () => {
    const result = sortCoursesByCode({
      schedules: {
        'CS-2018-2019': {
          title: 'CS Courses',
          courses: {
            W201: { title: 'Winter' },
            F101: { title: 'Fall' },
          },
        },
      },
    })

    expect(Object.keys(result.schedules['CS-2018-2019'].courses)).toEqual([
      'F101',
      'W201',
    ])
  })
})
