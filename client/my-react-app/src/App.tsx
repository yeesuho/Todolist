import { useEffect, useState, useRef } from 'react';
import { fetchTodos, createTodo, updateTodo, deleteTodo, deleteAllTodos } from './api';
import './App.css';
import { GlobalStyle } from './GlobalStyle';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  priority: number;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const fetchedTodos = await fetchTodos();
        const todosWithDate = fetchedTodos.map((todo: any) => ({
          ...todo,
          createdAt: todo.createdAt || new Date().toISOString(),
          priority: todo.priority ?? 0
        }));
        setTodos(todosWithDate);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    loadTodos();

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      try {
        const now = new Date().toISOString(); // 지금 시간
        const newTodoData = await createTodo(newTodo);


        const newTodoWithDate = {
          ...newTodoData,
          createdAt: newTodoData.createdAt || now,
          priority: newTodoData.priority ?? 0,
        };

        setTodos((prevTodos) => [...prevTodos, newTodoWithDate]);
        setNewTodo('');
        inputRef.current?.focus();
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };


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

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('정말 전체 삭제하시겠습니까?')) return;
    try {
      await deleteAllTodos();
      setTodos([]);
    } catch (error) {
      console.error('전체 삭제 실패:', error);
    }
  };

  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');


  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const handleEditStart = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingText(todo.title);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleEditSave = async (todo: Todo) => {
    if (editingText.trim() && editingText !== todo.title) {
      try {
        await updateTodo(todo.id, todo.completed, editingText); // 제목 업데이트 API 필요
        setTodos((prev) =>
          prev.map((t) =>
            t.id === todo.id ? { ...t, title: editingText } : t
          )
        );
      } catch (err) {
        console.error('수정 실패:', err);
      }
    }
    handleEditCancel();
  };

  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'latest' ? 'oldest' : 'latest'));
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === 'completed') return todo.completed;
      if (filter === 'incomplete') return !todo.completed;
      return true;
    })
    .sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
  
      // 같은 우선순위일 때 날짜 기준 정렬
      if (sortOrder === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

    const handlePriorityChange = (id: number, diff: number) => {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id
            ? { ...todo, priority: todo.priority + diff }
            : todo
        )
      );
    };


  return (
    <div className={`App ${isDarkMode ? 'dark' : 'light'}`}>
      <GlobalStyle />
      <h1>To Do List</h1>
      <div>
      
        <input
          ref={inputRef}
          className='input_box'
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="내용을 입력해주세요."
          onKeyUp={(e) => {
            if (e.key === 'Enter') handleAddTodo();
          }}
        />
        <button onClick={handleAddTodo} className='add_btn'>추가</button>
      </div>
      <div className="todo_box">
        <button className="arryabutton" onClick={toggleSortOrder}>
          {sortOrder === 'latest' ? '최신순' : '과거순'}
        </button>
        <button
          className={`arryabuttons ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          전체
        </button>
        <button
          className={`arryabuttons ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          완료
        </button>
        <button
          className={`arryabuttons ${filter === 'incomplete' ? 'active' : ''}`}
          onClick={() => setFilter('incomplete')}
        >
          미완료
        </button>
        <button className="arryabutton" onClick={handleDeleteAll}>전체삭제</button>
        <ul>
          {filteredTodos.map((todo) => (
            <li key={todo.id}>
              <div className='text_box'>
              
              
                {editingId === todo.id ? (
                  <input
                    className='input_box'
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() => handleEditCancel()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleEditSave(todo);
                      if (e.key === 'Escape') handleEditCancel();
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    style={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? '#999' : '#000',
                      cursor: 'pointer'
                    }}
                    onDoubleClick={() => handleEditStart(todo)}
                  >
                    {todo.title}
                  </span>
                )}
                <button onClick={() => handleDeleteTodo(todo.id)}>삭제</button>
                <input
                  className='complete_box'
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleCompleted(todo.id, todo.completed)}
                />
                <button className='priority_button priority_button_right' onClick={() => handlePriorityChange(todo.id, +1)}>+</button>
                <button className='priority_button' onClick={() => handlePriorityChange(todo.id, -1)}>-</button>
                <span className='priority_display'>우선순위: {todo.priority}</span>
                
              </div>
            </li>
          ))}
        </ul>
      </div>
      <ToggleButton toggleTheme={toggleTheme} />
    </div>
  );
}

function ToggleButton({ toggleTheme }: { toggleTheme: () => void }) {
  return (
    <button className='ToggleBtn' onClick={toggleTheme}>
      테마 전환
    </button>
  );
}

export default App;