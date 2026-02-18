import { ConflictException, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}
  async createMovie(dto: CreateMovieDto) {
    const existing = await this.prisma.movie.findUnique({
      where: { imdbId: dto.imdbId },
    });

    if (existing)
      throw new ConflictException('La película ya existe en el catálogo');

    const { genres, prices, ...movieData } = dto;

    return this.prisma.movie.create({
      data: {
        ...movieData,
        genres: { create: genres.map((g) => ({ genre: g })) },
        prices: { create: prices },
      },
      include: { genres: true, prices: true },
    });
  }

  async findAllMovies() {
    return this.prisma.movie.findMany({
      include: { genres: true, prices: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(imdbId: string) {
    return this.prisma.movie.findUnique({
      where: { imdbId },
      include: { genres: true, prices: true },
    });
  }

  async update(imdbId: string, dto: UpdateMovieDto) {
    const { genres, prices, ...movieData } = dto;

    return this.prisma.movie.update({
      where: { imdbId },
      data: {
        ...movieData,
        // Si vienen géneros, borramos los viejos y creamos los nuevos
        ...(genres && {
          genres: {
            deleteMany: {}, // Borra todos los géneros asociados a esta película
            create: genres.map((g) => ({ genre: g })),
          },
        }),
        // Si vienen precios, hacemos lo mismo
        ...(prices && {
          prices: {
            deleteMany: {},
            create: prices,
          },
        }),
      },
      include: { genres: true, prices: true },
    });
  }

  async remove(imdbId: string) {
    // Si tiene Órdenes (OrderItem), Prisma lanzará error de FK.
    return this.prisma.movie.delete({
      where: { imdbId },
    });
  }
}
