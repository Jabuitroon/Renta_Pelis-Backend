import { SetMetadata } from '@nestjs/common';

export const CHECK_OWNERSHIP_KEY = 'checkOwnership';
export interface OwnershipOptions {
  resource: string; // Nombre de la entidad (ej: 'order')
  paramName: string; // Nombre del parámetro en la URL (ej: 'id')
}

export const CheckOwnership = (options: OwnershipOptions) =>
  SetMetadata(CHECK_OWNERSHIP_KEY, options);
