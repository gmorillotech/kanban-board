# TaskFlow — Kanban Task Board

A beautiful, fully-featured Kanban-style task management board built with React, TypeScript, and Supabase. Inspired by Linear and Notion.

🔗 **Live Demo:** [kanban-board-one-green.vercel.app](https://kanban-board-one-green.vercel.app)

![TaskFlow Board](https://via.placeholder.com/900x500/f8f7f4/6366f1?text=TaskFlow+Kanban+Board)

---

## Features

- **Drag & Drop** — Move tasks between columns with smooth drag-and-drop interactions
- **Guest Sessions** — Anonymous auth via Supabase, no sign-up required
- **Task Management** — Create, edit, and delete tasks with title, description, priority, and due date
- **Task Comments** — Threaded comments on each task with timestamps
- **Labels / Tags** — Custom color labels with board-level filtering
- **Due Date Indicators** — Visual overdue warnings on task cards
- **Search & Filtering** — Filter tasks by title, priority, and label simultaneously
- **Board Stats** — Live summary of total, completed, and overdue tasks
- **Polished Design** — Clean sidebar layout inspired by Linear and Notion
- **Fully Persistent** — All data saved to Supabase with Row Level Security

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Drag & Drop | @dnd-kit |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Anonymous Auth |
| Hosting | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gmorillotech/kanban-board.git
   cd kanban-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the project root:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   You can find these in your Supabase project under **Settings → API**.

4. **Set up the database**

   Run the following SQL in your Supabase **SQL Editor**:

   ```sql
   -- Tasks
   CREATE TABLE tasks (
     id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title       TEXT NOT NULL,
     description TEXT,
     status      TEXT NOT NULL DEFAULT 'todo'
                 CHECK (status IN ('todo','in_progress','in_review','done')),
     priority    TEXT NOT NULL DEFAULT 'medium'
                 CHECK (priority IN ('low','medium','high')),
     due_date    DATE,
     user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     created_at  TIMESTAMPTZ DEFAULT NOW()
   );

   -- Comments
   CREATE TABLE comments (
     id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     task_id    UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
     user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     content    TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Labels
   CREATE TABLE labels (
     id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name       TEXT NOT NULL,
     color      TEXT NOT NULL DEFAULT '#6366f1',
     user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Task Labels (junction)
   CREATE TABLE task_labels (
     task_id    UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
     label_id   UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
     PRIMARY KEY (task_id, label_id)
   );

   -- Enable RLS on all tables
   ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
   ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
   ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
   ALTER TABLE task_labels ENABLE ROW LEVEL SECURITY;

   -- RLS Policies
   CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can create own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view own comments" ON comments FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can create own comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view own labels" ON labels FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can create own labels" ON labels FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can delete own labels" ON labels FOR DELETE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view own task_labels" ON task_labels FOR SELECT
     USING (EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_id AND tasks.user_id = auth.uid()));
   CREATE POLICY "Users can create own task_labels" ON task_labels FOR INSERT
     WITH CHECK (EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_id AND tasks.user_id = auth.uid()));
   CREATE POLICY "Users can delete own task_labels" ON task_labels FOR DELETE
     USING (EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_id AND tasks.user_id = auth.uid()));
   ```

5. **Enable Anonymous Sign-in**

   In Supabase go to **Authentication → Sign In / Providers** and enable **Anonymous**.

6. **Start the dev server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
src/
├── components/
│   ├── Board.tsx           # Main board layout and state
│   ├── Column.tsx          # Individual Kanban column
│   ├── TaskCard.tsx        # Draggable task card
│   ├── CreateTaskModal.tsx # New task form modal
│   ├── TaskDetailPanel.tsx # Task detail + comments side panel
│   └── LabelManager.tsx   # Label creation and assignment
├── hooks/
│   ├── useTasks.ts         # Task CRUD operations
│   ├── useComments.ts      # Comment CRUD operations
│   └── useLabels.ts        # Label CRUD operations
├── lib/
│   ├── supabase.ts         # Supabase client
│   └── auth.ts             # Anonymous auth helper
├── types/
│   └── index.ts            # TypeScript types
├── App.tsx                 # Root component with sidebar
└── main.tsx                # Entry point
```

---

## Deployment

The app is deployed on Vercel with automatic deployments on every push to `main`.

To deploy your own instance:
1. Push the repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables
4. Deploy

---

## License

MIT
