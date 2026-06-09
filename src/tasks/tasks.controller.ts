import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { QueryTaskDto } from './dto/query-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'List of tasks' })
  findAll(@Query() query: QueryTaskDto) {
    return this.tasksService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get task statistics' })
  @ApiResponse({ status: 200, description: 'Task statistics' })
  getStats() {
    return this.tasksService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Task found' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Task updated' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update task status' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Task status updated' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  updateStatus(@Param('id') id: string, @Body() updateTaskStatusDto: UpdateTaskStatusDto) {
    return this.tasksService.updateStatus(id, updateTaskStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  @ApiResponse({ status: 204, description: 'Task deleted' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
