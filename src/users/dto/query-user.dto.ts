import { IsOptional, IsEnum, IsInt, IsString, IsBoolean, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { UserRole } from '../schemas/user.schema';

export class QueryUserDto {
  @ApiPropertyOptional({ enum: UserRole, description: 'Filter by role' })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Filter by active status', example: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Sort field (e.g. createdAt, name)', example: 'createdAt' })
  @IsString()
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({ description: 'Page number', example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', example: 10, minimum: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
