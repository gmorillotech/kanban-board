import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../types'

const PRIORITY_STYLES = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-blue-100 text-blue-700',
  low: 'bg-gray-100 text-gray-600',
}

interface Props {
  task: Task
  onDelete: (id: string) => void
}

export default function TaskCard({ task, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date()

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing group"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-800 leading-snug">{task.title}</p>
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 text-xs transition-opacity"
        >
          ✕
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority}
        </span>

        {task.due_date && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            isOverdue ? 'bg-red-100 text-red-600' : 'bg-amber-50 text-amber-600'
          }`}>
            {isOverdue ? '⚠ ' : ''}
            {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  )
}