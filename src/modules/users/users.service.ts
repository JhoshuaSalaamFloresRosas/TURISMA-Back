import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) { }

  //obtener un usuario por email 
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
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

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  //agegar la logica para que solo se pueda añadir los datos del dto
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
  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    });
    if (!user) {
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
      data:{
        name: user.name,
        lastName: user.lastName
      },
      where: {
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

  async clearVerificationToken(userId: number): Promise<User> {
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

  async deleteUser(id: number, providedEmail?: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si se proporcionó un correo electrónico y si coincide
    if (providedEmail && user.email !== providedEmail) {
      throw new UnauthorizedException('El correo electrónico proporcionado no coincide con el usuario');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'Usuario eliminado correctamente' };
  }

  async updatePhone(userId: number, newPhone: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { phone: newPhone },
    });
  }

}
