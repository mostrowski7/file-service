import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';
import * as mime from 'mime-types';
import { GetPresignedUrlDto } from './dto/get-presigned-url.dto';
import { CreateFileDto } from './dto/create-file.dto';
import { FilesRepository } from './files.repository';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly filesRepository: FilesRepository,
  ) {}

  async getPresignedUrl(
    { filetype }: GetPresignedUrlDto,
    userId: string,
  ): Promise<{ url: string; key: string }> {
    const fileExtension = this.getFileExtension(filetype);

    try {
      const client = new S3Client({
        credentials: {
          accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
          secretAccessKey: this.configService.get<string>(
            'AWS_SECRET_ACCESS_KEY',
          ),
        },
        region: this.configService.get<string>('AWS_REGION'),
      });

      const key = `${userId}/${uuid()}.${fileExtension}`;

      const command = new PutObjectCommand({
        Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
        Key: key,
        ContentType: filetype,
      });

      const url = await getSignedUrl(client, command, {
        expiresIn: this.configService.get<number>(
          'AWS_PRESIGNED_URL_EXPIRATION_TIME',
        ),
      });

      return { url, key };
    } catch (e) {
      throw new InternalServerErrorException('Cannot generate presigned url');
    }
  }

  getFileExtension(filetype: string): string {
    const fileExtension = mime.extension(filetype);
    if (!fileExtension) throw new BadRequestException('Missing file extension');

    return fileExtension;
  }

  async create(createFileDto: CreateFileDto, user: User): Promise<void> {
    await this.filesRepository.createWithAssignedOwner(createFileDto, user);
  }
}
