const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

let todos = [];
let nextId = 1;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Todo text is required' });
  }
  const todo = {
    id: nextId++,
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  res.status(201).json(todo);
});

app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  todo.completed = !todo.completed;
  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  todos.splice(index, 1);
  res.json({ message: 'Todo deleted successfully' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', todos: todos.length });
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('Todo app running on port ' + PORT);
  });
}
