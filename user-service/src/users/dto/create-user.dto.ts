import { IsString, IsEmail, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
    minLength: 1,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'URL to the user avatar image',
    example: 'https://i.pravatar.cc/300',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'The current status of the user',
    enum: ['active', 'inactive', 'pending'],
    default: 'active',
    example: 'active',
  })
  @IsOptional()
  @IsIn(['active', 'inactive', 'pending'])
  status?: string;

  @ApiPropertyOptional({
    description: 'The role assigned to the user',
    example: 'user',
    default: 'user',
  })
  @IsOptional()
  @IsString()
  role?: string;
}
