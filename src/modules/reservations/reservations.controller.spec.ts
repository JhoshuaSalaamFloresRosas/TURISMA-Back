import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { StatusReserv } from '@prisma/client'; // Ajusta el import según tu estructura

describe('ReservasController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  const mockReservationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    getTimeUntilExcursion: jest.fn(),
    cancelReservation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: mockReservationsService,
        },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
  });

  it('debería crear una reservación', async () => {
    const createReservationDto: CreateReservationDto = { seats: ['1', '2', '3'], confirm: true };
    const userId = 1;
    const excursionId = 1;
    const result = { message: 'Reservación creada exitosamente.' };

    jest.spyOn(service, 'create').mockResolvedValue(result);

    expect(await controller.create(excursionId.toString(), { user: { userId } }, createReservationDto)).toBe(result);
  });

  it('debería obtener todas las reservaciones del usuario', async () => {
    const userId = 1;
    const reservations = [
      { id: 1, userId, excursionId: 1, date: new Date(), statusReserv: StatusReserv.COMPLETE },
      // Añadir más ejemplos si es necesario
    ];

    jest.spyOn(service, 'findAll').mockResolvedValue(reservations);

    expect(await controller.findAll({ user: { userId } })).toBe(reservations);
  });

  it('debería obtener una reservación específica', async () => {
    const id = 1;
    const reservation = { id, seats: [], excursionId: 1, userId: 1, date: new Date(), statusReserv: StatusReserv.COMPLETE };

    jest.spyOn(service, 'findOne').mockResolvedValue(reservation);

    expect(await controller.findOne(id.toString())).toBe(reservation);
  });

  it('debería obtener el tiempo hasta la excursión', async () => {
    const id = 1;
    const timeUntilExcursion = { daysUntilExcursion: 10, canCancel: true };

    jest.spyOn(service, 'getTimeUntilExcursion').mockResolvedValue(timeUntilExcursion);

    expect(await controller.getTimeUntilExcursion(id.toString())).toBe(timeUntilExcursion);
  });

  it('debería cancelar una reservación', async () => {
    const id = 1;
    const email = 'test@example.com';
    const result = { message: 'Reservación cancelada exitosamente.' };

    jest.spyOn(service, 'cancelReservation').mockResolvedValue(result);

    expect(await controller.cancelReservation(id.toString(), email)).toBe(result);
  });
});
