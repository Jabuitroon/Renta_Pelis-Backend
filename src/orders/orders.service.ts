import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '../generated/prisma/client';

export type QualityOption = '720p' | '1080p' | '4k';

export interface MovieInCart {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Genre: string;
  Poster: string;
  quality: QualityOption;
  state: 'Alquilar' | 'Comprar';
  days?: number;
  price: Money;
}

type Money = {
  amount: number;
  currency: string;
};

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}
  // Crear una nueva orden (Venta iniciada)
  async createOrder(userId: string, orderItems: MovieInCart[], total: number) {
    const movies = await this.prisma.movie.findMany({
      where: { imdbId: { in: orderItems.map((item) => item.imdbID) } },
    });

    return this.prisma.order.create({
      data: {
        userId,
        totalAmount: total,
        status: 'PENDING',
        items: {
          create: movies.map((m) => ({
            imdbId: m.imdbId,
            price: 10, // Precio congelado al momento de compra
          })),
        },
      },
      include: { items: true },
    });
  }

  // findAll() {
  //   return `This action returns all orders`;
  // }

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
