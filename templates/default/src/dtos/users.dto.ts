import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

export class PasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(9, { message: 'Password must be at least 9 characters long.' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long.' })
  public password!: string;
}

export class CreateUserDto extends PasswordDto {
  @IsEmail({}, { message: 'Invalid email format.' })
  public email!: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(9, { message: 'Password must be at least 9 characters long.' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long.' })
  public password?: string;
}
