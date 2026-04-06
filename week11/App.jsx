import { useState } from "react";


const initialTodos = [
  { id: 1, task: "Complete Lab 11", completed: false },
  { id: 2, task: "Review JSX Events and State", completed: false },
];

export default function App() {
 
  const [todos, setTodos] = useState(initialTodos);

 
  const [newTask, setNewTask] = useState("");

 
  function handleComplete(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  
  function handleAddTask(e) {
    e.preventDefault();
    if (newTask.trim() === "") return;
    const newTodo = {
      id: Date.now(), 
      task: newTask.trim(),
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setNewTask(""); 
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "400px", margin: "40px auto", padding: "0 20px" }}>
      <h1>To Do List</h1>

      
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "8px",
            }}
          >
            {/* X button to mark complete */}
            <button
              onClick={() => handleComplete(todo.id)}
              style={{
                cursor: "pointer",
                background: "none",
                border: "1px solid #aaa",
                borderRadius: "4px",
                padding: "2px 7px",
                fontSize: "14px",
              }}
            >
              X
            </button>

            {/* Task text — crossed out with CSS if completed */}
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "#888" : "#000",
              }}
            >
              {todo.task}
            </span>
          </li>
        ))}
      </ul>

      
      <form onSubmit={handleAddTask} style={{ marginTop: "20px", display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          style={{
            flex: 1,
            padding: "6px 10px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "6px 14px",
            fontSize: "14px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Add
        </button>
      </form>
    </div>
  );
}
