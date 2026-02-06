import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { HashingService } from '../providers/hashing/hashing.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

  getDbHost() {
    return this.configService.get<string>('DB_HOST');
  }

  async create(payload: CreateUserDto) {
    try {
      // Hashear la contraseña
      const hashedPassword = await this.hashingService.hash(
        payload.password.trim(),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userData } = payload;
      // Guardar en PostgreSQL usando Prisma
      return await this.prisma.user.create({
        data: {
          ...userData,
          passwordHash: hashedPassword,
        },
      });
    } catch (error) {
      // Prisma suele lanzar errores específicos, aquí los capturamos
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        'Error al crear el usuario: ' + errorMessage,
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.user.findMany({
        // Seleccionamos solo lo que queremos mostrar
        select: {
          user_id: true,
          name: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true,
          // No incluimos passwordHash aquí por seguridad
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        'Error al crear el usuario: ' + errorMessage,
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
