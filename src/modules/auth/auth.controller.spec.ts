import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { validate, validateSync } from 'class-validator';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';
import { plainToClass } from 'class-transformer';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let userservice: UsersService;
  let jwt: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        JwtService,
        PrismaService,
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            saveVerificationToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    userservice = module.get<UsersService>(UsersService);
    jwt = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('debe registrar correctamente un nuevo usuario', async () => {
      const createUserDto: CreateUserDto = {
        email: 'davidlh257@gmail.com',
        password: 'Secure123!',
        name: 'David',
        lastName: 'Lozano',
        phone: '+522431063790',
      };

      jest.spyOn(service, 'register').mockResolvedValue(undefined);

      const response = await controller.register(createUserDto);

      expect(response).toEqual({ message: 'Correo electrónico de verificación enviado. Por favor, revisa tu bandeja de entrada.' });
      expect(service.register).toHaveBeenCalledWith(createUserDto);
    });

    it('debe controlar los errores de validación', async () => {
      const invalidDto = {
        name: '',
        password: 'short',
        lastName: '',
        phone: 'invalid_phone',
        email: 'invalid_email',
      };

      const dto = plainToClass(CreateUserDto, invalidDto);

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);

      const messages = errors.flatMap(error => Object.values(error.constraints));
      expect(messages).toContain('El nombre es obligatorio.');
      expect(messages).toContain('La contraseña debe tener al menos 8 caracteres.');
      expect(messages).toContain('El apellido es obligatorio.');
      expect(messages).toContain('El teléfono debe contener solo números y comenzar con "+".');
      expect(messages).toContain('El correo electrónico debe ser una dirección de correo válida.');

      it('debe manejar el error de registro cuando el correo electrónico ya está en uso', async () => {
        const createUserDto: CreateUserDto = {
          email: 'davidlh257@gmail.com',
          password: 'Secure123!',
          name: 'David',
          lastName: 'Lozano',
          phone: '+522431063790',
        };
  
        jest.spyOn(service, 'register').mockRejectedValue(new BadRequestException('Correo electrónico en uso'));
  
        await expect(controller.register(createUserDto)).rejects.toThrow(BadRequestException);
      });
    });
  });
});