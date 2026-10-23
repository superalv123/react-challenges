import { describe, expect, it } from 'vitest'

import { getConflictingCourseList } from './calculateConflicts'

type Course = {
  code: string
  term: string
  meets: string
}

describe('getConflictingCourseList', () => {
  it('returns courses in the same term with overlapping times and shared days', () => {
    const selectedCourse: Course = {
      code: 'F101',
      term: 'Fall',
      meets: 'MWF 9:00-9:50',
    }
    const overlappingCourse: Course = {
      code: 'F102',
      term: 'Fall',
      meets: 'MW 9:30-10:20',
    }
    const noSharedDay: Course = {
      code: 'F103',
      term: 'Fall',
      meets: 'TuTh 9:30-10:20',
    }
    const differentTerm: Course = {
      code: 'W101',
      term: 'Winter',
      meets: 'MWF 9:30-10:20',
    }

    expect(
      getConflictingCourseList(selectedCourse, [
        overlappingCourse,
        noSharedDay,
        differentTerm,
      ]),
    ).toEqual([overlappingCourse])
  })

  it('does not treat adjacent meeting times as overlapping', () => {
    const course: Course = {
      code: 'F101',
      term: 'Fall',
      meets: 'TuTh 9:00-9:50',
    }
    const adjacentCourse: Course = {
      code: 'F102',
      term: 'Fall',
      meets: 'TuTh 9:50-10:40',
    }

    expect(getConflictingCourseList(course, [adjacentCourse])).toEqual([])
  })

  it('ignores courses with empty meeting strings', () => {
    const course: Course = {
      code: 'F101',
      term: 'Fall',
      meets: '',
    }
    const scheduledCourse: Course = {
      code: 'F102',
      term: 'Fall',
      meets: 'MWF 9:00-9:50',
    }

    expect(getConflictingCourseList(course, [scheduledCourse])).toEqual([])
    expect(getConflictingCourseList(scheduledCourse, [course])).toEqual([])
  })
})
