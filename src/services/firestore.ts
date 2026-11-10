import { doc, FieldPath, getDoc, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import type { ScheduleCourse, ScheduleData, ScheduleEntry } from '../types/schedule'
import { db } from './firebase'

export const SCHEDULE_DOCUMENT_PATH = 'schedules/CS-2018-2019'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

export const sortCoursesByCode = <T,>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map(sortCoursesByCode) as T
  }

  if (!isRecord(value)) {
    return value
  }

  const sortedEntries = Object.entries(value).map(([key, child]) => {
    if (key !== 'courses' || !isRecord(child)) {
      return [key, sortCoursesByCode(child)]
    }

    const sortedCourses = Object.fromEntries(
      Object.entries(child)
        .sort(([firstCode], [secondCode]) => firstCode.localeCompare(secondCode))
        .map(([code, course]) => [code, sortCoursesByCode(course)]),
    )

    return [key, sortedCourses]
  })

  return Object.fromEntries(sortedEntries) as T
}

export const resolveSchedule = (
  data: ScheduleData | ScheduleEntry | null,
): ScheduleEntry | null => {
  if (!data) {
    return null
  }

  if ('schedules' in data && data.schedules) {
    const schedule = data.schedules['CS-2018-2019']

    if (schedule) {
      return schedule
    }
  }

  if ('title' in data && 'courses' in data) {
    return data as ScheduleEntry
  }

  return null
}

export const useDataQuery = <T,>(
  documentPath: string,
): [T | null, boolean, Error | null] => {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isActive = true

    const fetchData = async () => {
      setData(null)
      setError(null)
      setIsLoading(true)

      try {
        const reference = doc(db, documentPath)
        const snapshot = await getDoc(reference)

        if (snapshot.exists()) {
          if (isActive) {
            setData(sortCoursesByCode(snapshot.data() as T))
          }
          return
        }

        throw new Error('No data was found in Firestore.')
      } catch (caughtError) {
        if (isActive) {
          setError(
            caughtError instanceof Error
              ? caughtError
              : new Error('Unable to fetch Firestore data.'),
          )
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void fetchData()

    return () => {
      isActive = false
    }
  }, [documentPath])

  return [data, isLoading, error]
}

export const updateCourse = async (
  documentPath: string,
  code: string,
  course: ScheduleCourse,
): Promise<void> => {
  await updateDoc(doc(db, documentPath), new FieldPath('courses', code), course)
}
