import { Query, Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
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
    const { userId } = req.user;
    return await this.filesService.getPresignedUrl(getPresignedUrlDto, userId);
  }
}
