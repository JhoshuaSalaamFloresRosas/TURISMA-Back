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

  }
