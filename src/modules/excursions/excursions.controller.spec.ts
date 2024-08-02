import { Test, TestingModule } from '@nestjs/testing';
import { ExcursionsController } from './excursions.controller';
import { ExcursionsService } from './excursions.service';
import { CreateExcursionDto } from './dto/create-excursion.dto';
import { UpdateExcursionDto } from './dto/update-excursion.dto';
import { UpdateExcursionStatusDto } from './dto/update-excursion-status.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

describe('ExcursionsController', () => {
  let controller: ExcursionsController;
  let service: ExcursionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExcursionsController],
      providers: [
        {
          provide: ExcursionsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            updateStatus: jest.fn(),
            findAllDetailed: jest.fn(),
            cancelExcursion: jest.fn(),
            toggleLike: jest.fn(),
          },
        },
        RolesGuard
      ],
    }).compile();

    controller = module.get<ExcursionsController>(ExcursionsController);
    service = module.get<ExcursionsService>(ExcursionsService);
  });

  // **************************************************************** Usuario
  describe('findAll', () => {
    it('debería devolver un array de excursiones', async () => {
      const result = [{ id: 1, name: 'Excursión A', departureDate: new Date(), price: 100, status: 'LISTED', likes: 5, photos: [{ imageUrl: 'url' }] }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });



  // **************************************************************** Administrador




  describe('updateStatus', () => {
    it('debería actualizar el estado de una excursión y devolver un mensaje', async () => {
      const dto: UpdateExcursionStatusDto = { status: 'FINISHED' };
      const result = { message: 'El estatus fue cambiado exitosamente' };
      jest.spyOn(service, 'updateStatus').mockResolvedValue(result);

      expect(await controller.updateStatus('1', dto)).toBe(result);
    });
  });


  

  describe('cancelExcursion', () => {
    it('debería cancelar una excursión y devolver un mensaje', async () => {
      const result = { message: 'La excursión ha sido cancelada exitosamente' };
      jest.spyOn(service, 'cancelExcursion').mockResolvedValue(result);

      expect(await controller.cancelExcursion('1')).toBe(result);
    });
  });

  describe('toggleLike', () => {
    it('debería agregar un like si no existe, o eliminarlo si ya existe', async () => {
      const result = { message: 'Like agregado' };
      jest.spyOn(service, 'toggleLike').mockResolvedValue(result);
      const req = { user: { userId: 1 } };

      expect(await controller.toggleLike('1', req)).toBe(result);
    });
  });
});
