import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SessionInterface } from './interfaces/session';
import { Prisma } from '@prisma/client';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}
  private sessionSelector = {
    id: true,
    userId: true,
    userAgent: true,
    ipAddress: true,
    location: true,
    isActive: true,
    expiresAt: true,
    createdAt: true,
    lastUsedAt: true,
  };
  async create(createSessionDto: CreateSessionDto) {
    try {
      const { userId, ...sessionData } = createSessionDto;

      return await this.prisma.session.create({
        data: {
          ...sessionData,
          // Conectamos la sesión con el usuario existente usando su user_id
          user: {
            connect: { user_id: userId },
          },
        },
        select: this.sessionSelector, // Aplicamos el selector aquí
      });
    } catch (error) {
      // Manejo de error: Si el userId no existe en la tabla User
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025' || error.code === 'P2003') {
          throw new NotFoundException(
            `El usuario con ID ${createSessionDto.userId} no existe.`,
          );
        }
      }

      // Error genérico por si algo más falla
      throw new InternalServerErrorException(
        'Error al crear la sesión en la base de datos',
      );
    }
  }

  async findAllUserSessions(userId: string) {
    return await this.prisma.session.findMany({
      where: {
        userId: userId,
        isActive: true,
      },
      select: this.sessionSelector,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(userId: string, payload: UpdateSessionDto) {
    try {
      return await this.prisma.session.update({
        where: {
          userId: userId,
          id: payload.id,
          isActive: true,
        },
        data: payload,
        select: this.sessionSelector,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Usuario con id ${userId} no existe`);
      }
      throw new InternalServerErrorException('Error al actualizar');
    }
  }

  async remove(id: number) {
    return `This action removes a #${id} session`;
  }
}
