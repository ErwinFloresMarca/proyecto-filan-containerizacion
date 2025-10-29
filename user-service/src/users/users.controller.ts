import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user', description: 'Creates a new user with the provided information' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed or email already exists' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Retrieves all users from the database' })
  @ApiResponse({ status: 200, description: 'Returns an array of users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user statistics', description: 'Retrieves statistics about users (total count, counts by status, etc.)' })
  @ApiResponse({ status: 200, description: 'Returns user statistics' })
  getStats() {
    return this.usersService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID', description: 'Retrieves a specific user by their unique identifier' })
  @ApiParam({ name: 'id', description: 'The unique identifier of the user' })
  @ApiResponse({ status: 200, description: 'Returns the requested user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user', description: 'Updates an existing user with partial data' })
  @ApiParam({ name: 'id', description: 'The unique identifier of the user to update' })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user', description: 'Removes a user from the system' })
  @ApiParam({ name: 'id', description: 'The unique identifier of the user to delete' })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
