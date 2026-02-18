import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '../generated/prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}
  // Crear una nueva orden (Venta iniciada)
  async createOrder(userId: string, dto: CreateOrderDto) {
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
          userId,
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

  findAll() {
    return `This action returns all orders`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} order`;
  // }

  // update(id: number, updateOrderDto: UpdateOrderDto) {
  //   return `This action updates a #${id} order`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} order`;
  // }
}
