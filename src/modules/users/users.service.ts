import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  
  constructor(private prisma: PrismaService) {}
    
    //obtener un usuario por email 
    async getUserByEmail(email: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where:{
              email
            }
          });
          //evitar excepcion para retornar estatus 401 con passport
          /*
          if(!user){
            throw new NotFoundException('Usuario no encontrado')
          }
          */
          return user;
    }

    //metodo para registrar usario 

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
          data,
        });
      }
 

  findAll() {
    return `This action returns all users`;
  }

  /**
   * Funcion para buscar un usuario
   * @param id 
   * @returns 
   */
  async findOne(id: number):Promise<User> {
    const user = await this.prisma.user.findUnique({
      where:{
        id
      }
    });
    if(!user){
      throw new NotFoundException("Usuario no encontrado")
    }
    return user
  }

  /**
   * Funcion para actualizar
   * @param id 
   * @param user 
   * @returns 
   */
  async update(id: number, user: Prisma.UserUpdateInput): Promise<User> {
   await this.findOne(id);

   return this.prisma.user.update({
    data: user,
    where:{
      id
    }
   })


  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  //Actualiza el Servicio de Usuarios para Manejar el Token de Verificación
  async findById(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updatePassword(userId: number, hashedPassword: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async saveVerificationToken(userId: number, token: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { verificationToken: token },
    });
  }

  async clearVerificationToken(userId: number): Promise<User>  {
    return this.prisma.user.update({
      where: { id: userId },
      data: { verificationToken: null },
    });
  }
  /////David

  // Encuentra un usuario por su token de verificación
  async findByVerificationToken(token: string): Promise<User> {
    return this.prisma.user.findFirst({ where: { verificationToken: token } });
  }

  // Verifica el correo electrónico de un usuario
  async verifyEmail(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: true, verificationToken: null },
    });
  }

  }
