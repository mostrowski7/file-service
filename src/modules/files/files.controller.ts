import {
  Controller,
  UseGuards,
  Query,
  Get,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFileDto } from './dto/create-file.dto';
import { GetPresignedUrlDto } from './dto/get-presigned-url.dto';
import { RequestWithUser } from './files.interface';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('presigned-url')
  async getPresignedUrl(
    @Req() req: RequestWithUser,
    @Query() getPresignedUrlDto: GetPresignedUrlDto,
  ) {
    const { id } = req.user;
    return await this.filesService.getPresignedUrl(getPresignedUrlDto, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createFileDto: CreateFileDto,
  ) {
    return await this.filesService.create(createFileDto, req.user);
  }
}
