import { Controller, Post, UploadedFile, UseInterceptors, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../../common/services/upload.service';
import { PrismaService } from '../../prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';


@Controller('photos')
export class PhotosController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserPhoto(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const userId = req.user.userId;
    const result = await this.uploadService.uploadImage(file);
    await this.prisma.user.update({
      where: { id: userId },
      data: { userPhoto: result.secure_url },
    });
    return { message: 'La foto de usuario se ha cargado con éxito'};
  }
}