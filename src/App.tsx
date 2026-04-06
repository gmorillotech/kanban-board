import { useEffect, useState } from 'react'
import { getOrCreateSession } from './lib/auth'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    getOrCreateSession()
      .then(() => setReady(true))
      .catch(err => console.error('Auth error:', err))
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-gray-800">Kanban Board</h1>
      <p className="text-gray-500 mt-1">Auth ready ✓</p>
    </div>
  )
}