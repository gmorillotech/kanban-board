import { useEffect, useState } from 'react'
import { getOrCreateSession } from './lib/auth'
import Board from './components/Board'

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
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Board />
      </div>
    </div>
  )
}