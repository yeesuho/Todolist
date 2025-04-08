<img width="1413" alt="스크린샷 2025-04-08 오후 1 33 53" src="https://github.com/user-attachments/assets/4a188cdb-3186-463f-b819-ba549d55064a" />

### 상태 정의
```tsx
const [todos, setTodos] = useState<Todo[]>([]);
const [newTodo, setNewTodo] = useState<string>('');
const [isDarkMode, setIsDarkMode] = useState(false);
const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
const [editingId, setEditingId] = useState<number | null>(null);
const [editingText, setEditingText] = useState<string>('');
const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
```

- ``todos:`` 현재 할 일 목록
- ``newTodo:`` 새로운 할 일 입력 값
- ``isDarkMode:`` 다크모드 여부
- ``filter:`` 전체 / 완료 / 미완료 필터 상태
- ``editingId:`` 수정 중인 항목 ID
- ``editingText:`` 수정 중인 텍스트
- ``sortOrder:`` 최신순 / 과거순 정렬 방식

### 초기 데이터 가져오기 (useEffect)
```tsx
useEffect(() => {
  const loadTodos = async () => {
    const fetchedTodos = await fetchTodos();
    const todosWithDate = fetchedTodos.map((todo: any) => ({
      ...todo,
      createdAt: todo.createdAt || new Date().toISOString(),
      priority: todo.priority ?? 0
    }));
    setTodos(todosWithDate);
  };
  loadTodos();

  inputRef.current?.focus();
}, []);
```
- 서버에서 할 일 목록을 불러오기
- 페이지 로드시 input에 focus

### 할 일 추가
```tsx
const handleAddTodo = async () => {
  if (newTodo.trim()) {
    const newTodoData = await createTodo(newTodo);
    const now = new Date().toISOString();
    const newTodoWithDate = {
      ...newTodoData,
      createdAt: newTodoData.createdAt || now,
      priority: newTodoData.priority ?? 0,
    };
    setTodos([...todos, newTodoWithDate]);
    setNewTodo('');
    inputRef.current?.focus();
  }
};
```
- newTodo 값을 서버에 저장
- createdAt, priority 세팅해서 todos에 추가


### 체크박스로 완료 상태 토글
```tsx
const handleToggleCompleted = async (id, completed) => {
  await updateTodo(id, !completed);
  setTodos(todos.map(todo =>
    todo.id === id ? { ...todo, completed: !completed } : todo
  ));
};
```
- 완료 상태를 서버와 UI에서 동기화

### 삭제 기능
단일 삭제
```tsx
const handleDeleteTodo = async (id) => {
  await deleteTodo(id);
  setTodos(todos.filter(todo => todo.id !== id));
};
```

전체 삭제
```tsx
const handleDeleteAll = async () => {
  if (!window.confirm('정말 전체 삭제하시겠습니까?')) return;
  await deleteAllTodos();
  setTodos([]);
};
```

### 다크모드 토글
```tsx
const toggleTheme = () => setIsDarkMode(prev => !prev);
```
- 버튼 클릭 시 다크모드 / 라이트모드 전환

### 필터링 기능
```tsx
setFilter('all' | 'completed' | 'incomplete')
```
- 선택된 필터에 따라 완료/미완료 항목 보여줌


### 수정 기능(더블클릭 -> 인풋 -> Enter 저장)
```tsx
const handleEditStart = (todo) => {
  setEditingId(todo.id);
  setEditingText(todo.title);
};

const handleEditSave = async (todo) => {
  await updateTodo(todo.id, todo.completed, editingText);
  setTodos(...수정된 todos);
  handleEditCancel();
};
```

### 정렬기능 (최신순 / 과거순)
```tsx
const toggleSortOrder = () => {
  setSortOrder(prev => prev === 'latest' ? 'oldest' : 'latest');
};
```
- 최신순이면 최신이 위에, 과거순이면 오래된 게 위에
- 백엔드에서 처리하는게 아니고 프론트에서 처리해서 리로드 했을 때 저장은 안됨


### 우선순위 조절
```tsx
const handlePriorityChange = (id, diff) => {
  setTodos(todos.map(todo =>
    todo.id === id ? { ...todo, priority: todo.priority + diff } : todo
  ));
};
```
- ``+`` 버튼으로 우선순위 증가

- ``-`` 버튼으로 감소

- 정렬 시 우선순위가 먼저 고려됨

### GlobalStyle 파일에 styled-components로 폰트 스타일 적용
```tsx
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Boldonse&family=Gugi&family=Nanum+Myeongjo&family=Noto+Sans+KR:wght@100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Noto+Serif+Hentaigana:wght@200..900&display=swap');

  * {
    font-family: "Black Han Sans", sans-serif;
    font-weight: 400;
    font-style: normal;
  }
`;
```
- 구글폰트에서 Black Han Sans 폰트 사용

## api.ts

### 모든 할 일 가져오기
```ts
export const fetchTodos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
```
- ``GET /todos`` 요청
- 할 일 목록을 배열로 받아옴

### 할 일 추가
```ts
export const createTodo = async (title: string) => {
  const response = await axios.post(API_URL, { title });
  return response.data;
};
```
- ``POST /todos`` 요청
- ``{ title: "내용" }``을 서버로 보냄
- 새로 추가된 할 일 데이터를 받아서 반환

### 할 일 수정 (완료 여부 or 제목)
```ts
export const updateTodo = async (id: number, completed: boolean, title?: string) => {
  const response = await axios.put(`${API_URL}/${id}`, {
    completed,
    ...(title !== undefined && { title })
  });
  return response.data;
};

```
- ``PUT /todos/:id`` 요청
- 완료 여부(completed)는 무조건 포함
- title은 있을 때만 포함됨 (optional)

### 할 일 개인 삭제
```ts
export const deleteTodo = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
```
- ``DELETE /todos/:id`` 요
- 해당 ID의 할 일 삭제


### 모든 할 일 삭제
```ts
export const deleteAllTodos = async () => {
  await axios.delete(API_URL);
};
```
- ``DELETE /todos`` 요청

|함수 이름|기능|요청 방식|요청URL|
|:-:|:-:|:-:|:-:|
``fetchTodos``|	전체 할 일 가져오기|GET|``/todos``
``createTodo``|	새 할 일 추가|POST|``/todos``
``updateTodo``|	할 일 수정 (체크, 제목 변경 등)|PUT|``/todos/:id``
``deleteTodo``|하나 삭제|DELETE|	``/todos/:id``
``deleteAllTodos``|	전체 삭제|DELETE|``/todos``

## 컴포넌트 구조
- ``App.tsx:`` 전체 앱 구성

- ``ToggleButton:`` 테마 전환 버튼 컴포넌트

- ``api.ts:``  서버 요청 관련 함수들 (fetchTodos, createTodo, 등)


