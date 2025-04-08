import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Post()
  create(@Body('title') title: string): Promise<Todo> {
    return this.todoService.create(title);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body('completed') completed: boolean): Promise<Todo> {
    return this.todoService.update(id, completed);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.todoService.delete(id);
  }

  @Delete()
  deleteAllTodos() {
    return this.todoService.deleteAll();
  }
}
