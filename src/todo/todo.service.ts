import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  // 모든 Todo 가져오기
  async findAll(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  // Todo 생성
  async create(title: string): Promise<Todo> {
    const newTodo = this.todoRepository.create({ title, completed: false });
    return this.todoRepository.save(newTodo);
  }

  // Todo 업데이트
  async update(id: number, completed: boolean): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (todo) {
      todo.completed = completed;
      return this.todoRepository.save(todo);
    }
    throw new Error('Todo not found');
  }

  // Todo 삭제
  async delete(id: number): Promise<void> {
    await this.todoRepository.delete(id);
  }
}
