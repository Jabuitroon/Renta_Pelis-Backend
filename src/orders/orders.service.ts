import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '../generated/prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  // Método por inyección de dependencia para validar el usuario antes de crear la orden
  async validateUser(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }
  // Crear una nueva orden (Venta iniciada)
  async createOrder(email: string, dto: CreateOrderDto) {
    const user = await this.validateUser(email);

    // 1. Usar una Transacción de Prisma para asegurar integridad
    return this.prisma.$transaction(async (tx) => {
      let total = 0;
      const itemsToCreate: { imdbId: string; price: number }[] = [];

      for (const item of dto.items) {
        // Buscar el precio específico configurado para esa película
        const priceConfig = await tx.moviePrice.findUnique({
          where: {
            movieId_transactionType_quality: {
              movieId: item.imdbId,
              transactionType: item.type,
              quality: item.quality,
            },
          },
        });

        if (!priceConfig) {
          throw new BadRequestException(
            `La película ${item.imdbId} no está disponible en ${item.type} ${item.quality}`,
          );
        }

        total += Number(priceConfig.price);
        itemsToCreate.push({
          imdbId: item.imdbId,
          price: Number(priceConfig.price), // Congelamos el precio actual
        });
      }

      // 2. Crear la Orden y sus detalles
      return tx.order.create({
        data: {
          userId: user.user_id,
          totalAmount: total,
          status: 'PENDING',
          items: {
            create: itemsToCreate,
          },
        },
        include: { items: true },
      });
    });
  }

  async findAll(email: string, status?: OrderStatus) {
    const user = await this.validateUser(email);
    return this.prisma.order.findMany({
      where: {
        userId: user.user_id, // Filtramos por el usuario actual
        ...(status && { status }), // Si viene el status en el query, lo filtramos
      },
      include: {
        items: {
          include: {
            movie: {
              select: {
                title: true,
                poster: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Las más recientes primero
      },
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} order`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}
