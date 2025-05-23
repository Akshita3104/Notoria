import React, { useState, useEffect } from 'react';
import './todo.css';

const TodoPage = () => {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : {
      todo: [],
      inProgress: [],
      done: []
    };
  });
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    const todo = {
      id: Date.now(),
      text: newTodo
    };
    setTodos({
      ...todos,
      todo: [...todos.todo, todo]
    });
    setNewTodo('');
  };

  const onDragStart = (e, id, sourceColumn) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, sourceColumn }));
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, targetColumn) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const { id, sourceColumn } = data;
    
    if (sourceColumn === targetColumn) return;
    
    const item = todos[sourceColumn].find(todo => todo.id === id);
    if (!item) return;
    
    const newSourceColumn = todos[sourceColumn].filter(todo => todo.id !== id);
    const newTargetColumn = [...todos[targetColumn], item];
    
    setTodos({
      ...todos,
      [sourceColumn]: newSourceColumn,
      [targetColumn]: newTargetColumn
    });
  };

  const deleteTodo = (id, column) => {
    setTodos({
      ...todos,
      [column]: todos[column].filter(todo => todo.id !== id)
    });
  };

  return (
    <div className="todo-page">
      <h1>Tasks</h1> 
      <div className="todo-input">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      
      <div className="kanban-board">
        <div 
          className="kanban-column"
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, 'todo')}
        >
          <h3>To Do</h3>
          {todos.todo.map(todo => (
            <div 
              key={todo.id} 
              className="kanban-item"
              draggable
              onDragStart={(e) => onDragStart(e, todo.id, 'todo')}
            >
              {todo.text}
              <button onClick={() => deleteTodo(todo.id, 'todo')}>×</button>
            </div>
          ))}
        </div>
        
        <div 
          className="kanban-column"
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, 'inProgress')}
        >
          <h3>In Progress</h3>
          {todos.inProgress.map(todo => (
            <div 
              key={todo.id} 
              className="kanban-item"
              draggable
              onDragStart={(e) => onDragStart(e, todo.id, 'inProgress')}
            >
              {todo.text}
              <button onClick={() => deleteTodo(todo.id, 'inProgress')}>×</button>
            </div>
          ))}
        </div>
        
        <div 
          className="kanban-column"
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, 'done')}
        >
          <h3>Done</h3>
          {todos.done.map(todo => (
            <div 
              key={todo.id} 
              className="kanban-item"
              draggable
              onDragStart={(e) => onDragStart(e, todo.id, 'done')}
            >
              {todo.text}
              <button onClick={() => deleteTodo(todo.id, 'done')}>×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoPage;
