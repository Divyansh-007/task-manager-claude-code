import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({ description: 'Full name of the user', example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Unique email address', example: 'jane@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  email: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.MEMBER })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Whether the account is active', example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Short bio', example: 'Backend engineer focused on APIs' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;
}
