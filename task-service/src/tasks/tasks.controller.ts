import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task', description: 'Creates a new task with the provided information' })
  @ApiResponse({ status: 201, description: 'The task has been successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks', description: 'Retrieves all tasks, optionally filtered by userId' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter tasks by user ID' })
  @ApiResponse({ status: 200, description: 'Returns an array of tasks' })
  findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.tasksService.findByUserId(userId);
    }
    return this.tasksService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get task statistics', description: 'Retrieves statistics about tasks (counts by status, priority, etc.)' })
  @ApiResponse({ status: 200, description: 'Returns task statistics' })
  getStats() {
    return this.tasksService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID', description: 'Retrieves a specific task by its unique identifier' })
  @ApiParam({ name: 'id', description: 'The unique identifier of the task' })
  @ApiResponse({ status: 200, description: 'Returns the requested task' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task', description: 'Updates an existing task with partial data' })
  @ApiParam({ name: 'id', description: 'The unique identifier of the task to update' })
  @ApiResponse({ status: 200, description: 'The task has been successfully updated' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task', description: 'Removes a task from the system' })
  @ApiParam({ name: 'id', description: 'The unique identifier of the task to delete' })
  @ApiResponse({ status: 200, description: 'The task has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
