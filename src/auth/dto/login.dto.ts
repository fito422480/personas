import { IsOptional, IsString, MaxLength } from "class-validator";

export class LoginDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  sub?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
