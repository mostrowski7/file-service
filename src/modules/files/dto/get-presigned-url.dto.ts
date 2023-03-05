import { IsString } from 'class-validator';

export class GetPresignedUrlDto {
  @IsString()
  filetype: string;
}
