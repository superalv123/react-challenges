import { describe, expect, it } from 'vitest'
import { validateCourseData, type Course } from './schedule'

const validCourse: Course = {
  code: 'CS-213-2',
  title: 'Artificial Intelligence',
  term: 'Fall',
  number: '213-2',
  meets: 'MWF 9:00-9:50',
}

const validateWith = (overrides: Partial<Course>) =>
  validateCourseData({ ...validCourse, ...overrides })

describe('validateCourseData', () => {
  it('accepts a course with valid fields', () => {
    expect(validateWith({}).success).toBe(true)
  })

  it('requires a title with at least two characters', () => {
    expect(validateWith({ title: 'AI' }).success).toBe(true)
    expect(validateWith({ title: 'X' }).success).toBe(false)
  })

  it.each(['Fall', 'Winter', 'Spring', 'Summer'] as const)(
    'accepts the %s term',
    (term) => {
      expect(validateWith({ term }).success).toBe(true)
    },
  )

  it('rejects terms outside the supported seasons', () => {
    expect(
      validateCourseData({ ...validCourse, term: 'Autumn' }).success,
    ).toBe(false)
  })

  it('accepts a course number with an optional section', () => {
    expect(validateWith({ number: '213' }).success).toBe(true)
    expect(validateWith({ number: '213-2' }).success).toBe(true)
  })

  it.each(['CS213', '213-', '213-2-1', ''])(
    'rejects invalid course number %s',
    (number) => {
      expect(validateWith({ number }).success).toBe(false)
    },
  )

  it.each(['', 'MWF 9:00-9:50', 'TuTh 14:00-15:20', 'SuSaW 0:00-23:59'])(
    'accepts meeting time %s',
    (meets) => {
      expect(validateWith({ meets }).success).toBe(true)
    },
  )

  it.each([
    'MMWF 9:00-9:50',
    'MWF9:00-9:50',
    'MWF 24:00-24:30',
    'MWF 9:60-10:00',
    'MWF 10:00-9:00',
    'MWF 9:00-9:00',
    'X 9:00-9:50',
  ])('rejects invalid meeting time %s', (meets) => {
    expect(validateWith({ meets }).success).toBe(false)
  })
})
