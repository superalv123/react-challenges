import { render, screen } from '@testing-library/react'
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
