import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Schema({ timestamps: true })
export class Task {
  @ApiProperty({ description: 'Task title' })
  @Prop({ required: true, trim: true })
  title: string;

  @ApiProperty({ description: 'Task description' })
  @Prop({ trim: true, default: '' })
  description: string;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.TODO })
  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @ApiProperty({ enum: TaskPriority, default: TaskPriority.MEDIUM })
  @Prop({ type: String, enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @ApiProperty({ description: 'Tags for categorization', type: [String] })
  @Prop({ type: [String], default: [] })
  tags: string[];

  @ApiProperty({ description: 'Due date' })
  @Prop()
  dueDate?: Date;

  @ApiProperty({ description: 'Assigned user' })
  @Prop({ trim: true })
  assignee?: string;
}

export type TaskDocument = Task & Document;
export const TaskSchema = SchemaFactory.createForClass(Task);

// Indexes for common queries
TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ assignee: 1 });
TaskSchema.index({ tags: 1 });
TaskSchema.index({ createdAt: -1 });
