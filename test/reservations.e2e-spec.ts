import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';

describe('ReservationsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtToken: string;
  let excursionid: number; 

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get(PrismaService);



  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Elimina las entradas de las tablas dependientes primero
    await prisma.payment.deleteMany({});
    await prisma.seat.deleteMany({});
    await prisma.reservation.deleteMany({}); 
    await prisma.excursion.deleteMany({});
    
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: process.env.TEST_USER, password: process.env.TEST_PASSWORD });
  
    jwtToken = response.body.access_token;
  
    const Excursion = await prisma.excursion.create({
      data: {
        name: "TEST EXCURSION",
        description: "Disfruta de un día relajante en una hermosa playa con actividades acuáticas.",
        departureDate: "2024-08-10T07:00:00.000Z",
        arrivalDate: "2024-08-10T19:00:00.000Z",
        price: 75.00,
        duration: "1 día",
        outPoint: "Punto de salida en el centro de la ciudad",
        status: "PENDING"
      },
    });
  
    excursionid = Excursion.id;
  });
  

  it('Crear una reservación por un usuario autenticado', async () => {
    

    return request(app.getHttpServer())
      .post(`/reservations/${excursionid}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ confirm: true, seats: ['A1', 'A2'] })
      .expect(201)
      .expect(({ body }) => {
        expect(body.message).toBe('Reservación creada exitosamente.');
      });
  });

  it('Crear una reservación sin token JWT', () => {
    return request(app.getHttpServer())
      .post('/reservations/1')
      .send({ confirm: true, seats: ['A1', 'A2'] })
      .expect(401);
  });

  it('Crear una reservación sin confirmación', async () => {


    return request(app.getHttpServer())
      .post(`/reservations/${excursionid}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ confirm: false, seats: ['A1', 'A2'] })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('Se requiere confirmacion');
      });
  });

  it('Reservación con asientos ya ocupados', async () => {


    // Create an existing reservation with seat A1
    const Data = {
        userId: 2,
        excursionId: excursionid,
        seats: {
          create: [{ seatNumber: 'A1' }],
        }
        }
        console.log(Data);
        

    await prisma.reservation.create({
      data: Data
      }
    );

    return request(app.getHttpServer())
      .post(`/reservations/${excursionid}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ confirm: true, seats: ['A1', 'A2'] })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('Uno o más asientos ya están reservados.');
      });
  });

  it('Acceso a reservaciones por un usuario autenticado', async () => {


    await prisma.reservation.create({
      data: {
        userId: 1,
        excursionId: excursionid,
        seats: {
          create: [{ seatNumber: 'A1' }, { seatNumber: 'A2' }],
        },
        payment: {
          create: {
            totalCost: 100,
            alreadyPay: 50,
            partialPay: true,
            status: true,
          },
        },
      },
    });

    return request(app.getHttpServer())
      .get('/reservations')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
        expect(body[0]).toHaveProperty('payment');
        expect(body[0]).toHaveProperty('seats');
      });
  });

  it('Un usuario autenticado no tiene reservaciones', () => {
    return request(app.getHttpServer())
      .get('/reservations')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(204)
      .expect(({ body }) => {
        expect(body.message).toBe('Sin reservaciones');
      });
  });

  it('Acceso a reservaciones sin token JWT', () => {
    return request(app.getHttpServer())
      .get('/reservations')
      .expect(401);
  });

  it('Reservación no existe', () => {
    return request(app.getHttpServer())
      .patch('/reservations/999/cancel')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ email: 'test@example.com' })
      .expect(404)
      .expect(({ body }) => {
        expect(body.message).toBe('Reservación no encontrada.');
      });
  });

  it('Cancelar una reservación por un usuario autenticado', async () => {

    const reservation = await prisma.reservation.create({
      data: {
        userId: 2,
        excursionId: excursionid,
        seats: {
          create: [{ seatNumber: 'A1' }, { seatNumber: 'A2' }],
        },
      },
    });

    return request(app.getHttpServer())
      .patch(`/reservations/${reservation.id}/cancel`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ email: 'test@example.com' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toBe('Reservación cancelada exitosamente.');
      });
  });

  it('Reservación fuera de tiempo para cancelar', async () => {
    const excursion = await prisma.excursion.create({
      data: {
        name: "TEST EXCURSION",
        description: "Disfruta de un día relajante en una hermosa playa con actividades acuáticas.",
        departureDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Less than 12 days
        arrivalDate: "2024-08-10T19:00:00.000Z",
        price: 75.00,
        duration: "1 día",
        outPoint: "Punto de salida en el centro de la ciudad",
        status: "PENDING"
        
      },
    });

    const reservation = await prisma.reservation.create({
      data: {
        userId: 2,
        excursionId: excursion.id,
        seats: {
          create: [{ seatNumber: 'A1' }, { seatNumber: 'A2' }],
        },
      },
    });

    return request(app.getHttpServer())
      .patch(`/reservations/${reservation.id}/cancel`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ email: 'salaamxdd@gmail.com' })
      .expect(401)
      .expect(({ body }) => {
        expect(body.message).toBe('No se puede cancelar reservación porque faltan menos de 12 días para la fecha de salida.');
      });
  });

  it('Correo recibido diferente al del usuario autenticado', async () => {

    const reservation = await prisma.reservation.create({
      data: {
        userId: 2,
        excursionId: excursionid,
        seats: {
          create: [{ seatNumber: 'A1' }, { seatNumber: 'A2' }],
        },
      },
    });

    return request(app.getHttpServer())
      .patch(`/reservations/${reservation.id}/cancel`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ email: 'different@example.com' })
      .expect(401)
      .expect(({ body }) => {
        expect(body.message).toBe('El correo electrónico no coincide con el del usuario.');
      });
  });

  it('Cancelar reservación sin token JWT', async () => {
    const excursion = await prisma.excursion.create({
        data: {
            name: "TEST EXCURSION",
            description: "Disfruta de un día relajante en una hermosa playa con actividades acuáticas.",
            departureDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            arrivalDate: "2024-08-10T19:00:00.000Z",
            price: 75.00,
            duration: "1 día",
            outPoint: "Punto de salida en el centro de la ciudad",
            status: "PENDING"
            },
    });

    const reservation = await prisma.reservation.create({
      data: {
        userId: 2,
        excursionId: excursion.id,
        seats: {
          create: [{ seatNumber: 'A1' }, { seatNumber: 'A2' }],
        },
      },
    });

    return request(app.getHttpServer())
      .patch(`/reservations/${reservation.id}/cancel`)
      .send({ email: 'test@example.com' })
      .expect(401);
  });

  it('Reservación no existe para acceso a reservación', () => {
    return request(app.getHttpServer())
      .get('/reservations/999')
      .expect(404)
      .expect(({ body }) => {
        expect(body.message).toBe('Reservación no encontrada');
      });
  });

  it('Acceso a reservación por usuario autenticado', async () => {

    const reservation = await prisma.reservation.create({
      data: {
        userId: 2,
        excursionId: excursionid,
        seats: {
          create: [{ seatNumber: 'A1' }, { seatNumber: 'A2' }],
        },
      },
    });

    return request(app.getHttpServer())
      .get(`/reservations/${reservation.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('seats');
        expect(body).toHaveProperty('payment');
      });
  });

  it('Acceso a reservación sin token JWT', async () => {

    const reservation = await prisma.reservation.create({
      data: {
        userId: 2,
        excursionId: excursionid,
        seats: {
          create: [{ seatNumber: 'A1' }, { seatNumber: 'A2' }],
        },
      },
    });

    return request(app.getHttpServer())
      .get(`/reservations/${reservation.id}`)
      .expect(401);
  });
});
