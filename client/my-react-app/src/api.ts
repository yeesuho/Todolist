import axios from 'axios';

const API_URL = 'http://localhost:3000/todos'; // NestJS API URL

// 모든 To-Do 리스트 가져오기
export const fetchTodos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

// To-Do 추가하기
export const createTodo = async (title: string) => {
  try {
    const response = await axios.post(API_URL, { title });
    return response.data;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

// To-Do 업데이트하기
export const updateTodo = async (id: number, completed: boolean) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, { completed });
    return response.data;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

// To-Do 삭제하기
export const deleteTodo = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};
