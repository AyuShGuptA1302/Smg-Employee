import { useEffect, useMemo, useState } from 'react'

// Simple mock API with localStorage persistence and async delays
export function useMockApi(key, initialData) {
  const storageKey = `mock:${key}`
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? JSON.parse(raw) : initialData
    } catch {
      return initialData
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data))
    } catch {}
  }, [data, storageKey])

  const delay = (ms = 450) => new Promise(res => setTimeout(res, ms))

  const api = useMemo(() => ({
    async refresh() {
      setLoading(true)
      setError(null)
      await delay(250)
      setLoading(false)
      return data
    },
    async add(item) {
      setLoading(true)
      setError(null)
      await delay()
      setData(prev => [...prev, item])
      setLoading(false)
      return item
    },
    async update(matchFn, updater) {
      setLoading(true)
      setError(null)
      await delay()
      setData(prev => prev.map(it => (matchFn(it) ? { ...it, ...updater(it) } : it)))
      setLoading(false)
    },
    async remove(matchFn) {
      setLoading(true)
      setError(null)
      await delay()
      setData(prev => prev.filter(it => !matchFn(it)))
      setLoading(false)
    },
  }), [data])

  return { data, setData, api, loading, error }
}

export function useSearch(source, fields, query) {
  return useMemo(() => {
    if (!query) return source
    const q = query.toLowerCase()
    return source.filter(item =>
      fields.some(f => String(item[f] ?? '').toLowerCase().includes(q))
    )
  }, [source, fields, query])
}

export function useSort(source, field, dir = 'asc') {
  return useMemo(() => {
    if (!field) return source
    const sorted = [...source].sort((a, b) => {
      const av = a[field]
      const bv = b[field]
      if (typeof av === 'number' && typeof bv === 'number') {
        return av - bv
      }
      return String(av).localeCompare(String(bv))
    })
    return dir === 'desc' ? sorted.reverse() : sorted
  }, [source, field, dir])
}
