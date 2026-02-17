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

    const { genres, ...movieData } = dto;

    return this.prisma.movie.create({
      data: {
        ...movieData,
        // Detalle técnico: Insertar en la tabla de relación MovieGenre
        genres: {
          create: genres.map((g) => ({
            genre: g,
          })),
        },
      },
      include: {
        genres: true, // Devolver la película con sus géneros
      },
    });
  }

  async findAllMovies() {
    return this.prisma.movie.findMany({
      include: { genres: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(imdbId: string) {
    return this.prisma.movie.findUnique({
      where: { imdbId },
      include: { genres: true },
    });
  }

  update(id: string, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} ${updateMovieDto.title || 'movie'}`;
  }

  remove(id: string) {
    return `This action removes a #${id} movie`;
  }
}
