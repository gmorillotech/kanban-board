import { useState } from 'react'
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { COLUMNS } from '../types'
import type {Status, Task } from '../types'
import { useTasks } from '../hooks/useTasks'
import Column from './Column'
import CreateTaskModal from './CreateTaskModal'

export default function Board() {
  const { tasks, loading, error, createTask, updateTaskStatus, deleteTask } = useTasks()
  const [showModal, setShowModal] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    const activeTask = tasks.find(t => t.id === active.id)
    if (!activeTask) return

    // over.id could be a column id or a task id
    const overId = over.id as string
    const overColumn = COLUMNS.find(c => c.id === overId)
    const overTask = tasks.find(t => t.id === overId)

    const newStatus: Status = overColumn
      ? overColumn.id
      : overTask
      ? overTask.status
      : activeTask.status

    if (newStatus !== activeTask.status) {
      updateTaskStatus(activeTask.id, newStatus)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Board</h1>
          <p className="text-sm text-gray-400 mt-0.5">{tasks.length} tasks</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + New Task
        </button>
      </div>

      {/* Columns */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {COLUMNS.map(col => (
            <Column
              key={col.id}
              id={col.id}
              label={col.title}
              tasks={tasks.filter(t => t.status === col.id)}
              onDelete={deleteTask}
            />
          ))}
        </div>
      </DndContext>

      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onCreate={createTask}
        />
      )}
    </div>
  )
}