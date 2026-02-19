import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import type { UserActiveInterface } from '../common/user-active.interface';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums';

@Controller('orders')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Client)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @ActiveUser() user: UserActiveInterface,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    console.log('User', user);

    return this.ordersService.createOrder(user.email, createOrderDto);
  }

  @Get()
  async findAll(@ActiveUser() user: UserActiveInterface) {
    // En un entorno real, el userId vendría del @Request() req.user

    return this.ordersService.findAll(user.email);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.ordersService.findOne(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
}
