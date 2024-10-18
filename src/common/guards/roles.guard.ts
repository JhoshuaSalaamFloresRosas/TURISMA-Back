import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    const token = authHeader.split(' ')[1];

    let decoded = this.jwtService.verify(token);
    console.log(decoded);
    
    const userFromDb = await this.prisma.user.findUnique({
      where: {
        id: decoded.sub,
      },
    });

    if (!userFromDb) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!userFromDb.admin) {
      throw new UnauthorizedException('No tiene permisos para realizar esta acción');
    }

    return true;
  }
}
