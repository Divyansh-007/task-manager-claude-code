import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ description: 'Full name of the user' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ description: 'Unique email address' })
  @Prop({ required: true, trim: true, unique: true, lowercase: true })
  email: string;

  @ApiProperty({ enum: UserRole, default: UserRole.MEMBER })
  @Prop({ type: String, enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @ApiProperty({ description: 'Whether the user account is active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Short bio or description' })
  @Prop({ trim: true, default: '' })
  bio: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for common queries
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 });
