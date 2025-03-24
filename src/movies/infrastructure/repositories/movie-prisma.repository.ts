import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { MovieRepository } from '@movies/domain/repositories/movie.repository';
import { Movie } from '@movies/domain/entities/movie.entity';
import { NewMovie, UpdateMovieRepository } from '@movies/domain/interfaces/movie.interface';

@Injectable()
export class MoviePrismaRepository implements MovieRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(inputMovie: NewMovie): Promise<Movie> {
		try {
			return await this.prisma.movie.create({
				data: inputMovie,
			});
		} catch (error) {
			throw new Error(
				`Unexpected error when creating movie: ${error instanceof Error ? error.message : 'Unexpected error'}`,
			);
		}
	}

	async getBy(props: Partial<Movie>): Promise<Movie | null> {
		try {
			return await this.prisma.movie.findFirst({
				where: props,
			});
		} catch (error) {
			throw new Error(
				`Unexpected error when getting movie: ${error instanceof Error ? error.message : 'Unexpected error'}`,
			);
		}
	}

	async update(id: string, movie: UpdateMovieRepository): Promise<Movie> {
		try {
			return await this.prisma.movie.update({
				where: { id },
				data: movie,
			});
		} catch (error) {
			throw new Error(
				`Unexpected error when updating movie: ${error instanceof Error ? error.message : 'Unexpected error'}`,
			);
		}
	}

	async list(): Promise<Movie[]> {
		try {
			return await this.prisma.movie.findMany({
				where: {
					deletedAt: null,
				},
			});
		} catch (error) {
			throw new Error(
				`Unexpected error when listing movies: ${error instanceof Error ? error.message : 'Unexpected error'}`,
			);
		}
	}
}
