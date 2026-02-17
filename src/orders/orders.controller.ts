import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderResponse } from './orders.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderResponse> {
    const userId = 'id-extraido-del-jwt';
    const order = await this.ordersService.createOrder(
      userId,
      createOrderDto.movieIds,
    );
    return {
      orderId: 'id-generado',
      userId,
    };
  }

  @Get()
  async findAll(@Query() query: OrderQueryDto): Promise<OrderResponse[]> {
    const userId = 'id-extraido-del-jwt';
    return this.ordersService.getUserOrders(userId, query.status);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.ordersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(+id, updateOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
}
