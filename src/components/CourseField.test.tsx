import { fireEvent, render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { courseResolver, type Course } from '../types/schedule'
import { CourseField } from './CourseField'

const validCourse: Course = {
  code: 'CS-213-2',
  title: 'Artificial Intelligence',
  term: 'Fall',
  number: '213-2',
  meets: 'MWF 9:00-9:50',
}

const CourseFieldHarness = () => {
  const {
    register,
    formState: { errors },
  } = useForm<Course>({
    defaultValues: validCourse,
    mode: 'onChange',
    resolver: courseResolver,
  })

  return (
    <CourseField
      name="meets"
      label="Meeting times"
      errors={errors}
      register={register}
    />
  )
}

describe('CourseField', () => {
  it('shows an accessible validation message for invalid field data', async () => {
    render(<CourseFieldHarness />)

    const field = screen.getByRole('textbox', { name: 'Meeting times' })
    fireEvent.change(field, { target: { value: 'MWF 14:00-13:00' } })

    const error = await screen.findByText(
      'Enter days and a start-end time, e.g., MWF 12:00-13:20.',
    )
    expect(error.textContent).toBe(
      'Enter days and a start-end time, e.g., MWF 12:00-13:20.',
    )
    expect(field.getAttribute('aria-invalid')).toBe('true')
    expect(field.getAttribute('aria-describedby')).toBe('course-meets-error')
  })
})
