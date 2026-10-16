import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import App from './App'

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('shows the loading state while schedule data is being fetched', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise<Response>(() => {
            // intentionally unresolved so the loading state remains visible
          }),
      ),
    )

    render(<App />)

    expect(screen.getByText(/loading course schedule/i)).toBeTruthy()
  })

  it('renders the schedule after the data is fetched', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          schedules: {
            'CS-2018-2019': {
              title: 'CS Courses for 2018-2019',
              courses: {
                F101: {
                  term: 'Fall',
                  number: '101',
                  meets: 'MWF 11:00-11:50',
                  title: 'Computer Science: Concepts, Philosophy, and Connections',
                },
              },
            },
          },
        }),
      }),
    )

    render(<App />)

    expect(
      await screen.findByRole('heading', {
        name: /cs courses for 2018-2019/i,
      }),
    ).toBeTruthy()
    expect(
      screen.getByText(/computer science: concepts, philosophy, and connections/i),
    ).toBeTruthy()
  })

  it('filters courses when the selected term changes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          schedules: {
            'CS-2018-2019': {
              title: 'CS Courses for 2018-2019',
              courses: {
                F101: {
                  term: 'Fall',
                  number: '101',
                  meets: 'MWF 11:00-11:50',
                  title: 'Fall course',
                },
                W201: {
                  term: 'Winter',
                  number: '201',
                  meets: 'TuTh 9:30-10:50',
                  title: 'Winter course',
                },
                S301: {
                  term: 'Spring',
                  number: '301',
                  meets: 'TuTh 11:00-12:20',
                  title: 'Spring course',
                },
              },
            },
          },
        }),
      }),
    )

    render(<App />)

    expect(await screen.findByText('Fall course')).toBeTruthy()
    expect(screen.queryByText('Winter course')).toBeNull()
    expect(screen.queryByText('Spring course')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Winter' }))
    expect(screen.getByText('Winter course')).toBeTruthy()
    expect(screen.queryByText('Fall course')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Spring' }))
    expect(screen.getByText('Spring course')).toBeTruthy()
    expect(screen.queryByText('Winter course')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Fall' }))
    expect(screen.getByText('Fall course')).toBeTruthy()
    expect(screen.queryByText('Spring course')).toBeNull()
  })

  it('selects and unselects multiple courses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          schedules: {
            'CS-2018-2019': {
              title: 'CS Courses for 2018-2019',
              courses: {
                F101: {
                  term: 'Fall',
                  number: '101',
                  meets: 'MWF 11:00-11:50',
                  title: 'First course',
                },
                F102: {
                  term: 'Fall',
                  number: '102',
                  meets: 'TuTh 9:30-10:50',
                  title: 'Second course',
                },
              },
            },
          },
        }),
      }),
    )

    render(<App />)

    const firstCourse = await screen.findByRole('button', {
      name: 'Fall CS 101',
    })
    const secondCourse = screen.getByRole('button', { name: 'Fall CS 102' })

    expect(firstCourse.getAttribute('aria-pressed')).toBe('false')
    expect(secondCourse.getAttribute('aria-pressed')).toBe('false')

    fireEvent.click(firstCourse)
    fireEvent.click(secondCourse)

    expect(firstCourse.getAttribute('aria-pressed')).toBe('true')
    expect(secondCourse.getAttribute('aria-pressed')).toBe('true')
    expect(firstCourse.className).toContain('bg-green-100')
    expect(secondCourse.className).toContain('bg-green-100')

    fireEvent.click(firstCourse)

    expect(firstCourse.getAttribute('aria-pressed')).toBe('false')
    expect(secondCourse.getAttribute('aria-pressed')).toBe('true')
  })

  it('shows an error message if the schedule cannot be fetched', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    )

    render(<App />)

    expect(
      await screen.findByRole('alert', {
        name: /unable to load course schedule/i,
      }),
    ).toBeTruthy()
  })

  it('shows an empty state when the request returns no JSON data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => null,
      }),
    )

    render(<App />)

    expect(
      await screen.findByText(/no course schedule data found/i),
    ).toBeTruthy()
  })

  it('shows an empty state when the requested schedule is not present', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ schedules: {} }),
      }),
    )

    render(<App />)

    expect(
      await screen.findByText(/course schedule was not found/i),
    ).toBeTruthy()
  })
})
