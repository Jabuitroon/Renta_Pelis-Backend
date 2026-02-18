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
import { ActiveUser } from '../common/decorators/active-user.decorator';
import type { UserActiveInterface } from '../common/user-active.interface';
// import { OrderResponse } from './orders.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @ActiveUser() user: UserActiveInterface,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(user.id, createOrderDto);
  }

  // @Get()
  // async findAll(@Query() query: OrderQueryDto): Promise<OrderResponse[]> {
  //   const userId = 'id-extraido-del-jwt';
  //   return this.ordersService.getUserOrders(userId, query.status);
  // }

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
