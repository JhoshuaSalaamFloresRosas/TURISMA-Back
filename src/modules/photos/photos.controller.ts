import { Controller, Post, UploadedFile, UseInterceptors, UseGuards, Request, Param } from '@nestjs/common';
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

  @Post(':id/upload')  // Esta es la ruta para subir la foto de una excursión con el ID como parámetro
  @UseGuards(JwtAuthGuard)  // Protege la ruta con el guard de autenticación JWT
  @UseInterceptors(FileInterceptor('file'))  // Interceptor para manejar archivos (subida de imágenes)
  async uploadExcursionPhoto(
    @Param('id') id: string,  // Obtenemos el ID de la excursión desde los parámetros
    @UploadedFile() file: Express.Multer.File,  // Recibimos el archivo subido
    @Request() req,  // Obtenemos la solicitud para acceder a la información del usuario
  ) {
    // Verificamos si el archivo fue enviado correctamente
    if (!file) {
      throw new Error('No se ha enviado ningún archivo.');
    }

    // Subimos la imagen a Cloudinary usando el servicio
    const result = await this.uploadService.uploadImage(file);

    // Verificamos si la excursión existe en la base de datos
    const excursion = await this.prisma.excursion.findUnique({ where: { id: +id } });
    if (!excursion) {
      throw new Error('La excursión no existe');
    }

    // Creamos una nueva entrada en la tabla de fotos, asociando la foto con la excursión
    await this.prisma.photo.create({
      data: {
        excursionId: +id,  // Asociamos la foto con la excursión mediante el ID
        imageUrl: result.secure_url,  // Guardamos la URL de la imagen subida en Cloudinary
      },
    });

    return { message: 'La foto de la excursión se ha cargado con éxito' };  // Mensaje de éxito
  }
}