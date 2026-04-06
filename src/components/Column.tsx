import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Task, Status } from '../types'
import TaskCard from './TaskCard'

const COLUMN_STYLES: Record<Status, { dot: string; count: string }> = {
  todo:        { dot: 'bg-gray-400',   count: 'bg-gray-100 text-gray-600' },
  in_progress: { dot: 'bg-blue-400',   count: 'bg-blue-50 text-blue-600' },
  in_review:   { dot: 'bg-amber-400',  count: 'bg-amber-50 text-amber-600' },
  done:        { dot: 'bg-green-400',  count: 'bg-green-50 text-green-600' },
}

interface Props {
  id: Status
  label: string
  tasks: Task[]
  onDelete: (id: string) => void
}

export default function Column({ id, label, tasks, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id })
  const styles = COLUMN_STYLES[id]

  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* Column header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
          <h2 className="text-sm font-semibold text-gray-700">{label}</h2>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles.count}`}>
          {tasks.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 min-h-[200px] rounded-xl p-2 transition-colors ${
          isOver ? 'bg-blue-50 ring-2 ring-blue-200' : 'bg-gray-50'
        }`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onDelete={onDelete} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-gray-300">No tasks</p>
          </div>
        )}
      </div>
    </div>
  )
}