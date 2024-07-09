import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new NotFoundException('No existe authorization header');
    }

    const token = authHeader.split(' ')[1];
    const decoded = this.jwtService.decode(token) as { sub: number };

    if (!decoded || !decoded.sub) {
      throw new UnauthorizedException('Token no valido');
    }

    const userFromDb = await this.prisma.user.findUnique({
      where: {
        id: decoded.sub,
      },
    });

    if (!userFromDb) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!userFromDb || !userFromDb.admin) {
      throw new UnauthorizedException('No tiene permisos para realizar esta acción');
    }

    return true;
  }
}
