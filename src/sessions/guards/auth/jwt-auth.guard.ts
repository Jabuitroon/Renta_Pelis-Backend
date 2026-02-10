import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//   // Aquí puedes personalizar el comportamiento si lo deseas
//   handleRequest(err, user:, info) {
//     // Si hay un error o el usuario no existe (token inválido)
//     if (err || !user) {
//       throw (
//         err || new UnauthorizedException('No tienes permiso para acceder aquí')
//       );
//     }
//     return user;
//   }
// }
