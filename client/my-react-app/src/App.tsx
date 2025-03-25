import React, { useEffect, useState } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api';
import './App.css'

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  // To-Do 리스트 불러오기
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const fetchedTodos = await fetchTodos();
        setTodos(fetchedTodos);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    loadTodos();
  }, []);

  // 새로운 To-Do 추가하기
  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      try {
        const newTodoData = await createTodo(newTodo);
        setTodos((prevTodos) => [...prevTodos, newTodoData]);
        setNewTodo('');
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  // To-Do 완료 상태 업데이트
  const handleToggleCompleted = async (id: number, completed: boolean) => {
    try {
      await updateTodo(id, !completed);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // To-Do 삭제하기
  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className='App'>
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="입력해주세요."
        />
        <button onClick={handleAddTodo}>추가</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => handleToggleCompleted(todo.id, todo.completed)}>
              {todo.completed ? '취소' : '완료'}
            </button>
            <button onClick={() => handleDeleteTodo(todo.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
