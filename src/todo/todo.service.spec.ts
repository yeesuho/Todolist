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

  async findAll(): Promise<Todo[]> {
    return await this.todoRepository.find();
  }

  async create(title: string): Promise<Todo> {
    const todo = this.todoRepository.create({ title, completed: false });
    return await this.todoRepository.save(todo);
  }

  async update(id: number, completed: boolean): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new Error('Todo not found');
    }
    todo.completed = completed;
    return await this.todoRepository.save(todo);
  }

  async delete(id: number): Promise<void> {
    await this.todoRepository.delete(id);
  }
}
