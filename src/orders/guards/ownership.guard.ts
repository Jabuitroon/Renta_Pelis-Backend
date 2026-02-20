import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CHECK_OWNERSHIP_KEY,
  OwnershipOptions,
} from '../decorators/ownership.decorator';
import { OrdersService } from '../../orders/orders.service'; // O un servicio genérico

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private ordersService: OrdersService, // Inyecta el servicio necesario
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.get<OwnershipOptions>(
      CHECK_OWNERSHIP_KEY,
      context.getHandler(),
    );
    if (!options) return true;

    const request = context.switchToHttp().getRequest();
    console.log(request);

    const user = request.user; // Inyectado por AuthGuard
    const resourceId = request.params[options.paramName];

    if (!user || !resourceId) return false;

    // Lógica de negocio: Buscar el recurso y comparar el owner
    // Aquí usamos OrdersService porque estamos en el contexto de Orders
    const resource = await this.ordersService.findOne(resourceId);

    if (!resource) {
      throw new NotFoundException('Recurso no encontrado');
    }

    // Validar propiedad (Ajusta 'userId' o 'userEmail' según tu DB)
    if (resource.userId !== user.userId) {
      throw new ForbiddenException('No tienes permiso sobre este recurso');
    }

    return true;
  }
}
