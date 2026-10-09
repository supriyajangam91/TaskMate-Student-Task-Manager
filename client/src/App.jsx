
import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000/api/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [task, setTask] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Could not load tasks')
        return res.json()
      })
      .then(data => setTasks(data))
      .catch(() => setError('Could not connect to the server.'))
  }, [])

  async function addTask(e) {
    e.preventDefault()
    if (!task.trim()) return

    try {
      setError('')
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.trim() })
      })

      if (!res.ok) throw new Error('Could not add task')

      const newTask = await res.json()
      setTasks(previous => [...previous, newTask])
      setTask('')
    } catch {
      setError('Could not add task. Check that the server is running.')
    }
  }

  async function toggleTask(id, completed) {
    try {
      setError('')
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      })

      if (!res.ok) throw new Error('Could not update task')

      const updatedTask = await res.json()
      setTasks(previous =>
        previous.map(item => item.id === id ? updatedTask : item)
      )
    } catch {
      setError('Could not update task.')
    }
  }

  async function deleteTask(id) {
    try {
      setError('')
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Could not delete task')

      setTasks(previous => previous.filter(item => item.id !== id))
    } catch {
      setError('Could not delete task.')
    }
  }

  const completed = tasks.filter(item => item.completed).length

  return (
    <main className="app">
      <header className="header">
        <div className="brand">Task<span>Mate</span></div>
        <span className="tag">STUDENT EDITION</span>
      </header>

      <section className="welcome">
        <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
        <h1>Make today <span>count.</span></h1>
        <p className="subtitle">
          Organise your work, track your progress, and get things done.
        </p>
      </section>

      <section className="stats">
        <div className="stat-card">
          <p>Total Tasks</p>
          <h2>{tasks.length}</h2>
        </div>
        <div className="stat-card">
          <p>Completed</p>
          <h2>{completed}</h2>
        </div>
        <div className="stat-card">
          <p>Remaining</p>
          <h2>{tasks.length - completed}</h2>
        </div>
      </section>

      <section className="task-panel">
        <h2>My Tasks</h2>
        <p className="panel-subtitle">A little progress every day.</p>

        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            placeholder="What do you need to do?"
            value={task}
            onChange={e => setTask(e.target.value)}
          />
          <button type="submit">+ Add Task</button>
        </form>

        {error && <p role="alert">{error}</p>}

        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">✓</div>
              <h3>Your space is clear!</h3>
              <p>Add your first task to get started.</p>
            </div>
          ) : (
            tasks.map(item => (
              <div className="task-item" key={item.id}>
                <label className="task-label">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleTask(item.id, item.completed)}
                  />
                  <span className={item.completed ? 'done' : ''}>
                    {item.title}
                  </span>
                </label>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => deleteTask(item.id)}
                  aria-label={`Delete ${item.title}`}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <footer>Built with React · TaskMate © 2026</footer>
    </main>
  )
}

export default App