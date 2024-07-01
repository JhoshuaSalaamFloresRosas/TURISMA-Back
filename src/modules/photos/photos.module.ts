import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { PrismaService } from 'src/prisma.service';
import { UploadService } from 'src/common/services/upload.service';
import { cloudinary } from 'src/common/services/cloudinary.config';

@Module({
  controllers: [PhotosController],
  providers: [PhotosService, PrismaService,
    UploadService,
    {
      provide: 'Cloudinary',
      useFactory: () => {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        return cloudinary;
      },
    },
  ],
})
export class PhotosModule {}
