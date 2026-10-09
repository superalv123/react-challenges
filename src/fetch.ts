import { useEffect, useState } from 'react'

export const useJsonQuery = <T,>(
  url: string,
): [T | null, boolean, Error | null] => {
  const [json, setJson] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isActive = true

    const fetchJson = async () => {
      setJson(null)
      setError(null)
      setIsLoading(true)

      try {
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`)
        }

        const result = (await response.json()) as T

        if (isActive) {
          setJson(result)
        }
      } catch (caughtError) {
        if (isActive) {
          setError(
            caughtError instanceof Error
              ? caughtError
              : new Error('Unable to fetch JSON data.'),
          )
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void fetchJson()

    return () => {
      isActive = false
    }
  }, [url])

  return [json, isLoading, error]
}
