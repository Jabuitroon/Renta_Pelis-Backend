import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import type { UserActiveInterface } from '../common/user-active.interface';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums';
import { OwnershipGuard } from './guards/ownership.guard';
import { CheckOwnership } from './decorators/ownership.decorator';
import { OrderStatus } from '../generated/prisma/enums';

@Controller('orders')
@UseGuards(AuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(Role.Client)
  async create(
    @ActiveUser() user: UserActiveInterface,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(user.email, createOrderDto);
  }

  @Get('my-orders')
  @Roles(Role.Client)
  async findUserOrders(@ActiveUser() user: UserActiveInterface) {
    // En un entorno real, el userId vendría del @Request() req.user
    return this.ordersService.findAllUserOrders(user.email);
  }

  @Get()
  @Roles(Role.Admin)
  async findAll(
    @ActiveUser() user: UserActiveInterface,
    @Query('status') status?: OrderStatus, // Un query param opcional
  ) {
    return this.ordersService.findAll(status);
  }

  @Get(':id')
  @Roles(Role.Client)
  @UseGuards(OwnershipGuard) // Guard específico de propiedad
  @CheckOwnership({ resource: 'order', paramName: 'id' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
}
