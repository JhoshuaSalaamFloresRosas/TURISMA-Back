import { Injectable } from '@nestjs/common';
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
              //solo usuario activo
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
 
  /*
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
*/


  //Actualiza el Servicio de Usuarios para Manejar el Token de Verificación
  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updatePassword(userId: number, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async saveVerificationToken(userId: number, token: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { verificationToken: token },
    });
  }

  async clearVerificationToken(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { verificationToken: null },
    });
  }
  /////David
  }
