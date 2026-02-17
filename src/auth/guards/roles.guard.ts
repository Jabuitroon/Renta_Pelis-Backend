import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums';
import { RequestWithUser } from '../interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    // El context existe porque el AuthGuard se ejecuta antes que el RolesGuard, y el AuthGuard (Tuvo que haberse autenticado)agrega el usuario al request
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const { user } = request;
    console.log('Roles', roles, 'User:', user);

    return roles.includes(user.role);
  }
}
