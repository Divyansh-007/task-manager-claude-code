import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { QueryTaskDto } from './dto/query-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    const task = new this.taskModel(createTaskDto);
    return task.save();
  }

  async findAll(query: QueryTaskDto): Promise<{
    data: TaskDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const filter: Record<string, any> = {};

    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    if (query.assignee) filter.assignee = query.assignee;
    if (query.tag) filter.tags = { $in: [query.tag] };

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.taskModel
        .find(filter)
        .sort(query.sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.taskModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskDocument> {
    const task = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true, runValidators: true })
      .exec();
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async updateStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto): Promise<TaskDocument> {
    const task = await this.taskModel
      .findByIdAndUpdate(id, { status: updateTaskStatusDto.status }, { new: true, runValidators: true })
      .exec();
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async getStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    overdue: number;
  }> {
    const [total, byStatus, byPriority, overdue] = await Promise.all([
      this.taskModel.countDocuments().exec(),
      this.taskModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.taskModel.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      this.taskModel.countDocuments({
        dueDate: { $lt: new Date() },
        status: { $ne: TaskStatus.DONE },
      } as any).exec(),
    ]);

    const statusMap: Record<string, number> = {};
    byStatus.forEach((s: { _id: string; count: number }) => {
      statusMap[s._id] = s.count;
    });

    const priorityMap: Record<string, number> = {};
    byPriority.forEach((p: { _id: string; count: number }) => {
      priorityMap[p._id] = p.count;
    });

    return { total, byStatus: statusMap, byPriority: priorityMap, overdue };
  }
}
