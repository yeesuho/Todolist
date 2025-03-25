import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;  // id는 자동 생성되는 Primary key로 설정해야 합니다

  @Column()
  title: string;

  @Column({ default: false })
  completed: boolean;
}