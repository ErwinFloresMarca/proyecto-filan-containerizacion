import { IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Implement user authentication',
    minLength: 1,
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'The detailed description of the task',
    example: 'Add JWT authentication with refresh tokens',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'The current status of the task',
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
    example: 'pending',
  })
  @IsOptional()
  @IsIn(['pending', 'in-progress', 'completed'])
  status?: string;

  @ApiPropertyOptional({
    description: 'The priority level of the task',
    enum: ['low', 'medium', 'high'],
    default: 'medium',
    example: 'high',
  })
  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: string;

  @ApiPropertyOptional({
    description: 'The ID of the user assigned to this task',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
