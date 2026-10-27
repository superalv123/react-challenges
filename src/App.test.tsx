import { fireEvent, render, screen } from '@testing-library/react'
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { routeTree } from './routeTree.gen'

const renderApp = (initialEntry = '/') => {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialEntry] }),
  })

  return render(<RouterProvider router={router} />)
}

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('shows the loading state while schedule data is being fetched', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise<Response>(() => {
            // intentionally unresolved so the loading state remains visible
          }),
      ),
    )

    renderApp()

    expect(await screen.findByText(/loading course schedule/i)).toBeTruthy()
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

    renderApp()

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

    renderApp()

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

    renderApp()

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
    expect(firstCourse.closest('article')?.className).toContain('bg-green-100')
    expect(secondCourse.closest('article')?.className).toContain('bg-green-100')

    fireEvent.click(firstCourse)

    expect(firstCourse.getAttribute('aria-pressed')).toBe('false')
    expect(secondCourse.getAttribute('aria-pressed')).toBe('true')
  })

  it('prevents conflicting selections and makes courses available after unselecting', async () => {
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
                  meets: 'MWF 9:00-9:50',
                  title: 'Morning course',
                },
                F102: {
                  term: 'Fall',
                  number: '102',
                  meets: 'MWF 9:30-10:20',
                  title: 'Overlapping course',
                },
                F103: {
                  term: 'Fall',
                  number: '103',
                  meets: 'TuTh 9:30-10:20',
                  title: 'Non-conflicting course',
                },
              },
            },
          },
        }),
      }),
    )

    renderApp()

    const selectedCourse = await screen.findByRole('button', {
      name: 'Fall CS 101',
    })
    const conflictingCourse = screen.getByRole('button', {
      name: 'Fall CS 102',
    })
    const availableCourse = screen.getByRole('button', {
      name: 'Fall CS 103',
    })

    fireEvent.click(selectedCourse)

    expect(selectedCourse.hasAttribute('disabled')).toBe(false)
    expect(selectedCourse.getAttribute('aria-pressed')).toBe('true')
    expect(conflictingCourse.hasAttribute('disabled')).toBe(true)
    expect(screen.getByText('Time conflict')).toBeTruthy()
    expect(availableCourse.hasAttribute('disabled')).toBe(false)

    fireEvent.click(selectedCourse)

    expect(selectedCourse.getAttribute('aria-pressed')).toBe('false')
    expect(conflictingCourse.hasAttribute('disabled')).toBe(false)
    expect(screen.queryByText('Time conflict')).toBeNull()
  })

  it('opens a course plan with selected course details and closes from the button or backdrop', async () => {
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
                  title: 'Computer Science Fundamentals',
                },
              },
            },
          },
        }),
      }),
    )

    renderApp()

    fireEvent.click(
      await screen.findByRole('button', { name: 'Fall CS 101' }),
    )
    fireEvent.click(screen.getByRole('button', { name: /course plan/i }))

    const dialog = screen.getByRole('dialog', { name: 'Course plan' })
    expect(dialog.textContent).toContain('CS 101: Computer Science Fundamentals')
    expect(dialog.textContent).toContain('Fall · MWF 11:00-11:50')

    fireEvent.click(screen.getByRole('heading', { name: 'Course plan' }))
    expect(screen.getByRole('dialog')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: /course plan/i }))
    fireEvent.click(screen.getByRole('dialog').parentElement as HTMLElement)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('shows instructions when opening an empty course plan', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          schedules: {
            'CS-2018-2019': {
              title: 'CS Courses for 2018-2019',
              courses: {},
            },
          },
        }),
      }),
    )

    renderApp()
    await screen.findByRole('button', { name: 'Fall' })
    fireEvent.click(screen.getByRole('button', { name: /course plan/i }))

    expect(screen.getByText(/no courses selected/i)).toBeTruthy()
    expect(screen.getByText(/click courses to add them/i)).toBeTruthy()
  })

  it('opens a populated course edit form and returns to the list on cancel', async () => {
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
                  title: 'Computer Science Fundamentals',
                },
              },
            },
          },
        }),
      }),
    )

    renderApp()

    fireEvent.click(
      await screen.findByRole('link', { name: 'Edit Fall CS 101' }),
    )

    expect(
      await screen.findByRole('heading', { name: 'Edit CS F101' }),
    ).toBeTruthy()
    expect(
      (screen.getByRole('textbox', { name: 'Course title' }) as HTMLInputElement)
        .value,
    ).toBe('Computer Science Fundamentals')
    expect(
      (screen.getByRole('textbox', { name: 'Meeting times' }) as HTMLInputElement)
        .value,
    ).toBe('MWF 11:00-11:50')
    expect(screen.queryByRole('button', { name: /submit/i })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(
      await screen.findByRole('heading', {
        name: 'CS Courses for 2018-2019',
      }),
    ).toBeTruthy()
    expect(await screen.findByRole('link', { name: 'Edit Fall CS 101' })).toBeTruthy()
  })

  it('shows an error message if the schedule cannot be fetched', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    )

    renderApp()

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

    renderApp()

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

    renderApp()

    expect(
      await screen.findByText(/course schedule was not found/i),
    ).toBeTruthy()
  })
})
