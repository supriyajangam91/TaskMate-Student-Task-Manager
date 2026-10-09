
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

let tasks = [];
let nextId = 1;

// Test the server
app.get("/", (req, res) => {
  res.send("TaskMate server is running!");
});

// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// Add a new task
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      message: "Task title is required"
    });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Mark a task completed or incomplete
app.patch("/api/tasks/:id", (req, res) => {
  const task = tasks.find(
    item => item.id === Number(req.params.id)
  );

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  if (typeof req.body.completed === "boolean") {
    task.completed = req.body.completed;
  }

  res.json(task);
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = tasks.some(item => item.id === id);

  if (!exists) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  tasks = tasks.filter(item => item.id !== id);
  res.json({ message: "Task deleted successfully" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TaskMate server running on port ${PORT}`);
});