import { IsString } from 'class-validator';

export class CreateFileDto {
  @IsString()
  name: string;

  @IsString()
  key: string;

  @IsString()
  type: string;

  @IsString()
  url: string;
}
